import About from '../components/About/About';
import CertificatesSection from '../components/Certificates/CertificatesSection';
import Skill from '../components/Skill/Skill';
import Resume from '../components/Resume/ResumeSection';
import BlogSection from '../components/Blog/BlogSection';
import Contact from "../components/Contact/Contact";
import PortfolioSection from '../components/Protfolio/PortfolioSection';
import Hero2 from '../components/Hero/Hero2';
import { useData } from '../context/DataContext';

const Home2 = () => {
  const { data, loading, error } = useData();

  if (loading) return <div className="st-height-b80 st-height-lg-b80">Loading...</div>;
  if (error) return <div className="st-height-b80 st-height-lg-b80">Error: {error.message}</div>;
  if (!data) return <div className="st-height-b80 st-height-lg-b80">No data available</div>;

  const { heroData, aboutData, certificates, skillData, projects, events, resumeData, contactData, socialData } = data;
  return (
    <>
      <Hero2 data={heroData.homeTwoHero} socialData={socialData} />
      <About data={aboutData} data-aos="fade-right" />
      <CertificatesSection data={certificates} data-aos="fade-right" />
      <Skill data={skillData} data-aos="fade-right" />
      <Resume data={resumeData} />
      <PortfolioSection data={projects} data-aos="fade-right" />
      <BlogSection data={events} data-aos="fade-right" />
      <Contact data={contactData} socialData={socialData} data-aos="fade-right" />
    </>
  )
}

export default Home2;