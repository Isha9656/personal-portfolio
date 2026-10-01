import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import About from '../components/About/About';
import CertificatesSection from '../components/Certificates/CertificatesSection';
import Skill from '../components/Skill/Skill';
import Resume from '../components/Resume/ResumeSection';
import BlogSection from '../components/Blog/BlogSection';
import Contact from "../components/Contact/Contact";
import PortfolioSection from '../components/Protfolio/PortfolioSection';
import Hero from '../components/Hero/Hero';
import { useData } from '../context/DataContext';
import { updatePageMetadata } from '../utils/projectAssets';

const Home = () => {
  const { data, loading, error } = useData();
  const location = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: 'Isha Kakadiya | Data Science & Machine Learning',
      description: 'M.Sc. Data Science student with experience building ML pipelines, predictive analytics solutions, forecasting tools, and data-driven applications.',
      url: `${window.location.origin}/`,
    });
  }, []);

  useEffect(() => {
    if (!loading && location.hash) {
      const element = document.getElementById(location.hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [loading, location]);

  if (loading) return <div className="st-height-b80 st-height-lg-b80">Loading...</div>;
  if (error) return <div className="st-height-b80 st-height-lg-b80">Error: {error.message}</div>;
  if (!data) return <div className="st-height-b80 st-height-lg-b80">No data available</div>;

  const { heroData, aboutData, certificates, skillData, projects, events, resumeData, contactData, socialData } = data;
  return (
    <>
      <div className="st-height-b80 st-height-lg-b80"></div>
      <Hero data={heroData.homeOneHero} socialData={socialData} aboutData={aboutData} />
      <About data={aboutData} data-aos="fade-right" />
      <Skill data={skillData} data-aos="fade-right" />
      <Resume data={resumeData} />
      <CertificatesSection data={certificates} data-aos="fade-right" />
      <PortfolioSection data={projects} data-aos="fade-right" />
      {Array.isArray(events) && events.length > 0 && <BlogSection data={events} data-aos="fade-right" />}
      <Contact data={contactData} socialData={socialData} data-aos="fade-right" />
    </>
  )
}

export default Home;
