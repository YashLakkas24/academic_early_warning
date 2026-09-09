import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Hero from "./Hero";
import ProblemSection from "./ProblemSection";
import SolutionSection from "./SolutionSection";
import StudentNavigationSection from "./StudentNavigation/StudentNavigationSection";
import AcademicNavigationBridge from "./Bridge/AcademicNavigationBridge";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import RolesSection from "./RolesSection";
import DifferentiatorSection from "./DifferentiatorSection";
import FinalCTA from "./FinalCTA";
import "./Landing.css";

/**
 * Landing page.
 * This file only composes sections — each section lives in its own file
 * (or its own folder, for the larger Student Navigation and Bridge
 * modules) so nothing becomes an unreadable monolith.
 *
 * Story order: Hero (see the product) -> Problem (two connected
 * problems) -> Solution (two connected flows) -> Student Navigation
 * Intelligence (the second layer, in full) -> Bridge (why these two
 * layers are one system) -> Features -> How It Works -> Roles ->
 * Differentiator -> Final CTA.
 */
function Landing() {
  return (
    <div className="landing">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <StudentNavigationSection />
        <AcademicNavigationBridge />
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
