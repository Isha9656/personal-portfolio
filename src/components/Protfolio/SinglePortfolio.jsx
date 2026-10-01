import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { isProjectRepository, isVerifiedProjectImage } from '../../utils/projectAssets';

const SinglePortfolio = ({ data }) => {
  const { id, title, subTitle, category, icon, tags, githubUrl, overview, imgLink } = data;
  const repositoryUrl = isProjectRepository(githubUrl) ? githubUrl : null;
  const projectImage = isVerifiedProjectImage(imgLink) ? imgLink : null;

  // Select icon name based on the icon key
  const getIconName = (iconType) => {
    switch (iconType) {
      case 'car': return 'mdi:car-emergency';
      case 'lightning': return 'mdi:lightning-bolt';
      case 'web': return 'mdi:web';
      case 'code': return 'mdi:code-braces';
      case 'database': return 'mdi:database';
      case 'chart': return 'mdi:chart-line';
      default: return 'mdi:briefcase';
    }
  };

  return (
    <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
      <article className="st-portfolio-card">
        {/* Card Header with Logo or Tech Icon */}
        <div className="st-portfolio-card-header">
          {projectImage ? (
            <div className="st-portfolio-card-logo-container">
              <img src={projectImage} alt={title} className="st-portfolio-card-logo" loading="lazy" />
            </div>
          ) : (
            <div className="st-portfolio-card-icon-wrapper">
              <Icon icon={getIconName(icon)} className="st-portfolio-card-icon" />
            </div>
          )}
          {category && <span className="st-portfolio-card-badge">{category}</span>}
        </div>

        {/* Card Content */}
        <div className="st-portfolio-card-body">
          <h3 className="st-portfolio-card-title">{title}</h3>
          <p className="st-portfolio-card-subtitle">{subTitle}</p>
          <p className="st-portfolio-card-desc">{overview}</p>

          {/* Tech Tags */}
          {tags && tags.length > 0 && (
            <div className="st-portfolio-card-tags">
              {tags.map((tag, i) => (
                <span key={i} className="st-portfolio-card-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Card Footer / Action Links */}
        <div className="st-portfolio-card-footer">
          <Link to={`/project/${id}`} className="st-portfolio-card-btn st-portfolio-btn-details">
            Case Study <Icon icon="mdi:arrow-right" />
          </Link>
          {repositoryUrl && (
            <a 
              href={repositoryUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="st-portfolio-card-btn st-portfolio-btn-github" 
              title="GitHub Repo"
            >
              <Icon icon="mdi:github" /> Code
            </a>
          )}
        </div>
      </article>
    </div>
  );
};

SinglePortfolio.propTypes = {
  data: PropTypes.object
};

export default SinglePortfolio;
