import React, { useEffect, useState } from 'react';
import './CertificateModal.scss';

const CertificateModal = ({ data, activeIndex, onClose, onNavigate }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate('prev');
      } else if (e.key === 'ArrowRight') {
        onNavigate('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate]);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onNavigate('next');
    }
    if (isRightSwipe) {
      onNavigate('prev');
    }
  };

  if (!data || data.length === 0) return null;

  const currentCert = data[activeIndex];

  return (
    <div className="st-cert-modal-overlay" onClick={onClose}>
      <button className="st-cert-modal-close" onClick={onClose}>&times;</button>
      
      <button 
        className="st-cert-modal-nav st-cert-modal-prev" 
        onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
      >
        &#10094;
      </button>

      <div 
        className="st-cert-modal-content" 
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndHandler}
      >
        <div className="st-cert-modal-img-wrapper">
          {currentCert.imgUrl ? (
            <img src={currentCert.imgUrl} alt={currentCert.title} />
          ) : (
            <div className="st-cert-modal-placeholder">🏆</div>
          )}
        </div>
        <div className="st-cert-modal-info">
          <h3>{currentCert.title}</h3>
          {currentCert.issuer && <p className="issuer">{currentCert.issuer}</p>}
          {currentCert.date && <p className="date">{currentCert.date}</p>}
          <p className="position-indicator">{activeIndex + 1} of {data.length}</p>
        </div>
      </div>

      <button 
        className="st-cert-modal-nav st-cert-modal-next" 
        onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
      >
        &#10095;
      </button>
    </div>
  );
};

export default CertificateModal;
