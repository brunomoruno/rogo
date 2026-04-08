type StickyNavProps = {
  visible: boolean
}

export function StickyNav({ visible }: StickyNavProps) {
  return (
    <header className={`sticky-nav ${visible ? 'sticky-nav--visible' : ''}`} role="banner">
      <div className="sticky-nav__inner sticky-nav__inner--minimal">
        <a href="#top" className="sticky-nav__logo">
          felix launch
        </a>
      </div>
    </header>
  )
}
