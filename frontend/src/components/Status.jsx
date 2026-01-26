const Status = ({ error, success, loading }) => (
  <div className="status">
    {loading && <span className="muted">Enviando...</span>}
    {error && <span className="error">{error}</span>}
    {success && <span className="success">{success}</span>}
  </div>
)

export default Status
