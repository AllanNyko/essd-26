import { useNavigate } from 'react-router-dom'
import './GamesCenter.css'

const GamesCenter = () => {
  const navigate = useNavigate()

  return (
    <section className="games-center">
      <header className="materials-header">
        <h2>Central Games</h2>
        <p>Escolha um jogo para treinar seus conhecimentos.</p>
      </header>

      <div className="games-grid">
        <div
          className="games-card game-quiz"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/games/individual')}
          onKeyDown={(event) => event.key === 'Enter' && navigate('/games/individual')}
        >
          <div className="games-card-content">
            <h3>Modo Individual</h3>
            <span>Responda perguntas no seu ritmo.</span>
          </div>
        </div>

        <div className="games-card game-memory">
          <div className="games-card-content">
            <h3>Modo Desafio</h3>
            <span>Desafie seus amigos e teste seus conhecimentos.</span>
          </div>
        </div>

        <div
          className="games-card game-speed"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/games/survivor')}
          onKeyDown={(event) => event.key === 'Enter' && navigate('/games/survivor')}
        >
          <div className="games-card-content">
            <h3>Modo Survivor</h3>
            <span>Acerte o máximo de perguntas. Se errar uma, o jogo termina.</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GamesCenter
