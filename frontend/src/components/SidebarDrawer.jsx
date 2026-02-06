import { NavLink } from 'react-router-dom'
import './SidebarDrawer.css'

const SidebarDrawer = ({ open, onClose, onLogout, user }) => {
  const isAdmin = user?.role === 'admin'
  const isVendor = user?.role === 'vendor'
  const isStudent = user?.role === 'student' || !user?.role

  return (
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
          <NavLink to="/stats" onClick={onClose}>Central de Estatísticas</NavLink>
          <NavLink to="/ranking" onClick={onClose}>Ranking</NavLink>
          
          <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
          <div style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
            🛒 E-Shop
          </div>
          <NavLink to="/shop" onClick={onClose}>Loja de Produtos</NavLink>
          <NavLink to="/cart" onClick={onClose}>Carrinho</NavLink>
          
          {(isVendor || isAdmin) && (
            <>
              <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
              <div style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                📦 Área do Vendedor
              </div>
              <NavLink to="/vendor/register" onClick={onClose}>Meu Perfil de Vendedor</NavLink>
              <NavLink to="/vendor/products" onClick={onClose}>Meus Produtos</NavLink>
              <NavLink to="/vendor/orders" onClick={onClose}>Meus Pedidos</NavLink>
            </>
          )}
          
          {isStudent && !isVendor && (
            <>
              <NavLink to="/vendor/register" onClick={onClose}>Quero ser Vendedor</NavLink>
            </>
          )}
          
          {isAdmin && (
            <>
              <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
              <div style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                ⚙️ Administração E-Shop
              </div>
              <NavLink to="/admin/categories" onClick={onClose}>Gerenciar Categorias</NavLink>
              <NavLink to="/admin/vendors" onClick={onClose}>Gerenciar Vendedores</NavLink>
            </>
          )}
          
          <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-color)' }} />
          <div style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
            ⚙️ Gerenciamento
          </div>
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
}

export default SidebarDrawer
