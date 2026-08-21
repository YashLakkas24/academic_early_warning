import "./Button.css";

/**
 * Shared Button component.
 *
 * variant: "primary" | "secondary" | "ghost"
 * size:    "medium" | "large"
 * as:      renders a <button> by default, or an <a> element if `href` is passed
 *
 * Using one Button component everywhere means every CTA on every page
 * (Landing, Login, and future dashboards) automatically shares the same
 * look, hover behavior and focus state.
 */
function Button({
  children,
  variant = "primary",
  size = "medium",
  href,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  ...rest
}) {
  const className = `btn btn--${variant} btn--${size} ${fullWidth ? "btn--full" : ""}`;

  const content = (
    <>
      {loading ? <span className="btn__spinner" aria-hidden="true" /> : null}
      <span className="btn__label">{children}</span>
      {icon && !loading ? <span className="btn__icon">{icon}</span> : null}
    </>
  );

  if (href) {
    return (
      <a href={href} className={className} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {content}
    </button>
  );
}

export default Button;
