import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SingleResume = ({ element }) => {
  const { title, duration, subTitle, text, imgLink, certificateUrl, extraDetails } = element;
  const [isExpanded, setIsExpanded] = useState(false);
  const isExpandable = !!(certificateUrl || extraDetails);

  return (
    <div className={`st-resume-timeline ${isExpandable ? 'st-resume-interactive' : ''}`}>
      <div className="st-resume-timeline-header">
        <div className="st-resume-timeline-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h3 className="st-resume-timeline-title" style={{ margin: 0 }}>{title}</h3>
            {isExpandable && (
              <button type="button" className="resume-details-toggle" aria-expanded={isExpanded} aria-controls={`resume-details-${title.replace(/[^a-z0-9]+/gi, '-')}`} onClick={() => setIsExpanded((expanded) => !expanded)} style={{
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                background: 'rgba(99, 102, 241, 0.12)',
                color: '#a5b4fc',
                padding: '2px 8px',
                borderRadius: '20px',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M22 12H12M12 2a10 10 0 0 1 10 10M12 22a10 10 0 0 1-10-10"/></svg>
                {isExpanded ? 'Click to collapse' : 'Certificate details'}
              </button>
            )}
          </div>
          <div className="st-resume-timeline-duration">{duration}</div>
          <h4 className="st-resume-timeline-subtitle">{subTitle}</h4>
        </div>
        {imgLink && (
          <div className="st-resume-timeline-logo-wrapper">
            <img src={imgLink} alt={subTitle} className="st-resume-timeline-logo" />
          </div>
        )}
      </div>
      
      <div className="st-resume-timeline-text">
        <p>{text}</p>
      </div>

      {isExpandable && (
        <div id={`resume-details-${title.replace(/[^a-z0-9]+/gi, '-')}`} hidden={!isExpanded} style={{
          maxHeight: isExpanded ? '500px' : '0px',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: isExpanded ? 1 : 0,
          marginTop: isExpanded ? '16px' : '0px',
          paddingTop: isExpanded ? '16px' : '0px',
          borderTop: isExpanded ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
        }}
        >
          {extraDetails && (
            <div style={{
              color: '#94a3b8',
              fontSize: '13.5px',
              lineHeight: '1.6',
              marginBottom: '16px',
              whiteSpace: 'pre-line'
            }}>
              {extraDetails}
            </div>
          )}
          
          {certificateUrl && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href={certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="st-btn st-style1 st-color1"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'none',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                View Completion Certificate
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

SingleResume.propTypes = {
  element: PropTypes.object,
};

export default SingleResume;
