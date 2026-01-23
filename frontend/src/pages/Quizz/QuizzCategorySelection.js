import React, { useState } from 'react';
import './QuizzCategorySelection.css';
import colors from '../../config/colors';

const QuizzCategorySelection = ({ onSelectCategory, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Lista de matérias disponíveis
  const subjects = [
    { id: 'matematica', name: 'Matemática', icon: '📐', color: '#667eea' },
    { id: 'portugues', name: 'Português', icon: '📚', color: '#f093fb' },
    { id: 'historia', name: 'História', icon: '🏛️', color: '#4facfe' },
    { id: 'geografia', name: 'Geografia', icon: '🌍', color: '#43e97b' },
    { id: 'ciencias', name: 'Ciências', icon: '🔬', color: '#fa709a' },
    { id: 'ingles', name: 'Inglês', icon: '🗣️', color: '#30cfd0' },
    { id: 'fisica', name: 'Física', icon: '⚛️', color: '#a8edea' },
    { id: 'quimica', name: 'Química', icon: '🧪', color: '#fed6e3' },
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    if (subjectId) {
      const subject = subjects.find(s => s.id === subjectId);
      setSelectedCategory(subject);
    }
  };

  const handleConfirm = () => {
    if (selectedCategory) {
      onSelectCategory(selectedCategory);
    }
  };

  return (
    <div className="category-selection-page" style={{ backgroundColor: colors.background.default }}>
      <div className="category-container">
        {/* Header */}
        <div className="category-header">
          <button 
            className="back-button"
            onClick={onBack}
            style={{ color: colors.text.primary }}
          >
            <span className="back-arrow">←</span>
            <span>Voltar</span>
          </button>
          
          <div className="category-title-section">
            <h1 style={{ color: colors.text.primary }}>
              Escolha a Categoria
            </h1>
            <p style={{ color: colors.text.secondary }}>
              Selecione uma matéria específica ou jogue com um mix de todas
            </p>
          </div>
        </div>

        {/* Mix Option (Destaque) */}
        <div 
          className={`mix-option ${selectedCategory?.id === 'mix' ? 'selected' : ''}`}
          onClick={() => handleCategoryClick({ id: 'mix', name: 'Mix de Matérias', icon: '🎲' })}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <div className="mix-content">
            <div className="mix-icon">🎲</div>
            <div className="mix-text">
              <h3>Mix de Matérias</h3>
              <p>Perguntas aleatórias de todas as matérias disponíveis</p>
            </div>
            <div className="mix-badge">Recomendado</div>
          </div>
          {selectedCategory?.id === 'mix' && (
            <div className="check-icon">✓</div>
          )}
        </div>

        {/* Matérias Específicas */}
        <div className="subjects-section">
          <h2 style={{ color: colors.text.primary }}>
            Matérias Específicas
          </h2>
          
          <div className="select-wrapper">
            <select
              className="subject-select"
              value={selectedCategory?.id === 'mix' ? '' : (selectedCategory?.id || '')}
              onChange={handleSubjectChange}
              style={{
                backgroundColor: colors.background.paper,
                color: colors.text.primary,
                borderColor: colors.divider,
              }}
            >
              <option value="" disabled>
                Selecione uma matéria
              </option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.icon} {subject.name}
                </option>
              ))}
            </select>
            <span className="select-arrow" style={{ color: colors.text.secondary }}>
              ▼
            </span>
          </div>

          {selectedCategory && selectedCategory.id !== 'mix' && (
            <div 
              className="selected-subject-display"
              style={{
                backgroundColor: colors.background.paper,
                borderColor: selectedCategory.color,
              }}
            >
              <div 
                className="selected-subject-icon"
                style={{ backgroundColor: `${selectedCategory.color}20` }}
              >
                <span>{selectedCategory.icon}</span>
              </div>
              <div className="selected-subject-info">
                <h3 style={{ color: colors.text.primary }}>{selectedCategory.name}</h3>
                <p style={{ color: colors.text.secondary }}>Matéria selecionada</p>
              </div>
              <div 
                className="selected-check"
                style={{ backgroundColor: selectedCategory.color }}
              >
                ✓
              </div>
            </div>
          )}
        </div>

        {/* Botão Confirmar */}
        <div className="confirm-section">
          <button
            className="confirm-button"
            onClick={handleConfirm}
            disabled={!selectedCategory}
            style={{
              backgroundColor: selectedCategory ? colors.primary.main : colors.grey[400],
              color: colors.text.white,
            }}
          >
            <span>Continuar</span>
            <span className="button-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizzCategorySelection;
