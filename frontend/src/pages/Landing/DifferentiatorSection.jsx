const COMBINES = [
  "Academic performance",
  "Attendance",
  "Performance trends",
  "Explainable risk signals",
  "Career interests",
  "Transferable skills",
  "Skill gaps",
  "Personalized roadmap",
  "Timely intervention",
];

function DifferentiatorSection() {
  return (
    <section className="differentiator" id="differentiator">
      <div className="container differentiator__inner">
        <span className="eyebrow">What makes E.A.R.N. different</span>

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

        <div className="differentiator__statement differentiator__statement--nav">
          <p className="differentiator__line differentiator__line--muted">And beyond risk, we ask:</p>
          <p className="differentiator__line differentiator__line--answer">
            &ldquo;Where could this student go —{" "}
            <span className="differentiator__highlight differentiator__highlight--nav">
              and what&apos;s already carrying them there?&rdquo;
            </span>
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
