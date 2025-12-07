function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    // klik mimo okna zavrie modal
    if (e.target.classList.contains("modal-backdrop-custom")) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop-custom" onClick={handleBackdropClick}>
      <div className="modal-custom">
        <div className="modal-custom-header">
          <h2>{title}</h2>
          <button
            type="button"
            className="btn-close-custom"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="modal-custom-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
