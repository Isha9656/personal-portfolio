import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const EventDetails = () => {
  const { id } = useParams();
  const { data, loading, error } = useData();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (data && data.events) {
      const found = data.events.find(e => String(e.id) === String(id));
      setEvent(found);
    }
  }, [data, id]);

  if (loading) return <div className="st-height-b80 st-height-lg-b80">Loading...</div>;
  if (error) return <div className="st-height-b80 st-height-lg-b80">Error: {error.message}</div>;
  if (!data) return <div className="st-height-b80 st-height-lg-b80">No data available</div>;

  if (!event) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2>Event Not Found</h2>
        <Link to="/" className="st-btn st-style1 st-color1">Back to Home</Link>
      </div>
    );
  }

  return (
    <>
      <div className="st-height-b100 st-height-lg-b80"></div>
      <div className="container">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            {event.coverImg && (
              <img src={event.coverImg} alt={event.title} style={{ width: '100%', borderRadius: '10px', marginBottom: '30px' }} />
            )}
            <h1 style={{ marginBottom: '10px' }}>{event.title}</h1>
            <p style={{ color: '#888', marginBottom: '30px' }}>{event.date}</p>
            
            {event.desc && (
              <div style={{ marginBottom: '40px' }}>
                <p>{event.desc}</p>
              </div>
            )}
            
            {event.photos && event.photos.length > 0 && (
              <div style={{ marginTop: '50px' }}>
                <h3>Gallery</h3>
                <div className="row">
                  {event.photos.map((img, idx) => (
                    <div className="col-md-6" key={idx} style={{ marginBottom: '20px' }}>
                      <img src={img} alt={`Gallery ${idx+1}`} style={{ width: '100%', borderRadius: '8px' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{ marginTop: '40px' }}>
              <Link to="/" className="st-btn st-style2">Back to Events</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="st-height-b100 st-height-lg-b80"></div>
    </>
  );
};

export default EventDetails;
