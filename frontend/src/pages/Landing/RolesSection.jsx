import { GraduationCap, UserRound, Users2 } from "lucide-react";

const ROLES = [
  {
    icon: <GraduationCap size={22} />,
    role: "Teacher",
    line: "See who needs attention.",
    desc: "See who needs attention and understand the context behind the signal — risk detection, performance trends and guided intervention across every batch you teach.",
  },
  {
    icon: <UserRound size={22} />,
    role: "Student",
    line: "Understand where your interests can take you.",
    desc: "Understand where your interests can take you, what skills you already have, and what to build next — from direction to a personalized roadmap.",
  },
  {
    icon: <Users2 size={22} />,
    role: "Parent",
    line: "Know when support is needed.",
    desc: "Know when sustained academic risk requires support, with timely, meaningful alerts — not noise.",
  },
];

function RolesSection() {
  return (
    <section className="roles" id="roles">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Built for three perspectives</span>
          <h2 className="section-title">One platform. Three ways of seeing it.</h2>
        </div>

        <div className="roles__grid">
          {ROLES.map((r) => (
            <div className="role-card" key={r.role}>
              <span className="role-card__icon">{r.icon}</span>
              <span className="role-card__role">{r.role}</span>
              <p className="role-card__line">{r.line}</p>
              <p className="role-card__desc">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RolesSection;
