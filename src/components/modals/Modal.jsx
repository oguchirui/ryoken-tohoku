import { useState, useEffect } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  const [show, setShow] = useState(false);
  const [animation, setAnimation] = useState("");

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setAnimation("fade-in");
    } else {
      setAnimation("fade-out");
      const timer = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show) return null;

  return (
    <div
      className={`modal-overlay ${animation}`}
      onClick={onClose}
    >
      <div
        className={`modal-content ${animation}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-button"
          onClick={onClose}
        >×</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
