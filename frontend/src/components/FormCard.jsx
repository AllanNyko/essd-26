const FormCard = ({ title, description, onSubmit, children, actionLabel, footer, disabled = false }) => (
  <div className="card">
    <div className="card-header">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
    <form className="form" onSubmit={onSubmit}>
      {children}
      <button type="submit" className="primary" disabled={disabled}>{actionLabel}</button>
    </form>
    {footer}
  </div>
)

export default FormCard
