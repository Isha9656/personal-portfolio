import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { useData } from '../context/DataContext';
import CertificateModal from '../components/Certificates/CertificateModal';
import { updatePageMetadata } from '../utils/projectAssets';
import './Home.scss';

const ease = [0.22, 1, 0.36, 1];

function Reveal({ children, className = '', delay = 0, as = 'div', ...props }) {
  const Tag = motion[as] || motion.div;
  const reduceMotion = useReducedMotion();
  return (
    <Tag
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: reduceMotion ? 0 : 0.72, delay, ease }}
      {...props}
    >
      {children}
    </Tag>
  );
}

const SectionIntro = ({ index, eyebrow, title, description, light = false }) => (
  <Reveal className={`lab-section-intro${light ? ' is-light' : ''}`}>
    <div className="lab-section-index"><span>{index}</span><i /></div>
    <div>
      <p className="lab-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description && <p className="lab-section-copy">{description}</p>}
    </div>
  </Reveal>
);

function DataOrbit({ portrait }) {
  const updatePointer = (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    event.currentTarget.style.setProperty('--pointer-x', x.toFixed(2));
    event.currentTarget.style.setProperty('--pointer-y', y.toFixed(2));
  };
  return (
    <div className="lab-orbit-scene" aria-label="Data flowing through a model into useful insight" onPointerMove={updatePointer} onPointerLeave={(event) => { event.currentTarget.style.setProperty('--pointer-x', 0); event.currentTarget.style.setProperty('--pointer-y', 0); }}>
      <div className="lab-orbit-halo lab-orbit-halo-one" />
      <div className="lab-orbit-halo lab-orbit-halo-two" />
      <div className="lab-orbit-ring lab-orbit-ring-one"><span /></div>
      <div className="lab-orbit-ring lab-orbit-ring-two"><span /></div>
      <div className="lab-orbit-core">
        {portrait ? <img src={portrait} alt="Isha Kakadiya" /> : <div className="lab-orbit-monogram">IK</div>}
      </div>
      <div className="lab-orbit-particle particle-one" />
      <div className="lab-orbit-particle particle-two" />
      <div className="lab-orbit-particle particle-three" />
      <div className="lab-float-card lab-float-card-top">
        <span className="lab-card-dot" /> SYSTEM MAP <b>01 / EXPLORE</b>
      </div>
      <div className="lab-float-card lab-float-card-bottom">
        <span>DATA</span><i /><span>DECISION</span><b>↗</b>
      </div>
      <div className="lab-orbit-coordinate">SIGNAL <span>→</span> MODEL<br />MODEL <span>→</span> INSIGHT</div>
      <div className="lab-orbit-caption">Find the structure<br />inside the signal.</div>
    </div>
  );
}

function ProjectArtwork({ project, index }) {
  const image = project.imgLinkLg || project.imgLink || project.images?.[0]?.url || project.images?.[0];
  return (
    <div className={`lab-project-art art-${index % 5}`}>
      {image ? <img src={image} alt="" loading="lazy" /> : (
        <div className="lab-art-visual" aria-hidden="true">
          <div className="lab-art-grid" />
          <svg className="lab-art-network" viewBox="0 0 720 420" fill="none" role="presentation">
            <path d="M88 274 218 129l147 102 126-125 142 145M88 274l176 72 101-115 139 90 129-110M218 129l46 217m101-115 126-125 13 215" />
            {[['88','274'],['218','129'],['264','346'],['365','231'],['491','106'],['504','321'],['633','211']].map(([cx,cy],nodeIndex) => <circle key={nodeIndex} cx={cx} cy={cy} r={nodeIndex === 3 ? 10 : 5} />)}
          </svg>
          <div className="lab-art-label">{String(index + 1).padStart(2, '0')} / SYSTEM STUDY</div>
          <div className="lab-art-topic">{(project.tags || []).slice(0, 3).join(' · ') || (project.category || 'DATA').split(/[&/]/)[0].trim()}</div>
        </div>
      )}
      <span className="lab-project-open" aria-hidden="true">↗</span>
    </div>
  );
}

function Home() {
  const { data, loading, error } = useData();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [activeCertificate, setActiveCertificate] = useState(-1);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeSkill, setActiveSkill] = useState(0);

  useEffect(() => {
    updatePageMetadata({
      title: 'Isha Kakadiya — Data Science, ML & Applied AI',
      description: 'Isha Kakadiya builds machine learning, forecasting, and analytics tools that make complex data useful.',
      url: `${window.location.origin}/`,
    });
  }, []);

  useEffect(() => {
    if (!loading && location.hash) {
      requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }));
    }
  }, [loading, location]);

  const navigateCertificate = useCallback((direction) => {
    setActiveCertificate((current) => {
      const count = data?.certificates?.length || 0;
      return direction === 'next' ? (current + 1) % count : (current - 1 + count) % count;
    });
  }, [data?.certificates?.length]);

  const projects = useMemo(() => data?.projects || [], [data?.projects]);
  const categories = useMemo(() => ['All', ...new Set(projects.map((project) => (project.category || 'Other').split(/[&/]/)[0].trim()))], [projects]);
  const visibleProjects = useMemo(() => activeFilter === 'All'
    ? projects
    : projects.filter((project) => (project.category || 'Other').split(/[&/]/)[0].trim() === activeFilter), [projects, activeFilter]);

  if (loading) return <div className="lab-loading"><span />Building the experience…</div>;
  if (error || !data) return <div className="lab-loading">Portfolio content could not be loaded.</div>;

  const hero = data.heroData?.homeOneHero || {};
  const about = data.aboutData || {};
  const resume = data.resumeData || {};
  const skills = data.skillData?.skills || [];
  const certificates = data.certificates || [];
  const socials = data.socialData || [];
  const featuredProject = projects.find((project) => project.featured) || projects[0];
  const spotlightVisible = featuredProject && (activeFilter === 'All' || (featuredProject.category || 'Other').split(/[&/]/)[0].trim() === activeFilter);
  const otherProjects = visibleProjects.filter((project) => !spotlightVisible || project.id !== featuredProject?.id);
  const email = data.contactData?.email || about.details?.find((item) => item.title?.toLowerCase() === 'email')?.info;
  const resumeUrl = about.resumePdfUrl || about.cvPdf || '/images/Isha_Kakadiya_RESUME.pdf';

  return (
    <div className="experience-page">
      <motion.div className="lab-scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <section id="home" className="lab-hero">
        <div className="lab-hero-grain" />
        <div className="lab-hero-grid" />
        <div className="lab-hero-shell">
          <div className="lab-hero-main">
            <motion.div className="lab-hero-copy" initial={reduceMotion ? false : { opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease }}>
              <div className="lab-availability"><span className="lab-live-dot" /> BUILDING AT THE INTERSECTION OF DATA & DECISIONS <span className="lab-availability-line" /></div>
              <p className="lab-hero-kicker">DATA SCIENCE <span>×</span> MACHINE LEARNING <span>×</span> APPLIED AI</p>
              <h1>Making data<br /><em>mean</em> something.</h1>
              <div className="lab-hero-intro">
                <span className="lab-hero-intro-rule" />
                <div><p className="lab-intro-name">I’m {about.name || 'Isha Kakadiya'}.</p><p>{about.text || 'I build machine learning and analytics tools that turn complex information into clear, useful decisions.'}</p></div>
              </div>
              <div className="lab-hero-cta">
                <a className="lab-button lab-button-primary" href="#portfolio" data-cursor="EXPLORE">Explore selected work <span>↘</span></a>
                <a className="lab-button lab-button-text" href={resumeUrl} target="_blank" rel="noreferrer">View résumé <span>↗</span></a>
              </div>
              <div className="lab-hero-socials">
                {socials.map((social) => <a key={social.title} href={social.link} target="_blank" rel="noreferrer">{social.title}<span>↗</span></a>)}
                {email && <a href={`mailto:${email}`}>Email<span>↗</span></a>}
              </div>
            </motion.div>
            <motion.div className="lab-hero-visual" initial={reduceMotion ? false : { opacity: 0, scale: 0.92, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.15, delay: 0.18, ease }}>
              <DataOrbit portrait={hero.imgLink || about.imgLink} />
            </motion.div>
          </div>
          <div className="lab-hero-bottom"><span>SCROLL TO EXPLORE</span><div className="lab-scroll-cue"><i /></div><span>01 — 06</span></div>
        </div>
      </section>

      <div className="lab-marquee" aria-label="Areas of focus"><div className="lab-marquee-track">{[0, 1].map((copy) => <div className="lab-marquee-set" key={copy} aria-hidden={copy === 1}><span>Predictive analytics</span><i>✳</i><span>Machine learning</span><i>✳</i><span>Forecasting</span><i>✳</i><span>Applied AI</span><i>✳</i><span>Data storytelling</span><i>✳</i></div>)}</div></div>

      <section id="about" className="lab-section lab-about">
        <div className="lab-container">
          <SectionIntro index="01" eyebrow="A curious mind, a practical approach" title={about.subtitle || 'From messy data to meaningful direction.'} description="I like the part where a difficult question becomes a clear next step." />
          <div className="lab-about-grid">
            <Reveal className="lab-about-portrait-wrap"><div className="lab-about-portrait-frame"><img src={about.imgLink || hero.imgLink} alt="Isha Kakadiya" loading="lazy" /><span className="lab-portrait-stamp">ISHA<br />KAKADIYA</span></div><p className="lab-photo-caption">{about.details?.find((item) => item.title?.toLowerCase() === 'from')?.info || 'Gujarat, India'} <span>·</span> Data science, with intent.</p></Reveal>
            <Reveal className="lab-about-story" delay={0.12}>
              <p className="lab-story-mark">“</p><p className="lab-about-lede">{about.text}</p>
              <p className="lab-about-detail">My work moves between data engineering, machine learning, and thoughtful product interfaces. I care about building things people can understand, trust, and use.</p>
              <div className="lab-fact-list">{(about.details || []).filter((item) => !['github', 'linkedin'].includes(item.title?.toLowerCase())).slice(0, 4).map((item) => <div className="lab-fact-row" key={item.title}><span>{item.title}</span><strong>{item.title?.toLowerCase() === 'email' ? <a href={`mailto:${item.info}`}>{item.info}</a> : item.info}</strong></div>)}</div>
              <a className="lab-inline-link" href={resumeUrl} target="_blank" rel="noreferrer">Get to know my path <span>↗</span></a>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="skills" className="lab-section lab-skills-section">
        <div className="lab-container">
          <SectionIntro index="02" eyebrow="Tools are only as good as the questions" title="The toolkit behind the thinking." description={data.skillData?.text || 'A growing collection of methods, tools, and ways to make data useful.'} />
          <div className="lab-skills-layout">
            <Reveal className="lab-skills-note"><span className="lab-note-icon">✳</span><h3>Think clearly.<br /><em>Build carefully.</em></h3><p>From raw datasets to deployed experiences, I bring curiosity and structure to each stage of the work.</p><div className="lab-skill-orbit-mini"><i /><i /><i /><b>DS</b></div></Reveal>
            <div className="lab-skill-list" aria-label="Technical areas">
              {skills.map((skill, index) => <Reveal className={`lab-skill-row${activeSkill === index ? ' is-active' : ''}`} key={skill.title} delay={index * 0.035}>
                <button className="lab-skill-node" type="button" aria-pressed={activeSkill === index} onFocus={() => setActiveSkill(index)} onPointerEnter={() => setActiveSkill(index)} onClick={() => setActiveSkill(index)}>
                  <span className="lab-skill-node-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="lab-skill-node-copy"><strong>{skill.title}</strong><small>{activeSkill === index ? (skill.description || data.skillData?.text || 'Tools and methods used across projects.') : 'Select to explore this area'}</small></span>
                  <span className="lab-skill-node-signal" aria-hidden="true">↗</span>
                </button>
              </Reveal>)}
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="lab-section lab-timeline-section">
        <span id="resume" className="lab-anchor-alias" aria-hidden="true" />
        <div className="lab-container">
          <SectionIntro index="03" eyebrow="Experience & education" title="A path shaped by asking better questions." description="Each step has added a new lens: from software foundations to data science in practice." />
          <div className="lab-timeline-columns">
            {[[resume.experienceTitle || 'Experience', resume.experience || [], 'work'], [resume.educationTitle || 'Education', resume.education || [], 'study']].map(([title, items, kind]) => <div className="lab-timeline-column" key={kind}><Reveal className="lab-timeline-heading"><span>{kind === 'work' ? '✳' : '◉'}</span><h3>{title}</h3><small>{String(items.length).padStart(2, '0')} CHAPTERS</small></Reveal><div className="lab-timeline-list">{items.map((item, index) => <Reveal className="lab-timeline-item" key={`${kind}-${item.title}`} delay={index * 0.08}><span className="lab-timeline-dot" /><div className="lab-timeline-meta"><span>{item.duration}</span><span>{String(index + 1).padStart(2, '0')}</span></div><h4>{item.title}</h4><p className="lab-timeline-org">{item.subTitle}</p><p className="lab-timeline-copy">{item.text}</p></Reveal>)}</div></div>)}
          </div>
        </div>
      </section>

      <section id="certificates" className="lab-section lab-proof-section">
        <div className="lab-container">
          <SectionIntro index="04" eyebrow="Learning, recognized" title="Proof of the work—and the learning behind it." description="A few milestones from a journey that’s still very much in progress." />
          <div className="lab-certificate-grid">{certificates.map((certificate, index) => <Reveal key={certificate.id || certificate.title} delay={index * 0.045}><button type="button" className="lab-certificate-card" onClick={() => setActiveCertificate(index)}><div className="lab-cert-topline"><span>{String(index + 1).padStart(2, '0')}</span><span>{certificate.date}</span></div><div className="lab-cert-mark">{certificate.orgLogo || certificate.orgImg ? <img src={certificate.orgLogo || certificate.orgImg} alt="" loading="lazy" /> : <span>✳</span>}</div><div className="lab-cert-info"><p>{certificate.issuer}</p><h3>{certificate.title}</h3><span className="lab-cert-action">View credential <b>↗</b></span></div></button></Reveal>)}</div>
        </div>
      </section>

      <section id="portfolio" className="lab-section lab-work-section">
        <div className="lab-container">
          <SectionIntro index="05" eyebrow="Selected work · 2024—26" title="Real questions. Thoughtful systems." description="A selection of projects across prediction, forecasting, and data-powered products." />
          <div className="lab-work-toolbar"><p>SELECTED CASE STUDIES <span>({String(projects.length).padStart(2, '0')})</span></p><div className="lab-filter-list" aria-label="Filter projects">{categories.map((category) => <button key={category} type="button" className={activeFilter === category ? 'is-active' : ''} onClick={() => setActiveFilter(category)}>{category}</button>)}</div></div>
          {spotlightVisible && <Reveal className="lab-featured-wrap"><Link className="lab-featured-project" data-cursor="VIEW" to={`/project/${featuredProject.slug || featuredProject.id}`}><ProjectArtwork project={featuredProject} index={0} /><div className="lab-featured-copy"><div className="lab-project-overline"><span>FEATURED PROJECT</span><span>{featuredProject.category}</span></div><h3>{featuredProject.title}</h3><p>{featuredProject.overview || featuredProject.subTitle}</p><div className="lab-featured-bottom"><div className="lab-tag-list">{(featuredProject.tags || []).slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div><span className="lab-project-cta">Explore case study <b>↗</b></span></div></div></Link></Reveal>}
          <div className="lab-project-grid">{otherProjects.map((project, index) => <Reveal className="lab-project-card-wrap" key={project.id || project.title} delay={(index % 3) * 0.06}><Link className="lab-project-card" data-cursor="VIEW" to={`/project/${project.slug || project.id}`}><ProjectArtwork project={project} index={index + 1} /><div className="lab-project-copy"><div className="lab-project-overline"><span>{project.category || 'PROJECT'}</span><span>{String(index + 2).padStart(2, '0')}</span></div><h3>{project.title}</h3><p>{project.overview || project.subTitle}</p><div className="lab-tag-list">{(project.tags || []).slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div><span className="lab-project-cta">View case study <b>↗</b></span></div></Link></Reveal>)}</div>
          {projects.length === 0 && <p className="lab-empty-state">New projects are on the way.</p>}
        </div>
      </section>

      {data.events?.length > 0 && <section className="lab-section lab-notes-section"><div className="lab-container"><SectionIntro index="06" eyebrow="Notes from the field" title="A few things along the way." /><div className="lab-notes-grid">{data.events.slice(0, 3).map((event, index) => <Reveal key={event.id || event.title} delay={index * 0.08}><Link className="lab-note-card" to={`/event/${event.id}`}><span>{event.date || event.category || 'FIELD NOTE'}</span><h3>{event.title}</h3><p>{event.description || event.text}</p><b>Read story ↗</b></Link></Reveal>)}</div></div></section>}

      <section id="contact" className="lab-contact-section">
        <div className="lab-contact-noise" />
        <div className="lab-container lab-contact-inner">
          <Reveal><p className="lab-eyebrow">HAVE A QUESTION WORTH EXPLORING?</p><h2>Let’s make<br /><em>something matter.</em></h2><p className="lab-contact-copy">{data.contactData?.text || 'For opportunities, collaboration, or questions about my work, I’d love to hear from you.'}</p><a className="lab-contact-email" href={`mailto:${email}`}>{email || 'Say hello'} <span>↗</span></a><div className="lab-contact-socials">{socials.map((social) => <a key={social.title} href={social.link} target="_blank" rel="noreferrer">{social.title} ↗</a>)}</div></Reveal>
          <Reveal className="lab-contact-orbit" delay={0.2}><div className="lab-contact-orbit-inner"><span>GOOD IDEAS</span><i>✳</i><span>START WITH A HELLO</span></div></Reveal>
          <div className="lab-contact-bottom"><span>{data.contactData?.address || 'Gujarat, India'}</span><a href={resumeUrl} target="_blank" rel="noreferrer">RÉSUMÉ ↗</a><span>© {new Date().getFullYear()} ISHA KAKADIYA</span></div>
        </div>
      </section>
      {activeCertificate >= 0 && <CertificateModal data={certificates} activeIndex={activeCertificate} onClose={() => setActiveCertificate(-1)} onNavigate={navigateCertificate} />}
    </div>
  );
}

export default Home;
