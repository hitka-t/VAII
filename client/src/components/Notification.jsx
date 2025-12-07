function Notification({ type = 'success', children, onClose }) {
  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-content">
        <span>{children}</span>
        <button
          type="button"
          className="notification-close"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Notification;
