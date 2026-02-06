const Textarea = ({ label, name, placeholder, value, onChange, required = true, rows = 4 }) => (
  <label className="field">
    <span>{label}</span>
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      rows={rows}
    />
  </label>
)

export default Textarea
