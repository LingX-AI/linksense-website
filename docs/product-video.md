# Product introduction video

`public/media/linksense-product-intro.mp4` is an authored, illustrative product tour generated on 2026-11-20. It uses the current LinkSense Figma exports and the approved blue logo; it contains no footage from the previous website videos.

- Format: 1280 × 720, 30 fps, H.264 / `yuv420p`, MP4 with `faststart`.
- Duration: 27.6 seconds.
- Language: English on-screen text, matching the source interface.
- Audio: locally composed marimba, Rhodes and bass score, plus eleven timed interface/transition effects; stereo AAC at 160 kb/s, mastered to −16 LUFS. No narration.
- Data: sample enrollment data from the supplied design, labeled as illustrative within the video.
- Poster: `public/media/linksense-product-poster.webp`, rendered from the same tour at 11 seconds.

## Visual sources

All product pixels are from the following approved frames in [LinkSense Figma](https://www.figma.com/design/GIy53t29UhECq6RxUx2CbA/Linksense?node-id=1-44868):

| Asset | Figma node | Role |
| --- | --- | --- |
| `figma-workspace.webp` | `1:146744` | Conversation, task prompt and response |
| `figma-overview.webp` | `1:175085` | Output files and original sources |
| `figma-skills.webp` | `1:87526` | Reusable skills |
| `figma-apps.webp` | `1:86762` | Shared applications |
| `figma-connections.webp` | `1:87897` | Business-tool connections |

The logo raster in `scripts/video-assets/figma-logo.png` is a 960 px wide export of `public/brand/figma-lockup-light.svg`. Its paths and blue `#1866E1` are unchanged. See [brand source](brand-assets.md).

## Motion and reproduction

The tour is a real video with an authored sequence: title arrival; masking the existing prompt text and revealing the original reply; opening the source task-overview panel; cursor movement to the two output files; skills-to-apps transition; connector focus; closing message. Camera pushes, easing and crossfades link these moments. It is a product illustration, not a recording of a live backend execution.

The render source is `scripts/generate-product-intro.py`. It requires Python 3, Pillow, and FFmpeg with `libx264`:

```sh
python3 scripts/generate-product-intro.py --ffmpeg /path/to/ffmpeg
```

Use `--font /path/to/font.ttf` to override the default macOS Helvetica Neue font, or `--contact-sheet /path/to/contact-sheet.jpg` to inspect six narrative moments. The font fallback is DejaVu Sans. The video has no runtime network dependency. The encoder used for this export came from the npm registry package `@ffmpeg-installer/darwin-arm64` version `4.1.5` (FFmpeg 4.4).

`ProductVideoLink` opens the MP4 in a native video player with controls. The hero, team workbench and supporting video entry use this same player, title, caption note and video source. The workbench retains its contextual Figma screen, with an explicit video play action instead of a separate design gallery. First loading occurs only when the visitor opens the video. Closing, Escape, backdrop dismissal and hidden-page events pause playback; reopening starts at the beginning, and focus returns to the trigger.

## Sound and reproduction

The soundtrack uses the installed huashu-motion local composer and synthesizer. The original ABC score is `scripts/video-assets/intro-score.abc`; it follows the opening, file delivery and closing marks. Clicks, typing, paper movement, transitions and a closing chime match the picture. It uses no downloaded music, external recording or paid API. `scripts/video-assets/audio-report.json` records the cue times and composition validation.

After rendering the picture, add or replace its audio without re-encoding the video:

```sh
node scripts/add-product-audio.mjs --huashu /path/to/node_modules/huashu-motion --ffmpeg /path/to/ffmpeg
```

The sound is enabled by the visitor's play action; the page does not autoplay audible media.
