import PropTypes from 'prop-types'
import { Icon } from '@iconify/react'

const SocialLinks = ({ data }) => {
  return (
    <div className="st-social-link">
      {data.map((item) => (
        <a
          href={item.link}
          className="st-social-btn"
          target={item.link?.startsWith('http') ? '_blank' : undefined}
          rel={item.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
          aria-label={item.title}
          key={item.title}
        >
          <span className="st-social-icon"><Icon icon={`fa6-brands:${item.icon}`} /></span>
          <span className="st-icon-name">{item.title}</span>
        </a>
      ))}
    </div>
  )
}

SocialLinks.propTypes = {
  data: PropTypes.array,
}

export default SocialLinks;
