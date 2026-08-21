import SignalThread from "./SignalThread";

const STEPS = [
  {
    n: "01",
    title: "Collect academic indicators",
    desc: "Attendance, internal assessments and assignment completion, brought into one place.",
  },
  {
    n: "02",
    title: "Analyze performance patterns",
    desc: "Track how each student is trending over time, not just their latest score.",
  },
  {
    n: "03",
    title: "Detect emerging risk",
    desc: "Surface students whose trajectory is changing early — before results make it obvious.",
  },
  {
    n: "04",
    title: "Explain contributing factors",
    desc: "Show faculty why a student is flagged, in plain, understandable language.",
  },
  {
    n: "05",
    title: "Support intervention",
    desc: "Turn a detected signal into a concrete, timely next step.",
  },
];

function SolutionSection() {
  return (
    <section className="solution" id="solution">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">The solution</span>
          <h2 className="section-title">From early signal to timely action.</h2>
          <p className="section-sub">
            Academic Early Warning turns the same scattered signals into a single, connected
            trajectory — so risk becomes visible while there is still time to act on it.
          </p>
        </div>

        <div className="solution__thread">
          <SignalThread stage="connecting" />
        </div>

        <div className="solution__steps">
          {STEPS.map((step) => (
            <div className="solution__step" key={step.n}>
              <span className="solution__step-n">{step.n}</span>
              <h3 className="solution__step-title">{step.title}</h3>
              <p className="solution__step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SolutionSection;
