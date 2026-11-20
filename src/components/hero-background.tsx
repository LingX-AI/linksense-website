import { useEffect, useState } from 'react'
import GradientWaves from './GradientWaves'

function useDarkArt() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')
    if (!meta) return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => {
      const value = meta.content
      setDark(value === 'dark' || (value !== 'light' && media.matches))
    }
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(meta, { attributes: true, attributeFilter: ['content'] })
    media.addEventListener('change', sync)
    return () => {
      observer.disconnect()
      media.removeEventListener('change', sync)
    }
  }, [])
  return dark
}

export function HeroBackground() {
  const dark = useDarkArt()
  return (
    <div className="hero-bg" aria-hidden="true">
      <GradientWaves
        horizonColor={dark ? '#17365e' : '#6595dd'}
        waveColor={dark ? '#426fae' : '#bad3f6'}
        crestColor={dark ? '#c9defa' : '#ffffff'}
        lightMode={!dark}
        speed={0.35}
        amplitude={2.4}
        height={7}
        tilt={62}
        zoom={1.05}
        relief={1}
        lightAngle={115}
        sheen={0.35}
        grain={0.16}
        quality="medium"
        intro={false}
        dpr={1.5}
      />
    </div>
  )
}
