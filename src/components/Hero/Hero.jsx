import PropTypes from 'prop-types';
import './Hero.scss';
import parser from 'html-react-parser';
import SocialLinks from '../SocialLinks/SocialLinks';
import { useEffect } from 'react';

const Hero = ({ data, socialData }) => {
  const { subTitle, designation, imgLink, title, bgImgLink } = data;

  useEffect(() => {
    const handleScroll = () => {
      const scrollValue = window.scrollY;
      const heroElements = document.querySelector('.st-hero-wrap .st-hero-img');
      if (heroElements) {
        heroElements.style.right = `${scrollValue * -0.1}px`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section id="home" className="st-hero-wrap">
      <div
        className="st-hero st-bg st-style1"
        style={{ backgroundImage: `url(${bgImgLink})` }}
      >
        <div className="st-height-b80 st-height-lg-b80"></div>
        <div className="container">
          <div className="st-hero-text">
            <h3 data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
              {subTitle}
            </h3>
            <h1 data-aos="fade-up" data-aos-duration="800" data-aos-delay="300">
              {parser(title)}
            </h1>
            <h2 data-aos="fade-up" data-aos-duration="800" data-aos-delay="400">
              {designation}
            </h2>

          </div>
        </div>
      </div>
      <div className="st-hero-img st-to-right">
        <div 
          className="developer-terminal"
          data-aos="fade-left"
          data-aos-delay="1000"
          data-aos-duration="1000"
        >
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="terminal-dot red"></span>
              <span className="terminal-dot yellow"></span>
              <span className="terminal-dot green"></span>
            </div>
            <span className="terminal-title">isha_profile.py</span>
          </div>
          <div className="terminal-body">
            <pre>
              <code>
                <div className="line"><span className="line-num">1</span><span className="code-comment"># Machine Learning & AI Enthusiast Profile</span></div>
                <div className="line"><span className="line-num">2</span><span className="code-keyword">class</span>{' '}<span className="code-class">IshaKakadiya</span>:</div>
                <div className="line"><span className="line-num">3</span>{'    '}<span className="code-keyword">def</span>{' '}<span className="code-function">__init__</span>(<span className="code-variable">self</span>):</div>
                <div className="line"><span className="line-num">4</span>{'        '}<span className="code-variable">self</span>.name{' '}={' '}<span className="code-string">"Isha Kakadiya"</span></div>
                <div className="line"><span className="line-num">5</span>{'        '}<span className="code-variable">self</span>.role{' '}={' '}<span className="code-string">"ML & AI Enthusiast"</span></div>
                <div className="line"><span className="line-num">6</span>{'        '}<span className="code-variable">self</span>.skills{' '}={' '}[</div>
                <div className="line"><span className="line-num">7</span>{'            '}<span className="code-string">"Python"</span>,{' '}<span className="code-string">"XGBoost"</span>,{' '}<span className="code-string">"TensorFlow"</span>,</div>
                <div className="line"><span className="line-num">8</span>{'            '}<span className="code-string">"Scikit-Learn"</span>,{' '}<span className="code-string">"React.js"</span>,{' '}<span className="code-string">"SQL"</span></div>
                <div className="line"><span className="line-num">9</span>{'        '}]</div>
                <div className="line"><span className="line-num">10</span>{'        '}<span className="code-variable">self</span>.focus{' '}={' '}<span className="code-string">"Data Science & Predictive AI"</span></div>
                <div className="line"><span className="line-num">11</span>{'        '}<span className="code-variable">self</span>.status{' '}={' '}<span className="code-string">"Building Scalable Solutions"</span></div>
              </code>
            </pre>
          </div>
        </div>
        <div
          className="st-social-group"
          data-aos="fade-right"
          data-aos-delay="1000"
          data-aos-duration="1000"
        >
          <SocialLinks data={socialData} />
        </div>
      </div>
    </section>
  );
};

Hero.propTypes = {
  data: PropTypes.object,
  socialData: PropTypes.array,
};

export default Hero;
