import { useNavigate } from 'react-router-dom'
import './MaterialsSend.css'

const MATERIAL_TYPES = [
  { id: 'apostila', label: 'Apostila', description: 'Conteúdo completo' },
  { id: 'resumo', label: 'Resumo', description: 'Resumo objetivo' },
  { id: 'mapa-mental', label: 'Mapa Mental', description: 'Visual organizado' },
]

const MaterialsSend = () => {
  const navigate = useNavigate()

  return (
    <section className="materials-send">
      <header className="materials-header">
        <h2>Enviar Materiais</h2>
        <p>Escolha o tipo de material antes de enviar.</p>
      </header>

      <div className="materials-grid">
        {MATERIAL_TYPES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`materials-card card-${item.id}`}
            onClick={() => navigate(`/materials/send/${item.id}`)}
          >
            <div className="materials-card-content">
              <h3>{item.label}</h3>
              <span>{item.description}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

export default MaterialsSend
