import { forwardRef, useId } from "react";

const Input = forwardRef(function Input(
  { label, error, helperText, className = "", id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const inputClassName = [
    "form-input",
    error ? "form-input--error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="form-field">
      {label ? (
        <label className="form-label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}

      <input
        ref={ref}
        id={inputId}
        className={inputClassName}
        aria-invalid={Boolean(error)}
        {...props}
      />

      {error ? (
        <p className="form-error">{error}</p>
      ) : helperText ? (
        <p className="form-helper">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
