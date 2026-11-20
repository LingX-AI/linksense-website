/** Add the local, composed huashu-motion soundtrack to an existing tour.
 * Usage: node scripts/add-product-audio.mjs --huashu /path/to/node_modules/huashu-motion --ffmpeg /path/to/ffmpeg
 * No browser, cloud service, microphone, or paid API is used.
 */
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'
const flags = Object.fromEntries(process.argv.slice(2).reduce((all, value, i, args) => value.startsWith('--') ? [...all, [value.slice(2), args[i + 1]]] : all, []))
if (!flags.huashu || !flags.ffmpeg) throw new Error('Pass --huashu and --ffmpeg; see usage above.')
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const engine = await import(pathToFileURL(join(resolve(flags.huashu), 'cli/lib/sound.js')).href)
const score = await readFile(join(root, 'scripts/video-assets/intro-score.abc'), 'utf8')
const hits = [
  { name: 'whoosh', at: 1.15, dur: .35, gain: .18 },
  { name: 'type', at: 3.1, dur: 1.15, gain: .35 },
  { name: 'click', at: 7.75, gain: .42 },
  { name: 'whoosh', at: 8.7, dur: .32, gain: .22 },
  { name: 'paper', at: 9.9, gain: .32, pan: -.15 },
  { name: 'ding', at: 11.55, gain: .2, note: 5, pan: .15 },
  { name: 'whoosh', at: 14.3, dur: .35, gain: .17 },
  { name: 'click', at: 16.25, gain: .38 },
  { name: 'whoosh', at: 19.2, dur: .4, gain: .18 },
  { name: 'tick', at: 20.5, gain: .28 },
  { name: 'chime', at: 24.25, gain: .2 },
]
const result = engine.mixdown({
  id: 'linksense-product-intro', duration: 27.6,
  labels: { 'scene:hook': 0, 'scene:task': 2.8, 'scene:files': 8.2, 'scene:skills': 13.8, 'scene:tools': 18.6, 'scene:logo': 23.7 },
  music: { brand: 'LinkSense', style: 'ambient', bpm: 92, key: 62, scale: 'major', kit: 'clean', seed: 20261120 }, hits,
}, { score })
if (result.composed?.warnings?.length || result.composed?.unmatched?.length) throw new Error(JSON.stringify(result.composed))
// A website product tour uses a calmer -16 LUFS master.
result.out2.scale(10 ** ((-16 - result.finalLufs) / 20))
const temp = await mkdtemp(join(tmpdir(), 'linksense-audio-'))
try {
  const wav = join(temp, 'sound.wav')
  const output = join(temp, 'with-sound.mp4')
  await writeFile(wav, engine.toWav(result.out2))
  const input = join(root, 'public/media/linksense-product-intro.mp4')
  const mux = spawnSync(flags.ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', input, '-i', wav, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-t', '27.6', '-movflags', '+faststart', output], { encoding: 'utf8' })
  if (mux.status) throw new Error(mux.stderr || 'Audio encoding failed')
  // Both files are in local writable locations; copying also works across volumes.
  await writeFile(input, await readFile(output))
  const report = { engine: 'huashu-motion local composer and SFX', duration: 27.6, targetLufs: -16, measuredLufs: Number(engine.loudness(result.out2.L, result.out2.R).toFixed(2)), effects: hits, score: result.composed }
  await writeFile(join(root, 'scripts/video-assets/audio-report.json'), JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify({ lufs: report.measuredLufs, effects: hits.length, score: result.composed }, null, 2))
} finally { await rm(temp, { recursive: true, force: true }) }
