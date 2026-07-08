import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SectionHeading from '../SectionHeading/SectionHeading';
import CertificateCard from './CertificateCard';
import CertificateModal from './CertificateModal';

const CertificatesSection = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!data) return null;

  const openModal = (index) => {
    setActiveIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const navigateModal = (direction) => {
    if (direction === 'next') {
      setActiveIndex((prev) => (prev + 1) % data.length);
    } else {
      setActiveIndex((prev) => (prev - 1 + data.length) % data.length);
    }
  };

  return (
    <section id="certificates">
      <div className="st-height-b100 st-height-lg-b80"></div>
      <SectionHeading title={"Certificates"} />
      <div className="container" style={{ textAlign: 'center', marginBottom: '40px', marginTop: '-20px' }}>
        <h3 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '600', marginBottom: '10px' }}>Professional Certifications, Internships & Achievements</h3>
        <p style={{ color: '#38bdf8', fontSize: '16px', fontWeight: 'bold' }}>{data.length}+ Certifications Completed</p>
      </div>
      <div className="container">
        <div className="row">
          {data.map((element, index) => (
            <div 
              className="col-lg-4 col-md-6" 
              key={element.id || index} 
              data-aos={element.effect ? element.effect : "zoom-out-up"} 
              data-aos-duration={element.duration ? element.duration : "800"} 
              data-aos-delay={element.delay ? element.delay : "200"}
              style={{ display: 'flex', marginBottom: '30px' }}
            >
              <CertificateCard data={element} onClick={() => openModal(index)} />
            </div>
          ))}
        </div>
      </div>
      <div className="st-height-b70 st-height-lg-b50"></div>

      {isModalOpen && (
        <CertificateModal 
          data={data} 
          activeIndex={activeIndex} 
          onClose={closeModal} 
          onNavigate={navigateModal} 
        />
      )}
    </section>
  );
};

CertificatesSection.propTypes = {
  data: PropTypes.array
};

export default CertificatesSection;
