import { useNavigate } from 'react-router-dom'
import './MaterialsValidate.css'

const MaterialsValidate = () => {
  const navigate = useNavigate()

  return (
    <section className="materials-validate">
      <header className="materials-header">
        <h2>Validar Materiais</h2>
        <p>Revise os materiais enviados antes de aprovar.</p>
      </header>

      <div className="materials-validate-options">
        <button type="button" className="materials-validate-card">
          <div className="card-header">
            <h3>Validar materiais</h3>
            <p>Revisar arquivos e conteúdos enviados.</p>
          </div>
        </button>

        <button
          type="button"
          className="materials-validate-card"
          onClick={() => navigate('/materials/validate/quiz')}
        >
          <div className="card-header">
            <h3>Validar quizz</h3>
            <p>Revisar perguntas e alternativas.</p>
          </div>
        </button>
      </div>
    </section>
  )
}

export default MaterialsValidate
