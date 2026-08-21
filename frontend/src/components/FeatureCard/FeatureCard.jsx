import "./FeatureCard.css";

/**
 * Shared FeatureCard.
 * `size` controls how much visual weight the card gets in the bento-style
 * features grid: "hero" (primary feature), "wide" (secondary feature), or
 * "default" (supporting features).
 */
function FeatureCard({
  index,
  icon,
  title,
  description,
  size = "default",
  accent = "primary",
  visual,
  children,
}) {
  return (
    <article className={`feature-card feature-card--${size} feature-card--${accent}`}>
      <div className="feature-card__top">
        <span className="feature-card__icon" aria-hidden="true">
          {icon}
        </span>
        <span className="feature-card__index">{index}</span>
      </div>

      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__desc">{description}</p>

      {visual ? <div className="feature-card__visual">{visual}</div> : null}
      {children}
    </article>
  );
}

export default FeatureCard;
