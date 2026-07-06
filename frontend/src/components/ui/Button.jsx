import Spinner from "./Spinner";

function Button({
  children,
  type = "button",
  variant = "primary",
  isLoading = false,
  disabled = false,
  className = "",
  ...props
}) {
  const buttonClassName = ["button", `button--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}

export default Button;
