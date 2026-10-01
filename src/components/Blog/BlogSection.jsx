import PropTypes from 'prop-types';
import "./Blog.scss";
import SectionHeading from '../SectionHeading/SectionHeading';
import Carousel from '../Slider/Carousel';

const Blog = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  const carouselData = {
    useFor: "blog",
    informations: data,
    sliderSetting: {
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
      responsive: [
        { breakpoint: 991, settings: { slidesToShow: 2 } },
        { breakpoint: 767, settings: { slidesToShow: 1 } }
      ]
    }
  };

  return (
    <section id="blog">
      <div className="st-height-b100 st-height-lg-b80"></div>
      <SectionHeading title={"Events & Gallery"} />
      <div className="container" data-aos="fade-up" data-aos-duration="800" data-aos-delay="500">
        <Carousel data={carouselData} />
      </div>
      <div className="st-height-b95 st-height-lg-b75"></div>
    </section>
  )
}

Blog.propTypes = {
  variant: PropTypes.string,
  data: PropTypes.object
}

export default Blog
