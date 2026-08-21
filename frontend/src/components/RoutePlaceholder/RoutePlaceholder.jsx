import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../Button/Button";
import "./RoutePlaceholder.css";

function RoutePlaceholder({ eyebrow, title, description }) {
  const navigate = useNavigate();

  return (
    <div className="route-placeholder">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate("/")}>
        Back to Landing
      </Button>
    </div>
  );
}

export default RoutePlaceholder;
