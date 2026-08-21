import { Activity } from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__mark" aria-hidden="true">
            <Activity size={16} strokeWidth={2.4} />
          </span>
          <span className="footer__name">Academic Early Warning</span>
        </div>
        <p className="footer__tagline">Predict · Understand · Act</p>
        <p className="footer__meta">Built for a hackathon prototype. No live student data is used.</p>
      </div>
    </footer>
  );
}

export default Footer;
