import PropTypes from 'prop-types'
import { Icon } from '@iconify/react'

const SocialLinks2 = ({ data }) => {
  return (
    <div className="st-hero-social-links" data-aos="fade-up" data-aos-duration="800" data-aos-delay="500">
      {data.map((item) => (
        <a href={item.link} className="st-social-btn" key={item.title} target={item.link?.startsWith('http') ? '_blank' : undefined} rel={item.link?.startsWith('http') ? 'noopener noreferrer' : undefined} aria-label={item.title}>
          <span className="st-social-icon"><Icon icon={`fa6-brands:${item.icon}`} /></span>
        </a>
      ))}
    </div>
  )
}

SocialLinks2.propTypes = {
  data: PropTypes.array,
}

export default SocialLinks2;
