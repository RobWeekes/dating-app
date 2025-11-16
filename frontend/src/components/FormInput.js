/**
 * Form component - Reusable form input wrapper
 */
function FormInput({ label, name, type = 'text', value, onChange, placeholder = '', required = false }) {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="form-input"
      />
    </div>
  );
}

export default FormInput;
