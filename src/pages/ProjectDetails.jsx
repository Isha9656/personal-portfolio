import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useScroll } from 'framer-motion';
import { useData } from '../context/DataContext';
import localData from '../Data.json';
import { isProjectRepository, isVerifiedProjectImage, updatePageMetadata } from '../utils/projectAssets';
import './ProjectDetails.scss';

const Reveal = ({ children, className = '', delay = 0, as = 'div', ...props }) => {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0 : 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >{children}</Tag>
  );
};

const ProjectDetails = () => {
  const { id } = useParams();
  const { data, loading } = useData();
  const { scrollYProgress } = useScroll();
  const project = useMemo(() => data?.projects?.find((item) => String(item.slug || item.id) === String(id))
    || localData.projects.find((item) => ['smart-library-analytics', 'financial-forecasting-system'].includes(item.id) && item.id === id), [data?.projects, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!project) return;
    updatePageMetadata({
      title: `${project.title} | Isha Kakadiya`,
      description: project.overview || `${project.title} — ${project.category || 'Data science project'} by Isha Kakadiya.`,
      url: `${window.location.origin}/project/${project.slug || project.id}`,
      image: isVerifiedProjectImage(project.imgLinkLg) ? project.imgLinkLg : isVerifiedProjectImage(project.imgLink) ? project.imgLink : undefined,
    });
  }, [project]);

  if (loading || !data) return <div className="case-loading" role="status"><span />Loading case study…</div>;
  if (!project) return (
    <section className="case-not-found">
      <p className="case-eyebrow">PROJECT / NOT FOUND</p>
      <h1>This trail ends here.</h1>
      <p>The project may have moved or is no longer published.</p>
      <Link to="/#portfolio" className="case-action">Back to selected work <span>↗</span></Link>
    </section>
  );

  const cmsProjects = data.projects || [];
  const isBundledCase = !cmsProjects.some((item) => String(item.slug || item.id) === String(id));
  const projects = isBundledCase
    ? localData.projects.filter((item) => ['smart-library-analytics', 'financial-forecasting-system'].includes(item.id))
    : cmsProjects;
  const projectIndex = projects.findIndex((item) => String(item.slug || item.id) === String(id));
  const nextProject = projects.length > 1 ? projects[(projectIndex + 1) % projects.length] : null;
  const image = isVerifiedProjectImage(project.imgLinkLg) ? project.imgLinkLg : isVerifiedProjectImage(project.imgLink) ? project.imgLink : null;
  const caseStudy = project.caseStudy && typeof project.caseStudy === 'object' ? project.caseStudy : {};
  const flowText = caseStudy.Architecture || caseStudy.Workflow || project.methodology || '';
  const flowSteps = /(?:→|->)/.test(flowText) ? flowText.split(/→|->/).map((step) => step.trim()).filter(Boolean) : [];
  const overview = caseStudy.Problem || project.overview;
  const dataDescription = caseStudy.Data;
  const approach = caseStudy.Approach || project.methodology;
  const evidence = caseStudy.Evidence;
  const result = project.results;
  const detailEntries = Object.entries(caseStudy).filter(([key]) => !['Problem', 'Data', 'Approach', 'Architecture', 'Workflow', 'Evidence'].includes(key));
  const hasRepository = isProjectRepository(project.githubUrl);
  const hasDemo = /^https?:\/\//i.test(project.liveUrl || '');

  return (
    <article className="case-study">
      <motion.div className="case-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <section className="case-hero">
        <div className="case-hero-grid" aria-hidden="true" />
        <div className="case-container case-hero-inner">
          <Link to="/#portfolio" className="case-back">← <span>Selected work</span></Link>
          <motion.div className="case-heading" initial={false}>
            <p className="case-eyebrow">CASE STUDY <span>/{String(projectIndex + 1).padStart(2, '0')}</span></p>
            <h1>{project.title}</h1>
            {project.subTitle && <p className="case-subtitle">{project.subTitle}</p>}
            <div className="case-category-row"><span>{project.category || 'DATA / SYSTEMS'}</span><span>ISHA KAKADIYA</span></div>
          </motion.div>
          <div className={`case-hero-art${image ? ' has-image' : ''}`}>
            {image ? <img src={image} alt={`${project.title} project`} fetchPriority="high" onError={(event) => { event.currentTarget.hidden = true; event.currentTarget.parentElement.classList.remove('has-image'); }} /> : <SystemArtwork title={project.title} tags={project.tags || []} />}
            <span className="case-art-index">{String(projectIndex + 1).padStart(2, '0')} / FIELD NOTES</span>
          </div>
          <div className="case-scroll-note"><span>SCROLL TO TRACE THE SYSTEM</span><i /></div>
        </div>
      </section>

      <section className="case-intro case-container" aria-labelledby="case-overview-heading">
        <Reveal className="case-side-index"><span>01</span><i /> PROJECT CONTEXT</Reveal>
        <Reveal className="case-intro-copy">
          <h2 id="case-overview-heading">The question<br /><em>behind the system.</em></h2>
          <p>{overview || 'Project context is being added.'}</p>
          {dataDescription && <p className="case-secondary-copy"><strong>Data context</strong>{dataDescription}</p>}
        </Reveal>
      </section>

      <section className="case-system" aria-labelledby="case-system-heading">
        <div className="case-container">
          <Reveal className="case-section-heading">
            <p className="case-eyebrow">02 / SYSTEM MAP</p>
            <h2 id="case-system-heading">How the pieces<br /><em>connect.</em></h2>
            <p>{approach || 'System details will be added as the project develops.'}</p>
          </Reveal>
          {flowSteps.length > 1 ? (
            <ol className="case-flow" aria-label={`${project.title} system workflow`}>
              {flowSteps.map((step, index) => <Reveal as="li" className="case-flow-step" key={`${step}-${index}`} delay={Math.min(index * 0.045, .3)}>
                <span className="case-flow-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="case-flow-node" aria-hidden="true" />
                <strong>{step}</strong>
                {index < flowSteps.length - 1 && <span className="case-flow-arrow" aria-hidden="true">↓</span>}
              </Reveal>)}
            </ol>
          ) : (
            <div className="case-system-note"><span>METHOD /</span><p>{approach || 'Technical details are being documented.'}</p></div>
          )}
        </div>
      </section>

      <section className="case-outcomes case-container" aria-labelledby="case-outcome-heading">
        <Reveal className="case-side-index"><span>03</span><i /> RESULTS & EVIDENCE</Reveal>
        <Reveal className="case-outcomes-copy">
          <p className="case-eyebrow">OUTCOME</p>
          <h2 id="case-outcome-heading">A system with a<br /><em>clear purpose.</em></h2>
          <p>{result || 'Outcome details will be added when verified project results are available.'}</p>
          {evidence && <p className="case-evidence"><strong>Evidence note</strong>{evidence}</p>}
        </Reveal>
      </section>

      {detailEntries.length > 0 && <section className="case-details-section">
        <div className="case-container">
          <Reveal className="case-section-heading"><p className="case-eyebrow">04 / TECHNICAL NOTES</p><h2>Decisions made<br /><em>along the way.</em></h2></Reveal>
          <div className="case-detail-grid">{detailEntries.map(([heading, content], index) => <Reveal className="case-detail" key={heading} delay={index * .05}><span>{String(index + 1).padStart(2, '0')}</span><h3>{heading}</h3><p>{content}</p></Reveal>)}</div>
        </div>
      </section>}

      {(project.tags?.length > 0 || hasRepository || hasDemo) && <section className="case-stack-section">
        <div className="case-container case-stack-inner">
          <div><p className="case-eyebrow">TOOLS & TECHNOLOGIES</p><div className="case-tech-list">{(project.tags || []).map((tag) => <span key={tag}>{tag}</span>)}</div></div>
          <div className="case-links">
            {hasRepository && <a href={project.githubUrl} target="_blank" rel="noreferrer">Repository <span>↗</span></a>}
            {hasDemo && <a href={project.liveUrl} target="_blank" rel="noreferrer">Live experience <span>↗</span></a>}
          </div>
        </div>
      </section>}

      {project.images?.length > 0 && <section className="case-gallery case-container">
        <Reveal className="case-section-heading"><p className="case-eyebrow">05 / VISUAL EVIDENCE</p><h2>Inside the<br /><em>interface.</em></h2></Reveal>
        <div className="case-gallery-grid">{project.images.map((item, index) => { const src = typeof item === 'string' ? item : item?.url; return src ? <figure key={src}><img src={src} alt={typeof item === 'object' && item.alt ? item.alt : `${project.title} screenshot ${index + 1}`} loading="lazy" /><figcaption>{typeof item === 'object' && item.caption ? item.caption : `VIEW / ${String(index + 1).padStart(2, '0')}`}</figcaption></figure> : null; })}</div>
      </section>}

      <section className="case-next">
        <div className="case-container case-next-inner">
          <div><p className="case-eyebrow">NEXT IN THE WORK</p><h2>{nextProject?.title || 'More work is on the way.'}</h2></div>
          {nextProject && <Link to={`/project/${nextProject.slug || nextProject.id}`} className="case-next-link" aria-label={`View next project: ${nextProject.title}`}>↗</Link>}
        </div>
      </section>
    </article>
  );
};

function SystemArtwork({ title, tags }) {
  return (
    <div className="case-system-art" aria-label={`${title} system visualization`}>
      <svg viewBox="0 0 800 420" role="img" aria-labelledby="case-art-title">
        <title id="case-art-title">Abstract workflow visualization for {title}</title>
        <path d="M120 270 260 130l145 118 140-148 132 140M120 270l190 70 95-92 170 70 102-78" />
        {[['120','270'],['260','130'],['310','340'],['405','248'],['545','100'],['555','318'],['677','240']].map(([cx,cy],index) => <circle key={index} cx={cx} cy={cy} r={index===3?12:7} />)}
      </svg>
      <div className="case-art-tags">{tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
    </div>
  );
}

export default ProjectDetails;
