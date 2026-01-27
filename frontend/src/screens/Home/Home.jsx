import './Home.css'

const Home = ({ user, onLogout }) => {
  return (
    <div className="home">
      <section className="home-content">
        <div className="card">
          <div className="card-header">
            <h2>Home</h2>
            <p>Login realizado com sucesso. Você está autenticado.</p>
          </div>
          <div className="home-summary">
            <div>
              <span className="label">Nome</span>
              <strong>{user?.name || '-'}</strong>
            </div>
            <div>
              <span className="label">E-mail</span>
              <strong>{user?.email || '-'}</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
