import { useRef, useState } from "react";
import { Compass } from "lucide-react";
import NavigationJourney from "./NavigationJourney";
import StudentIntelligenceSnapshot from "./StudentIntelligenceSnapshot";
import InterestAnalysis from "./InterestAnalysis";
import DirectionsGrid from "./DirectionsGrid";
import SkillLens from "./SkillLens";
import Roadmap from "./Roadmap";
import {
  student,
  interestAnalysis,
  navigationJourneyStages,
  directions,
  defaultDirectionId,
} from "../../../data/studentIntelligence";
import "./StudentNavigation.css";

/**
 * StudentNavigationSection composes the entire Student Navigation
 * Intelligence experience. It owns `selectedDirectionId` — the one piece
 * of state every downstream panel (Skill Assessment, Transferable
 * Skills, Skill Gap, Roadmap) reacts to, so picking a different
 * potential direction updates all of them together.
 */
function StudentNavigationSection() {
  const [selectedDirectionId, setSelectedDirectionId] = useState(defaultDirectionId);
  const roadmapRef = useRef(null);

  const selectedDirection =
    directions.find((d) => d.id === selectedDirectionId) ?? directions[0];

  const scrollToRoadmap = () => {
    roadmapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="student-nav" id="student-navigation">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow eyebrow--nav">
            <Compass size={12} />
            Student Navigation Intelligence
          </span>
          <h2 className="section-title">From interest to direction.</h2>
          <p className="section-sub">
            E.A.R.N. helps students understand what genuinely interests them, identify potential
            directions, discover their current capabilities, recognize transferable skills, and
            build a practical path toward their goals.
          </p>
        </div>

        <NavigationJourney stages={navigationJourneyStages} />

        <div className="student-nav__grid">
          <div className="student-nav__col">
            <StudentIntelligenceSnapshot
              student={student}
              interestAnalysis={interestAnalysis}
              directionCount={directions.length}
            />
            <InterestAnalysis data={interestAnalysis} />
          </div>

          <div className="student-nav__col">
            <DirectionsGrid
              directions={directions}
              selectedId={selectedDirectionId}
              onSelect={setSelectedDirectionId}
            />
          </div>
        </div>

        <div className="student-nav__lens">
          <div className="student-nav__lens-head">
            <span className="eyebrow eyebrow--nav">Assessment for</span>
            <h3>{selectedDirection.name}</h3>
          </div>
          <SkillLens direction={selectedDirection} onBuildRoadmap={scrollToRoadmap} />
        </div>

        <div className="student-nav__roadmap-head">
          <span className="eyebrow eyebrow--nav">Your Roadmap</span>
          <h3 className="section-title">Turn your current skills into your next direction.</h3>
        </div>
        <Roadmap
          steps={selectedDirection.roadmap}
          currentLabel={student.existingSkills.slice(0, 2).join(" + ")}
          targetLabel={selectedDirection.name}
          sectionRef={roadmapRef}
        />
      </div>
    </section>
  );
}

export default StudentNavigationSection;
