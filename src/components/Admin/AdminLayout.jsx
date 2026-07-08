import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { T } from './adminTheme';

// Sections
import OverviewSection from './sections/OverviewSection';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ResumeSection from './sections/ResumeSection';
import CertificatesSection from './sections/CertificatesSection';
import ProjectsSection from './sections/ProjectsSection';
import SocialSection from './sections/SocialSection';
import ContactSection from './sections/ContactSection';

const SECTIONS = {
  overview:     OverviewSection,
  hero:         HeroSection,
  about:        AboutSection,
  skills:       SkillsSection,
  experience:   ResumeSection,
  education:    ResumeSection,
  certificates: CertificatesSection,
  projects:     ProjectsSection,
  social:       SocialSection,
  contact:      ContactSection,
};

const AdminLayout = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: T.bg,
      fontFamily: T.font,
      color: T.text,
    }}>
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main content */}
      <main style={{
        flex: 1,
        padding: '36px 40px',
        overflowY: 'auto',
        minWidth: 0,
      }}>
        {/* Top bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: '32px',
          paddingBottom: '20px',
          borderBottom: `1px solid ${T.border}`,
        }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: T.textSub, fontSize: '13px', textDecoration: 'none',
              padding: '7px 14px',
              background: T.surfaceLight,
              border: `1px solid ${T.border}`,
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
          >
            View Live Portfolio ↗
          </a>
        </div>

        {/* Active section */}
        <div style={{ maxWidth: '900px' }}>
          {(() => {
            const ActiveComponent = SECTIONS[activeSection];
            return ActiveComponent ? <ActiveComponent key={activeSection} /> : <p style={{ color: T.textSub }}>Section not found.</p>;
          })()}
        </div>
      </main>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>
    </div>
  );
};

export default AdminLayout;
