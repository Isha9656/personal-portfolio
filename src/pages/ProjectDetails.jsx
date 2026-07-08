import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const { data, loading, error } = useData();
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (data && data.projects) {
      // Find the project. `id` from URL might be string, but id in data might be string or number.
      const found = data.projects.find(p => String(p.id) === String(id));
      setProject(found);
    }
  }, [data, id]);

  if (loading) return <div className="st-height-b80 st-height-lg-b80">Loading...</div>;
  if (error) return <div className="st-height-b80 st-height-lg-b80">Error: {error.message}</div>;
  if (!data) return <div className="st-height-b80 st-height-lg-b80">No data available</div>;

  if (!project) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2>Project Not Found</h2>
        <Link to="/" className="st-btn st-style1 st-color1">Back to Home</Link>
      </div>
    );
  }

  return (
    <>
      <div className="st-height-b100 st-height-lg-b80"></div>
      {(project.imgLinkLg || project.imgLink) && (
        <img src={project.imgLinkLg || project.imgLink} alt={project.title} className="st-project-details-hero-img" />
      )}
      <div className="container">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <h1 style={{ marginBottom: '20px' }}>{project.title}</h1>
            <p className="lead" style={{ marginBottom: '30px' }}>{project.subTitle}</p>
            
            {project.overview && (
              <>
                <h3>Overview</h3>
                <p>{project.overview}</p>
              </>
            )}

            {project.methodology && (
              <>
                <h3>Methodology</h3>
                <p>{project.methodology}</p>
              </>
            )}

            {project.results && (
              <>
                <h3>Results</h3>
                <p>{project.results}</p>
              </>
            )}

            <div style={{ marginTop: '40px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="st-btn st-style1 st-color1">
                  View Source on GitHub
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="st-btn st-style1 st-color2">
                  View Live Project
                </a>
              )}
              <Link to="/#portfolio" className="st-btn st-style2">Back to Projects</Link>
            </div>
            
            {project.images && project.images.length > 0 && (
              <div style={{ marginTop: '50px' }}>
                <h3>Screenshots</h3>
                <div className="row">
                  {project.images.map((img, idx) => (
                    <div className="col-md-6" key={idx} style={{ marginBottom: '20px' }}>
                      <img src={img} alt={`Screenshot ${idx+1}`} style={{ width: '100%', borderRadius: '8px' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="st-height-b100 st-height-lg-b80"></div>
    </>
  );
};

export default ProjectDetails;
