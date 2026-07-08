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
  const { title, issuer, date, imgUrl, effect, duration, delay } = data;
  const badge = getBadgeData(title, issuer);

  return (
    <div className="st-cert-card-premium" onClick={onClick}>
      <div className={`st-cert-badge ${badge.className}`}>
        {badge.text}
      </div>
      
      <div className="st-cert-card-img-wrapper">
        {imgUrl ? (
          <img src={imgUrl} alt={title} />
        ) : (
          <div className="st-cert-placeholder">🏆</div>
        )}
      </div>
      
      <div className="st-cert-card-content">
        <h2 className="st-cert-title">{title}</h2>
        {issuer && <p className="st-cert-issuer">{issuer}</p>}
        {date && <p className="st-cert-date">{date}</p>}
      </div>
    </div>
  );
};

CertificateCard.propTypes = {
  data: PropTypes.object,
  onClick: PropTypes.func
};

export default CertificateCard;
