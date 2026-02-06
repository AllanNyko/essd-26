const Select = ({ label, name, value, onChange, options, required = true, placeholder = "Selecione..." }) => (
  <label className="field">
    <span>{label}</span>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
)

export default Select
