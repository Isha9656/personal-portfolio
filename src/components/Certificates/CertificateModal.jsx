import React, { useEffect, useState } from 'react';
import { isPdfAsset } from '../../utils/media';
import './CertificateModal.scss';

const CertificateModal = ({ data, activeIndex, onClose, onNavigate }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
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
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
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
  const fileUrl = currentCert.pdfUrl || currentCert.imgUrl || '';
  const isPdf = currentCert.pdfType
    ? currentCert.pdfType === 'application/pdf'
    : currentCert.pdfUrl
      ? true
      : isPdfAsset(fileUrl);
  const logoUrl = currentCert.orgLogo || currentCert.orgImg || '';

  return (
    <div className="st-cert-modal-overlay" role="dialog" aria-modal="true" aria-label={currentCert.title} onClick={onClose}>
      <button className="st-cert-modal-close" type="button" aria-label="Close certificate details" onClick={onClose}>&times;</button>
      
      <button 
        type="button" aria-label="Previous certificate" className="st-cert-modal-nav st-cert-modal-prev" 
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
          {fileUrl ? (
            isPdf ? (
              <div className="st-cert-pdf-container">
                <object
                  data={fileUrl}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  className="st-cert-pdf-object"
                >
                  <iframe src={fileUrl} title={currentCert.title} width="100%" height="100%">
                    <p>Your browser does not support inline PDF embedding.</p>
                  </iframe>
                </object>
              </div>
            ) : (
              <img src={fileUrl} alt={currentCert.title} />
            )
          ) : logoUrl ? (
            <img src={logoUrl} alt={currentCert.issuer || currentCert.title} />
          ) : (
            <div className="st-cert-modal-placeholder">🏆</div>
          )}
        </div>
        <div className="st-cert-modal-info">
          {logoUrl && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <img src={logoUrl} alt={currentCert.issuer} style={{ height: '45px', objectFit: 'contain', background: 'rgba(255,255,255,0.06)', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
          )}
          <h3>{currentCert.title}</h3>
          {currentCert.issuer && <p className="issuer" style={{ color: '#38bdf8', fontWeight: '600' }}>{currentCert.issuer}</p>}
          {currentCert.date && <p className="date" style={{ color: '#94a3b8', fontSize: '13px' }}>{currentCert.date}</p>}
          
          {(currentCert.description || currentCert.text) && (
            <p className="description" style={{ marginTop: '14px', fontSize: '14px', lineHeight: '1.6', color: '#cbd5e1', maxWidth: '600px' }}>
              {currentCert.description || currentCert.text}
            </p>
          )}

          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="st-btn st-style1 st-color1"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '13px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}
              >
                {isPdf ? '📄 View / Download PDF Document ↗' : '🔍 View Full Certificate Proof ↗'}
              </a>
            )}
            {currentCert.credentialUrl && (
              <a
                href={currentCert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="st-btn st-style1 st-color2"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '13px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}
              >
                Verify Credential ↗
              </a>
            )}
          </div>
          <p className="position-indicator" style={{ marginTop: '16px', color: '#64748b' }}>{activeIndex + 1} of {data.length}</p>
        </div>
      </div>

      <button 
        type="button" aria-label="Next certificate" className="st-cert-modal-nav st-cert-modal-next" 
        onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
      >
        &#10095;
      </button>
    </div>
  );
};

export default CertificateModal;
