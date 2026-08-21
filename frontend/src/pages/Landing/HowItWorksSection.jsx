import { Database, Cpu, Radio, MessageCircle, HandHeart, Sparkles } from "lucide-react";
import SignalThread from "./SignalThread";

const FLOW = [
  { icon: <Database size={17} />, label: "Academic Data" },
  { icon: <Cpu size={17} />, label: "Analysis" },
  { icon: <Radio size={17} />, label: "Early Signal" },
  { icon: <MessageCircle size={17} />, label: "Explanation" },
  { icon: <HandHeart size={17} />, label: "Intervention" },
  { icon: <Sparkles size={17} />, label: "Better Outcome" },
];

function HowItWorksSection() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">How it works</span>
          <h2 className="section-title">One connected flow, from data to outcome.</h2>
        </div>

        <div className="how-it-works__thread">
          <SignalThread stage="resolved" />
        </div>

        <div className="how-it-works__flow">
          {FLOW.map((step, i) => (
            <div className="flow-step" key={step.label}>
              <div className="flow-step__node">{step.icon}</div>
              <span className="flow-step__label">{step.label}</span>
              {i < FLOW.length - 1 && <span className="flow-step__connector" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
