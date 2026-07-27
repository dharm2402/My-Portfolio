function Header({ name, themeColor }) {
  return (
    <header className="site-header" style={{ '--theme-color': themeColor }}>
      <div>
        <p className="eyebrow">Student Portfolio</p>
        <h1>Hi, I’m {name}</h1>
        <p className="lead">I build modern web experiences with React, Vite, and clean UI design.</p>
      </div>
    </header>
  )
}

export default Header
