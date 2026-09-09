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
          <span className="footer__name">E.A.R.N.</span>
        </div>
        <p className="footer__fullname">Early Academic Risk and Navigation</p>
        <p className="footer__tagline">Predict · Understand · Navigate</p>
        <p className="footer__meta">Built for a hackathon prototype. No live student data is used.</p>
      </div>
    </footer>
  );
}

export default Footer;
