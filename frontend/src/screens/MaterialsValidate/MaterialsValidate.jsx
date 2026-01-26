import './MaterialsValidate.css'

const MaterialsValidate = () => (
  <section className="materials-validate">
    <header className="materials-header">
      <h2>Validar Materiais</h2>
      <p>Revise os materiais enviados antes de aprovar.</p>
    </header>

    <div className="materials-validate-empty">
      <div className="card">
        <div className="card-header">
          <h3>Sem pendências</h3>
          <p>Nenhum material aguardando validação no momento.</p>
        </div>
      </div>
    </div>
  </section>
)

export default MaterialsValidate
