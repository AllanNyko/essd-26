import React from 'react';
import './QuizzPreparationModal.css';
import colors from '../../config/colors';

const QuizzPreparationModal = ({ category, onStart, onCancel, userName = 'Estudante' }) => {
  return (
    <div className="preparation-modal-overlay">
      <div 
        className="preparation-modal"
        style={{ backgroundColor: colors.background.paper }}
      >
        {/* Ícone de Aviso */}
        <div className="modal-icon">
          <div className="icon-circle">
            <span className="icon-emoji">⏱️</span>
          </div>
        </div>

        {/* Título */}
        <h2 style={{ color: colors.text.primary }}>
          {userName}, prepare-se para o desafio!
        </h2>

        {/* Informações sobre a categoria */}
        <div 
          className="category-info"
          style={{ 
            backgroundColor: colors.background.default,
            borderColor: colors.divider 
          }}
        >
         {/* <span className="category-icon">{category.icon}</span>*/}
          <span style={{ color: colors.text.primary }}>{category.name}</span>
        </div>

        {/* Instruções */}
        <div className="instructions">
          <div 
            className="instruction-item"
            style={{ backgroundColor: `${colors.primary.main}10` }}
          >
            <span className="instruction-icon">🎯</span>
            <div className="instruction-text">
              <h4 style={{ color: colors.text.primary }}>10 Perguntas</h4>
              <p style={{ color: colors.text.secondary }}>
                Responda todas as questões do quiz
              </p>
            </div>
          </div>

          <div 
            className="instruction-item"
            style={{ backgroundColor: `${colors.primary.main}10` }}
          >
            <span className="instruction-icon">⏰</span>
            <div className="instruction-text">
              <h4 style={{ color: colors.text.primary }}>30 segundos por pergunta</h4>
              <p style={{ color: colors.text.secondary }}>
                Cada questão tem um tempo limite
              </p>
            </div>
          </div>

          <div 
            className="instruction-item"
            style={{ backgroundColor: `${colors.primary.main}10` }}
          >
            <span className="instruction-icon">⚡</span>
            <div className="instruction-text">
              <h4 style={{ color: colors.text.primary }}>Pontuação por velocidade</h4>
              <p style={{ color: colors.text.secondary }}>
                Quanto mais rápido responder, mais pontos ganha
              </p>
            </div>
          </div>
        </div>

        {/* Aviso Importante */}
        <div 
          className="warning-box"
          style={{ 
            backgroundColor: '#fff3cd',
            borderColor: '#ffc107',
          }}
        >
          <span className="warning-icon">⚠️</span>
          <p style={{ color: '#856404' }}>
            <strong>Importante:</strong> O timer inicia assim que você começar o quiz. 
            Certifique-se de estar preparado antes de continuar!
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="modal-actions">
          <button
            className="cancel-button"
            onClick={onCancel}
            style={{
              backgroundColor: 'transparent',
              color: colors.text.secondary,
              border: `2px solid ${colors.divider}`,
            }}
          >
            Voltar
          </button>
          <button
            className="start-button"
            onClick={onStart}
            style={{
              backgroundColor: colors.primary.main,
              color: colors.text.white,
            }}
          >
            <span>Estou Ciente</span>
            <span className="start-icon">🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizzPreparationModal;
