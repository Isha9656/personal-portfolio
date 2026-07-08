import PropTypes from 'prop-types';
import './Skill.scss';
import SectionHeading from '../SectionHeading/SectionHeading';
import { Icon } from '@iconify/react';

// Parse "Category (Tech1, Tech2)" into { category, technologies[] }
const parseSkillTitle = (fullTitle) => {
  const match = fullTitle.match(/(.*?)\s*\((.*?)\)/);
  if (match) {
    return {
      category: match[1].trim(),
      technologies: match[2].split(',').map((t) => t.trim()),
    };
  }
  return { category: fullTitle, technologies: [] };
};

// Pick a relevant Iconify icon per domain
const getSkillIcon = (category) => {
  const c = category.toLowerCase();
  if (c.includes('python') || c.includes('data science')) return 'mdi:language-python';
  if (c.includes('machine learning')) return 'mdi:brain';
  if (c.includes('deep learning') || c.includes('neural')) return 'mdi:chart-scatter-plot';
  if (c.includes('database') || c.includes('sql')) return 'mdi:database';
  if (c.includes('web')) return 'mdi:code-braces';
  if (c.includes('visualization') || c.includes('tableau')) return 'mdi:chart-bar';
  return 'mdi:shield-check';
};

const Skill = ({ data }) => {
  const { title, text, skills } = data;
  return (
    <section className="st-dark-bg">
      <div className="st-height-b100 st-height-lg-b80"></div>
      <SectionHeading title="Skills" />
      <div className="container">
        <div className="row">
          {/* Left: heading & description */}
          <div className="col-lg-5">
            <div className="st-skill-wrap">
              <div
                className="st-skill-heading"
                data-aos="fade-right"
                data-aos-duration="800"
              >
                <h2 className="st-skill-title">{title}</h2>
                <div className="st-skill-subtitle">{text}</div>
              </div>
            </div>
          </div>

          {/* Right: skill card grid */}
          <div className="col-lg-7">
            <div className="st-height-b0 st-height-lg-b40"></div>
            <div className="st-skills-grid">
              {skills.map((element, index) => {
                const { category, technologies } = parseSkillTitle(element.title);
                return (
                  <div
                    className="st-skill-card"
                    key={index}
                    data-aos={element.effect}
                    data-aos-duration={element.duration}
                    data-aos-delay={element.delay}
                  >
                    <div className="st-skill-card-top">
                      <div className="st-skill-card-icon-wrapper">
                        <Icon icon={getSkillIcon(category)} className="st-skill-card-icon" />
                      </div>
                      <h3 className="st-skill-card-title">{category}</h3>
                    </div>
                    {technologies.length > 0 && (
                      <div className="st-skill-card-tags">
                        {technologies.map((tech, idx) => (
                          <span className="st-skill-tag" key={idx}>{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="st-height-b100 st-height-lg-b80"></div>
    </section>
  );
};

Skill.propTypes = {
  data: PropTypes.object,
};

export default Skill;

