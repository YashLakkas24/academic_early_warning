import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Menu, X } from "lucide-react";
import Button from "../Button/Button";
import "./Navbar.css";

/**
 * Shared Navbar used on Landing (and later on Login/dashboards where relevant).
 * - Becomes solid once the page is scrolled, for a "sticky but subtle" feel.
 * - Nav links scroll to in-page sections when on the landing page.
 * - "Sign In" and "Get Started" both route to /login for now.
 */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const links = [
    { label: "How It Works", id: "how-it-works" },
    { label: "Features", id: "features" },
    { label: "About", id: "differentiator" },
  ];

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="container navbar__inner">
        <a
          href="/"
          className="navbar__brand"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          <span className="navbar__mark" aria-hidden="true">
            <Activity size={18} strokeWidth={2.4} />
          </span>
          <span className="navbar__brand-text">Academic Early Warning</span>
        </a>

        <nav className="navbar__links" aria-label="Primary">
          {links.map((link) => (
            <button
              key={link.id}
              className="navbar__link"
              onClick={() => handleNavClick(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="navbar__actions">
          <button className="navbar__link navbar__signin" onClick={() => navigate("/login")}>
            Sign In
          </button>
          <Button size="medium" onClick={() => navigate("/login")}>
            Get Started
          </Button>
        </div>

        <button
          className="navbar__menu-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="navbar__mobile" role="dialog" aria-label="Mobile navigation">
          {links.map((link) => (
            <button
              key={link.id}
              className="navbar__mobile-link"
              onClick={() => handleNavClick(link.id)}
            >
              {link.label}
            </button>
          ))}
          <button
            className="navbar__mobile-link"
            onClick={() => {
              setMenuOpen(false);
              navigate("/login");
            }}
          >
            Sign In
          </button>
          <Button
            fullWidth
            onClick={() => {
              setMenuOpen(false);
              navigate("/login");
            }}
          >
            Get Started
          </Button>
        </div>
      )}
    </header>
  );
}

export default Navbar;
