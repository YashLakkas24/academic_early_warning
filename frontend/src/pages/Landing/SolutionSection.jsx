import SignalThread from "./SignalThread";

const FACULTY_FLOW = ["Academic Data", "Risk Detection", "Explanation", "Intervention"];
const STUDENT_FLOW = [
  "Interest",
  "Adaptive Discovery",
  "Analysis",
  "Direction",
  "Skills",
  "Transferable Skills",
  "Skill Gap",
  "Roadmap",
];

function MiniFlow({ items, accent }) {
  return (
    <ol className={`mini-flow mini-flow--${accent}`}>
      {items.map((item, i) => (
        <li key={item}>
          <span className="mini-flow__dot" aria-hidden="true" />
          {item}
          {i < items.length - 1 && <span className="mini-flow__sep" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}

function SolutionSection() {
  return (
    <section className="solution" id="solution">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">The solution</span>
          <h2 className="section-title">From early signal to clearer direction.</h2>
          <p className="section-sub">
            E.A.R.N. connects academic monitoring, student intelligence, career direction,
            skill-gap analysis and transferable skills into one personalized navigation
            experience.
          </p>
        </div>

        <div className="solution__thread">
          <SignalThread stage="connecting" />
        </div>

        <div className="solution__flows">
          <div className="solution__flow-col">
            <span className="solution__flow-label solution__flow-label--risk">Faculty</span>
            <MiniFlow items={FACULTY_FLOW} accent="risk" />
          </div>
          <div className="solution__flow-col">
            <span className="solution__flow-label solution__flow-label--nav">Student</span>
            <MiniFlow items={STUDENT_FLOW} accent="nav" />
          </div>
        </div>

        <div className="solution__outcome">
          <span>Better outcome</span>
        </div>
      </div>
    </section>
  );
}

export default SolutionSection;
