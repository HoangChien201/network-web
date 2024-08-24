import React from "react";
import "./ImageModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Detail" className="modal-image" />
        <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
