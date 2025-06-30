// src/components/Modal.jsx

import React from 'react';
import styles from '../css/Modal.module.css';

const Modal = ({ isOpen, onClose, children }) => {
  // Jika modal tidak terbuka, jangan render apa-apa
  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop: lapisan gelap di belakang modal
    <div className={styles.modalBackdrop} onClick={onClose}>
      {/* Konten Modal: kita hentikan propagasi klik agar saat diklik, modal tidak tertutup */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Tombol Close (X) */}
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {/* 'children' adalah tempat konten kita (form, teks, dll) akan ditampilkan */}
        {children}
      </div>
    </div>
  );
};

export default Modal;