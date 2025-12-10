/**
 * Form component - Reusable form input wrapper
 */
function FormInput({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  error = '',
  min,
  max,
  step,
  options = []
}) {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}{required && <span className="required">*</span>}</label>}
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`form-input ${error ? 'error' : ''}`}
          rows="4"
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`form-input ${error ? 'error' : ''}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`form-input ${error ? 'error' : ''}`}
          min={min}
          max={max}
          step={step}
        />
      )}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}

export default FormInput;
