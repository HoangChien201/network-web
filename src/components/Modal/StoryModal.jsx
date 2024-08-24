import React, { useEffect, useState } from "react";
import "./StoryModal.css"; // CSS cho modal
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function MediaModal({
  isOpen,
  onClose,
  mediaUrl,
  resourceType,
  title,
  content,
  duration = 7000, // Thời gian hiển thị của story (trong mili giây)
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      const startTime = Date.now();
      const interval = 100; // Cập nhật tiến trình mỗi 100ms

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        setProgress(progress);
        if (progress === 100) {
          clearInterval(timer);
          // onClose(); // Đóng modal khi story hết thời gian
        }
      }, interval);

      return () => clearInterval(timer);
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-progress-bar" style={{ width: `${progress}%` }} />
        <button className="modal-close" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h2>{title}</h2>
        <div className="modal-content-text">
          <p>{content}</p>
        </div>
        {mediaUrl ? (
          resourceType === "video" ? (
            <video
              src={mediaUrl}
              alt={title}
              controls
              autoPlay
              className="modal-media"
            />
          ) : (
            <img src={mediaUrl} alt={title} className="modal-media" />
          )
        ) : (
          <div className="modal-content-text">{/* <p>{content}</p> */}</div>
        )}
      </div>
    </div>
  );
}
