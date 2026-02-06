import { useState } from 'react'
import SidebarDrawer from './SidebarDrawer'
import './AppNavbar.css'

const AppNavbar = ({ user, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <header className="app-navbar">
      <div className="app-navbar-title">Bem-vindo, {user?.name || 'Usuário'}</div>
      <div className="app-navbar-meta">ESSD</div>
      <button className="icon-button" onClick={() => setDrawerOpen(true)} aria-label="Abrir menu">
        ☰
      </button>

      <SidebarDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLogout={onLogout}
        user={user}
      />
    </header>
  )
}

export default AppNavbar
