import { useNavigate } from 'react-router-dom'
import './Materials.css'

const Materials = () => {
  const navigate = useNavigate()

  return (
    <section className="materials">
      <header className="materials-header">
        <h2>Central de Materiais</h2>
        <p>Selecione a ação desejada para gerenciar conteúdos.</p>
      </header>

      <div className="materials-grid">
        <div
          className="materials-card card-upload"
          onClick={() => navigate('/materials/send')}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => event.key === 'Enter' && navigate('/materials/send')}
        >
          <div className="materials-card-content">
            <h3>Enviar materiais</h3>
            <span>Arquivos e conteúdos</span>
          </div>
        </div>

        <div
          className="materials-card card-quiz"
          onClick={() => navigate('/materials/quiz/send')}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => event.key === 'Enter' && navigate('/materials/quiz/send')}
        >
          <div className="materials-card-content">
            <h3>Enviar quizz</h3>
            <span>Criação de avaliações</span>
          </div>
        </div>

        <div
          className="materials-card card-validate"
          onClick={() => navigate('/materials/validate')}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => event.key === 'Enter' && navigate('/materials/validate')}
        >
          <div className="materials-card-content">
            <h3>Validar materiais</h3>
            <span>Revisão e aprovação</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Materials
