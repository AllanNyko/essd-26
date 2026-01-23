import React from 'react';
import './Header.css';
import colors from '../../config/colors';

const Header = ({ onMenuClick }) => {
  return (
    <header className="header" style={{ backgroundColor: colors.primary.main }}>
      <div className="header-content">
        <h1 className="header-title" style={{ color: colors.text.white }}>
          ESSD App
        </h1>
        
        <button 
          className="hamburger-menu"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <span style={{ backgroundColor: colors.text.white }}></span>
          <span style={{ backgroundColor: colors.text.white }}></span>
          <span style={{ backgroundColor: colors.text.white }}></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
