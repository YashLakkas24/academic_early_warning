import { AlertTriangle, ArrowRight, Compass, Sparkles } from "lucide-react";
import "./Bridge.css";

/**
 * AcademicNavigationBridge — the section that makes E.A.R.N. feel like one
 * connected system rather than two unrelated products.
 *
 * IMPORTANT: the copy here is deliberately careful. It never claims a
 * student's career interest causes their academic risk, or vice versa —
 * it only presents the two as related context worth considering together
 * ("may affect", "consider alongside", "could support").
 */
function AcademicNavigationBridge() {
  return (
    <section className="bridge">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">One connected system</span>
          <h2 className="section-title">Academic risk and student direction, together.</h2>
          <p className="section-sub">
            E.A.R.N. doesn&apos;t treat academic monitoring and career navigation as separate
            tools. Risk detection and student navigation intelligence both inform the same
            picture of a student.
          </p>
        </div>

        <div className="bridge__diagram">
          <div className="bridge__side bridge__side--risk">
            <span className="bridge__side-label">
              <AlertTriangle size={13} />
              Academic Risk
            </span>
            <ul>
              <li>Attendance</li>
              <li>Assessments</li>
              <li>Assignments</li>
              <li>Performance trend</li>
            </ul>
          </div>

          <div className="bridge__center">
            <span className="bridge__center-node">Student Context</span>
            <span className="bridge__center-arrow" aria-hidden="true">
              <ArrowRight size={16} />
            </span>
          </div>

          <div className="bridge__side bridge__side--nav">
            <span className="bridge__side-label">
              <Compass size={13} />
              Student Navigation
            </span>
            <ul>
              <li>Interest</li>
              <li>Direction</li>
              <li>Skills</li>
              <li>Roadmap</li>
            </ul>
          </div>
        </div>

        <div className="bridge__example">
          <span className="bridge__example-tag">
            <Sparkles size={12} />
            Illustrative example
          </span>

          <div className="bridge__example-rows">
            <div className="bridge__example-row">
              <span className="bridge__example-label bridge__example-label--risk">Academic signal</span>
              <p>Attendance declining</p>
            </div>
            <div className="bridge__example-row">
              <span className="bridge__example-label bridge__example-label--nav">Student interest</span>
              <p>Strong interest in Product Management</p>
            </div>
            <div className="bridge__example-row">
              <span className="bridge__example-label">AI insight</span>
              <p>
                Current academic performance may affect progress toward the student&apos;s chosen
                direction — worth considering alongside the risk signal, not in isolation.
              </p>
            </div>
            <div className="bridge__example-row">
              <span className="bridge__example-label">Recommended action</span>
              <p>Targeted academic support, alongside a skill-building plan.</p>
            </div>
          </div>
        </div>

        <p className="bridge__disclaimer">
          E.A.R.N. presents academic and navigation signals as related context — it does not claim
          that one causes the other.
        </p>
      </div>
    </section>
  );
}

export default AcademicNavigationBridge;
