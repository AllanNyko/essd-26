import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import colors from '../../config/colors';
import { logout } from '../../services/authService';

const Sidebar = ({ isOpen, onClose, onNavigate, currentPage }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    const confirmLogout = window.confirm('Tem certeza que deseja sair?');
    if (!confirmLogout) return;

    setIsLoggingOut(true);
    try {
      await logout();
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      onClose();
      onNavigate('login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      alert('Erro ao sair. Tente novamente.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Fechar sidebar ao pressionar ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevenir scroll do body quando sidebar está aberta
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const menuItems = [
    { id: 1, label: 'Home', icon: '🏠', page: 'home' },
    { id: 2, label: 'Meus dados', icon: '👤', page: 'profile' },
    { id: 3, label: 'Planos', icon: '💎', page: 'plans' },
    { id: 4, label: 'Fale Conosco', icon: '📧', page: 'contact' },
    { id: 5, label: 'Comunidade', icon: '👥', page: 'community' },
    { id: 6, label: 'Ranking', icon: '🏆', page: 'ranking' },
    { id: 7, label: 'Estatistica', icon: '📊', page: 'estatistica' },
    { id: 8, label: 'Ajuda', icon: '❓', page: 'help' },
    { id: 9, label: 'Perguntas Frequentes', icon: '💬', page: 'faq' },
    { id: 10, label: 'Sobre', icon: 'ℹ️', page: 'about' },
    { id: 11, label: 'Biblioteca', icon: '📚', page: 'library' },
    { id: 12, label: 'Login', icon: '🔐', page: 'login' },
    { id: 13, label: 'Cadastro', icon: '📝', page: 'register' },
    { id: 14, label: 'Recuperar Senha', icon: '🔑', page: 'forgot' },
  ];

  return (
    <>
      {/* Overlay - fundo escuro quando sidebar está aberta */}
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        style={{ backgroundColor: colors.overlay.medium }}
      />

      {/* Sidebar */}
      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{ backgroundColor: colors.background.paper }}
      >
        <div className="sidebar-header" style={{ borderBottomColor: colors.divider }}>
          <h2 style={{ color: colors.text.primary }}>Menu</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Fechar menu"
            style={{ color: colors.text.primary }}
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="menu-list">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`menu-item ${currentPage === item.page ? 'active' : ''}`}
                  onClick={() => onNavigate(item.page)}
                  style={{
                    color: colors.text.primary,
                    backgroundColor: currentPage === item.page 
                      ? colors.primary.light 
                      : 'transparent',
                  }}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social Links */}
        <div className="sidebar-social">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-button"
            style={{
              backgroundColor: colors.background.default,
              borderColor: colors.divider,
            }}
          >
            <span>📷</span>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-button"
            style={{
              backgroundColor: colors.background.default,
              borderColor: colors.divider,
            }}
          >
            <span>💼</span>
          </a>
          <a
            href="https://wa.me/5513974116753"
            target="_blank"
            rel="noopener noreferrer"
            className="social-button"
            style={{
              backgroundColor: colors.background.default,
              borderColor: colors.divider,
            }}
          >
            <span>💬</span>
          </a>
          <button
            className="social-button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Confira este site!',
                  text: 'Sistema de Estudos',
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copiado para a área de transferência!');
              }
            }}
            style={{
              backgroundColor: colors.background.default,
              borderColor: colors.divider,
            }}
          >
            <span>🔗</span>
          </button>
        </div>

        <div className="sidebar-footer" style={{ borderTopColor: colors.divider }}>
          <button
            className="logout-button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{
              color: colors.error.main,
              borderColor: colors.error.main,
              opacity: isLoggingOut ? 0.6 : 1,
              cursor: isLoggingOut ? 'not-allowed' : 'pointer',
            }}
          >
            <span>🚪</span>
            <span>{isLoggingOut ? 'Saindo...' : 'Sair'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
