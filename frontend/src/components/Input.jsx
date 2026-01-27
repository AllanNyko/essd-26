const Input = ({ label, type = 'text', name, placeholder, value, onChange, required = true, autoComplete }) => (
  <label className="field">
    <span>{label}</span>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      autoComplete={autoComplete}
    />
  </label>
)

export default Input
