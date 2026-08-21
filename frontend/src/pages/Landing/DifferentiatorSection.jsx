const COMBINES = [
  "Academic performance",
  "Attendance",
  "Performance trends",
  "Explainable risk signals",
  "Career interests",
  "Skill gaps",
  "Timely intervention",
];

function DifferentiatorSection() {
  return (
    <section className="differentiator" id="differentiator">
      <div className="container differentiator__inner">
        <span className="eyebrow">What makes this different</span>

        <div className="differentiator__statement">
          <p className="differentiator__line differentiator__line--muted">We don&apos;t only ask:</p>
          <p className="differentiator__line differentiator__line--question">
            &ldquo;How is the student performing?&rdquo;
          </p>
          <p className="differentiator__line differentiator__line--muted">We ask:</p>
          <p className="differentiator__line differentiator__line--answer">
            &ldquo;Is the student&apos;s trajectory changing —{" "}
            <span className="differentiator__highlight">and when should someone act?</span>&rdquo;
          </p>
        </div>

        <ul className="differentiator__chips">
          {COMBINES.map((item) => (
            <li key={item} className="differentiator__chip">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default DifferentiatorSection;
