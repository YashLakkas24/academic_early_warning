import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Hero from "./Hero";
import ProblemSection from "./ProblemSection";
import SolutionSection from "./SolutionSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import RolesSection from "./RolesSection";
import DifferentiatorSection from "./DifferentiatorSection";
import FinalCTA from "./FinalCTA";
import "./Landing.css";

/**
 * Landing page.
 * This file only composes sections — each section lives in its own file
 * inside this folder so nothing becomes an unreadable monolith.
 */
function Landing() {
  return (
    <div className="landing">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <RolesSection />
        <DifferentiatorSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
