const TextInput = ({
  label,
  id,
  type = "text",
  placeholder,
  className,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => (
  <div className="flex flex-col items-start gap-1 w-full">
    {/* Label */}
    <label
      className="text-[13px] font-medium text-black/40 leading-relaxed"
      htmlFor={id}
    >
      {label}
    </label>

    {/* Input */}
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      className={`${className} ${
        touched && error
          ? "border border-solid border-red-500 focus:ring-red-500"
          : "border-[#e5e5e5]"
      }`}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />

    {/* Validation Error */}
    {touched && error && (
      <span className="text-red-600 italic mt-1 text-[12px]">{error}</span>
    )}
  </div>
);

export default TextInput;
