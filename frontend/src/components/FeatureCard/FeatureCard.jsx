import "./FeatureCard.css";

/**
 * Shared FeatureCard.
 * `size` controls how much visual weight the card gets in the bento-style
 * features grid: "hero" (primary feature), "wide" (secondary feature),
 * "compact-2" or "compact-3" (supporting features, sized to keep every
 * row summing to 6 columns with no gaps).
 * `accent` controls the icon color: "primary" (blue, default), "secondary"
 * (violet), or "nav" (teal, used for Student Navigation capabilities).
 */
function FeatureCard({
  index,
  icon,
  title,
  description,
  size = "compact-2",
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
