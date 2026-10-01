import PropTypes from 'prop-types';
import './Hero.scss';
import parser from 'html-react-parser';
import SocialLinks from '../SocialLinks/SocialLinks';

const Hero = ({ data, socialData, aboutData }) => {
  const { imgLink, title, bgImgLink } = data;
  const resumeUrl = aboutData?.resumePdfUrl || aboutData?.cvPdf;

  return (
    <section id="home" className="st-hero-wrap">
      <div className="st-hero st-bg st-style1" style={{ backgroundImage: `url(${bgImgLink})` }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 st-hero-text">
              <p className="st-hero-eyebrow" data-aos="fade-up" data-aos-duration="700">M.Sc. Data Science student</p>
              <h1 data-aos="fade-up" data-aos-duration="800" data-aos-delay="120">{parser(title || 'Isha Kakadiya')}</h1>
              <h2 data-aos="fade-up" data-aos-duration="800" data-aos-delay="220">Data Science <span aria-hidden="true">·</span> Machine Learning <span aria-hidden="true">·</span> AI</h2>
              <p className="st-hero-summary" data-aos="fade-up" data-aos-duration="800" data-aos-delay="320">{aboutData?.text}</p>
              <div className="st-hero-actions" data-aos="fade-up" data-aos-duration="800" data-aos-delay="420">
                <a className="st-btn st-style1 st-color1" href="#portfolio">View projects</a>
                {resumeUrl && <a className="st-btn st-style1 st-hero-secondary" href={resumeUrl} download="Isha_Kakadiya_Resume.pdf">Download résumé</a>}
              </div>
              <div className="st-hero-links" data-aos="fade-up" data-aos-duration="800" data-aos-delay="520">
                <SocialLinks data={socialData || []} />
                {aboutData?.details?.find((item) => item.title?.toLowerCase() === 'email')?.info && (
                  <a href={`mailto:${aboutData.details.find((item) => item.title?.toLowerCase() === 'email').info}`}>Email</a>
                )}
              </div>
            </div>
            <div className="col-lg-5 st-hero-portrait-wrap">
              {imgLink && <img className="st-hero-portrait" src={imgLink} alt="Isha Kakadiya" fetchPriority="high" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="250" />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Hero.propTypes = {
  data: PropTypes.object,
  socialData: PropTypes.array,
  aboutData: PropTypes.object,
};

export default Hero;
