const FormCard = ({ title, description, onSubmit, children, actionLabel, footer, disabled = false, headerRight = null }) => (
  <div className="card">
    <div className="card-header">
      <div className="card-header-content">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {headerRight && <div className="card-header-actions">{headerRight}</div>}
    </div>
    <form className="form" onSubmit={onSubmit}>
      {children}
      <button type="submit" className="primary" disabled={disabled}>{actionLabel}</button>
    </form>
    {footer}
  </div>
)

export default FormCard
