import { useEffect } from "react";
import { X } from "lucide-react";
import "./Modal.css";

/**
 * Shared Modal used for "View Analysis" and any other place a page needs
 * to reveal more detail without navigating away. Closes on Escape or by
 * clicking the backdrop, and traps basic focus behavior via autoFocus on
 * the close button.
 */
function Modal({ open, onClose, title, eyebrow, children }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-panel__header">
          <div>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h3 className="modal-panel__title">{title}</h3>
          </div>
          <button className="modal-panel__close" onClick={onClose} aria-label="Close" autoFocus>
            <X size={18} />
          </button>
        </div>
        <div className="modal-panel__body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
