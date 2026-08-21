import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "../../components/Button/Button";

function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="final-cta">
      <div className="container final-cta__inner">
        <h2 className="final-cta__title">Don&apos;t wait for failure to become visible.</h2>
        <p className="final-cta__sub">
          Identify early signals. Understand the reason. Take action sooner.
        </p>
        <Button size="large" icon={<ArrowRight size={17} />} onClick={() => navigate("/login")}>
          Get Started
        </Button>
      </div>
    </section>
  );
}

export default FinalCTA;
