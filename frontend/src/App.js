import React, { useState } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './pages/Home/Home';
import Plans from './pages/Plans/Plans';
import Contact from './pages/Contact/Contact';
import FAQ from './pages/FAQ/FAQ';
import About from './pages/About/About';
import Profile from './pages/Profile/Profile';
import Library from './pages/Library/Library';
import Quizz from './pages/Quizz/Quizz';
import Community from './pages/Community/Community';
import Ranking from './pages/Ranking/Ranking';
import Estatistica from './pages/Estatistica/Estatistica';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'plans':
        return <Plans />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact />;
      case 'community':
        return <Community onNavigate={handleNavigate} />;
      case 'ranking':
        return <Ranking />;
      case 'estatistica':
        return <Estatistica />;
      case 'help':
        return <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2>Página de Ajuda (em desenvolvimento)</h2>
        </div>;
      case 'faq':
        return <FAQ />;
      case 'about':
        return <About />;
      case 'library':
        return <Library onNavigate={handleNavigate} />;
      case 'quizz':
        return <Quizz onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'register':
        return <Register onNavigate={handleNavigate} />;
      case 'forgot':
        return <ForgotPassword onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={handleCloseSidebar}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      <main className="app-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
