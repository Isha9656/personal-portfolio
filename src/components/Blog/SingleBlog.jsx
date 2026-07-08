import { Link } from 'react-router-dom';
import './Blog.scss';
import PropTypes from 'prop-types';

const SingleBlog = ({ element }) => {
  const { id, coverImg, title, date } = element;
  const href = `/event/${id}`;
  return (
    <div className={`st-post-single st-style1`}>
      <Link to={href} className="st-post-thumb st-zoom">
        <img src={coverImg} className="st-zoom-in" alt="Event Cover" />
      </Link>
      <div className="st-post-info">
        <div className="st-post-date">
          <span className="st-post-publish-date">{date}</span>
        </div>
        <h4 className="st-post-title">
          <Link to={href}>{title}</Link>
        </h4>
      </div>
    </div>
  );
};

SingleBlog.propTypes = {
  element: PropTypes.object,
};

export default SingleBlog;
