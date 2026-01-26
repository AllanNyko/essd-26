import { NavLink } from 'react-router-dom'
import './SidebarDrawer.css'

const SidebarDrawer = ({ open, onClose, onLogout }) => (
  <>
    <aside className={`drawer ${open ? 'open' : ''}`}>
      <div className="drawer-header">
        <h3>Navegação</h3>
        <button className="icon-button" onClick={onClose} aria-label="Fechar menu">
          ✕
        </button>
      </div>
      <nav className="drawer-links">
        <NavLink to="/home" onClick={onClose}>Home</NavLink>
        <NavLink to="/materials" onClick={onClose}>Central de Materiais</NavLink>
        <NavLink to="/notes" onClick={onClose}>Central de Notas</NavLink>
        <NavLink to="/games" onClick={onClose}>Central Games</NavLink>
        <NavLink to="/manage/subjects" onClick={onClose}>Gerenciar Matérias</NavLink>
        <NavLink to="/manage/notices" onClick={onClose}>Gerenciar Editais</NavLink>
        <NavLink to="/manage/plans" onClick={onClose}>Gerenciar Planos</NavLink>
        <NavLink to="/profile" onClick={onClose}>Alterar dados</NavLink>
        <button className="logout" onClick={onLogout}>Logout</button>
      </nav>
    </aside>
    {open && <div className="drawer-backdrop" onClick={onClose} />}
  </>
)

export default SidebarDrawer
