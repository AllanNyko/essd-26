import { useState } from 'react'
import SidebarDrawer from '../../components/SidebarDrawer'
import './Home.css'

const Home = ({ user, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="home">
      <header className="home-navbar">
        <div className="home-title">Bem-vindo, {user?.name || 'Usuário'}</div>
        <div className="home-meta">ESSD</div>
        <button className="icon-button" onClick={() => setDrawerOpen(true)} aria-label="Abrir menu">
          ☰
        </button>
      </header>

      <SidebarDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLogout={onLogout}
      />

      <section className="home-content">
        <div className="card">
          <div className="card-header">
            <h2>Home</h2>
            <p>Login realizado com sucesso. Você está autenticado.</p>
          </div>
          <div className="home-summary">
            <div>
              <span className="label">Nome</span>
              <strong>{user?.name || '-'}</strong>
            </div>
            <div>
              <span className="label">E-mail</span>
              <strong>{user?.email || '-'}</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
