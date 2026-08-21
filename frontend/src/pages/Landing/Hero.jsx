import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "../../components/Button/Button";
import HeroVisual from "./HeroVisual";

function Hero() {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <span className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            AI-powered academic early warning
          </span>

          <h1 className="hero__headline">
            Know who needs help <span className="hero__highlight">before they fall behind.</span>
          </h1>

          <p className="hero__subtext">
            An intelligent academic early-warning platform that helps educators identify emerging
            academic risk, understand the factors behind it, and take action at the right time.
          </p>

          <div className="hero__actions">
            <Button size="large" icon={<ArrowRight size={17} />} onClick={() => navigate("/login")}>
              Get Started
            </Button>
            <Button size="large" variant="secondary" onClick={scrollToHowItWorks}>
              Explore How It Works
            </Button>
          </div>

          <div className="hero__meta">
            <span>For faculty, students &amp; parents</span>
            <span className="hero__meta-dot" aria-hidden="true" />
            <span>Built for early intervention, not after-the-fact reporting</span>
          </div>
        </div>

        <div className="hero__visual">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

export default Hero;
