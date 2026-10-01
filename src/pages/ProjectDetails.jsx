import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Icon } from '@iconify/react';
import { isProjectRepository, isVerifiedProjectImage, updatePageMetadata } from '../utils/projectAssets';

const ProjectDetails = () => {
  const { id } = useParams();
  const { data, loading, error } = useData();
  const [project, setProject] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (data && data.projects) {
      const found = data.projects.find(p => String(p.id) === String(id));
      setProject(found);
    }
  }, [data, id]);

  useEffect(() => {
    updatePageMetadata({
      title: project?.title ? `${project.title} | Isha Kakadiya` : 'Project | Isha Kakadiya',
      description: project?.overview || 'Project case study by Isha Kakadiya.',
    });
  }, [project]);

  if (loading) {
    return (
      <div className="container text-center" style={{ padding: '140px 0', color: '#94a3b8' }}>
        <Icon icon="mdi:loading" style={{ fontSize: '40px', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '14px' }}>Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center" style={{ padding: '140px 0', color: '#f87171' }}>
        <p>Error loading project: {error.message}</p>
        <Link to="/" className="st-btn st-style1 st-color1" style={{ marginTop: '20px' }}>Back to Home</Link>
      </div>
    );
  }

  if (!data || !project) {
    return (
      <div className="container text-center" style={{ padding: '140px 0' }}>
        <h2 style={{ color: '#fff', fontSize: '28px', marginBottom: '16px' }}>Project Not Found</h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>The project case study you are looking for does not exist or has been updated.</p>
        <Link to="/" className="st-btn st-style1 st-color1">Back to Home</Link>
      </div>
    );
  }

  const heroImage = isVerifiedProjectImage(project.imgLinkLg) ? project.imgLinkLg : isVerifiedProjectImage(project.imgLink) ? project.imgLink : null;


  return (
    <div style={{ background: '#0b0f19', color: '#f1f5f9', minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="st-height-b100 st-height-lg-b80"></div>
      
      <div className="container">
        {/* Back link */}
        <div style={{ marginBottom: '28px' }}>
          <Link 
            to="/#portfolio" 
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '8px', 
              color: '#818cf8', fontSize: '14px', fontWeight: '600', 
              textDecoration: 'none', background: 'rgba(99, 102, 241, 0.1)', 
              padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.25)',
              transition: 'all 0.2s ease' 
            }}
          >
            <Icon icon="mdi:arrow-left" /> Back to Portfolio
          </Link>
        </div>

        {/* Hero Section */}
        <div 
          style={{ 
            background: 'linear-gradient(145deg, #0f172a, #1e293b)', 
            borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', 
            overflow: 'hidden', marginBottom: '40px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}
        >
          {heroImage && (
            <div style={{ width: '100%', maxHeight: '420px', overflow: 'hidden', position: 'relative', background: '#090d16' }}>
              <img 
                src={heroImage} 
                alt={project.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} 
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(15,23,42,0.95) 100%)' }} />
            </div>
          )}

          <div style={{ padding: '36px 36px 40px' }}>
            {project.category && (
              <span 
                style={{ 
                  display: 'inline-block', padding: '5px 14px', borderRadius: '30px', 
                  background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', 
                  color: '#a5b4fc', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px',
                  marginBottom: '16px' 
                }}
              >
                {project.category}
              </span>
            )}
            
            <h1 style={{ fontSize: '34px', fontWeight: '800', color: '#ffffff', margin: '0 0 12px', lineHeight: 1.25 }}>
              {project.title}
            </h1>
            
            {project.subTitle && (
              <p style={{ fontSize: '18px', color: '#38bdf8', fontWeight: '500', margin: '0 0 24px', lineHeight: 1.5 }}>
                {project.subTitle}
              </p>
            )}

            {/* Tech Tags */}
            {project.tags && project.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                {project.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', 
                      color: '#cbd5e1', fontSize: '13px', fontWeight: '500', padding: '5px 12px', borderRadius: '6px' 
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', paddingTop: '10px' }}>
              {isProjectRepository(project.githubUrl) && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="st-btn st-style1 st-color1"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600' }}
                >
                  <Icon icon="mdi:github" style={{ fontSize: '20px' }} /> View Source Code ↗
                </a>
              )}
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="st-btn st-style1 st-color2"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600' }}
                >
                  <Icon icon="mdi:open-in-new" style={{ fontSize: '20px' }} /> Launch Live App ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Details Content Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '40px' }}>
          {project.overview && (
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon icon="mdi:information-outline" style={{ color: '#818cf8', fontSize: '22px' }} />
                </div>
                <h3 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: 0 }}>Project Overview</h3>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
                {project.overview}
              </p>
            </div>
          )}

          {project.methodology && (
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon icon="mdi:cogs" style={{ color: '#38bdf8', fontSize: '22px' }} />
                </div>
                <h3 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: 0 }}>Methodology & Architecture</h3>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
                {project.methodology}
              </p>
            </div>
          )}

          {project.results && (
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon icon="mdi:trophy-outline" style={{ color: '#34d399', fontSize: '22px' }} />
                </div>
                <h3 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: 0 }}>Results & Key Impact</h3>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
                {project.results}
              </p>
            </div>
          )}
        </div>

        {project.caseStudy && (
          <section aria-labelledby="case-study-heading" style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '30px', marginBottom: '24px' }}>
            <h2 id="case-study-heading" style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', margin: '0 0 20px' }}>Case study details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '18px' }}>
              {Object.entries(project.caseStudy).map(([heading, detail]) => (
                <div key={heading}>
                  <h3 style={{ color: '#a5b4fc', fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>{heading}</h3>
                  <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.75, margin: 0, overflowWrap: 'anywhere' }}>{detail}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Screenshots Gallery */}
        {project.images && project.images.length > 0 && (
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon icon="mdi:image-multiple-outline" style={{ color: '#fbbf24', fontSize: '22px' }} />
              </div>
              <h3 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: 0 }}>Screenshots & Visuals</h3>
            </div>
            
            <div className="row">
              {project.images.map((img, idx) => (
                <div className="col-md-6" key={idx} style={{ marginBottom: '20px' }}>
                  <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden', background: '#090d16' }}>
                    <img src={img} alt={`Screenshot ${idx + 1}`} style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
};

export default ProjectDetails;

