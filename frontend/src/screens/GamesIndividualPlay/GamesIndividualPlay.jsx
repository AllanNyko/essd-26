import { useState } from 'react'
import './GamesIndividualPlay.css'

const GamesIndividualPlay = () => {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <section className="games-play">
      <header className="materials-header">
        <h2>Modo Individual</h2>
        <p>Responda às perguntas no seu ritmo.</p>
      </header>

      <div className="quiz-card">
        <div className="quiz-card-header">
          <span className="quiz-badge">Pergunta 1</span>
          <h3>Qual é a capital do Brasil?</h3>
        </div>
        <div className="quiz-options">
          <button type="button" className="quiz-option">Brasília</button>
          <button type="button" className="quiz-option">São Paulo</button>
          <button type="button" className="quiz-option">Rio de Janeiro</button>
          <button type="button" className="quiz-option">Belo Horizonte</button>
        </div>
      </div>

      {showIntro && (
        <div className="game-modal-backdrop" role="presentation">
          <div className="game-modal" role="dialog" aria-modal="true">
            <h3>Antes de começar</h3>
            <p>Você responderá um quizz com base nas matérias selecionadas. Leia com atenção e escolha a melhor opção.</p>
            <button type="button" className="primary" onClick={() => setShowIntro(false)}>
              Começar
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default GamesIndividualPlay
