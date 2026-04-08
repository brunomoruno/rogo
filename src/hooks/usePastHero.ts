import { useEffect, useState, type RefObject } from 'react'

/** True when the hero element has scrolled out of view (top above viewport). */
export function usePastHero(heroRef: RefObject<HTMLElement | null>): boolean {
  const [past, setPast] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const el = heroRef.current
      if (!el) return
      setPast(el.getBoundingClientRect().bottom < 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [heroRef])

  return past
}
