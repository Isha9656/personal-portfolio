import PropTypes from 'prop-types';
import './CertificateCard.scss';

const getBadgeData = (title, issuer) => {
  const text = `${title} ${issuer}`.toLowerCase();
  if (text.includes('intern') || text.includes('internship')) {
    return { text: 'Internship', className: 'badge-internship' };
  } else if (text.includes('workshop')) {
    return { text: 'Workshop', className: 'badge-workshop' };
  } else if (text.includes('volunteer') || text.includes('ambassador')) {
    return { text: 'Volunteer', className: 'badge-volunteer' };
  } else if (text.includes('competition') || text.includes('hackathon')) {
    return { text: 'Competition', className: 'badge-competition' };
  } else {
    return { text: 'Certification', className: 'badge-certification' };
  }
};

const CertificateCard = ({ data, onClick }) => {
  const { title, issuer, date, imgUrl, pdfUrl, orgLogo, orgImg } = data;
  const badge = getBadgeData(title, issuer);
  
  // Organization logo displayed outside
  const isImgPdf = (imgUrl || '').toLowerCase().endsWith('.pdf') || (imgUrl || '').includes('application/pdf');
  const logoUrl = orgLogo || orgImg || (!isImgPdf ? imgUrl : '');

  return (
    <button type="button" className="st-cert-card-premium" onClick={onClick} aria-label={`View certificate: ${title}`}>
      <div className={`st-cert-badge ${badge.className}`}>
        {badge.text}
      </div>
      
      <div className="st-cert-card-img-wrapper">
        {logoUrl ? (
          <img src={logoUrl} alt={issuer || title} />
        ) : (
          <div className="st-cert-placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '38px' }}>🏢</span>
            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>{issuer || 'Certificate'}</span>
          </div>
        )}
      </div>
      
      <div className="st-cert-card-content">
        <h2 className="st-cert-title">{title}</h2>
        {issuer && <p className="st-cert-issuer">{issuer}</p>}
        {date && <p className="st-cert-date">{date}</p>}
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8', fontSize: '13px', fontWeight: '600' }}>
          <span>View Certificate & Details</span>
          <span>→</span>
        </div>
      </div>
    </button>
  );
};


CertificateCard.propTypes = {
  data: PropTypes.object,
  onClick: PropTypes.func
};

export default CertificateCard;
