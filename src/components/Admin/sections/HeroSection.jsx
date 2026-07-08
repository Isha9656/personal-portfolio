import React, { useState } from 'react';
import { useAdminSection } from '../hooks/useAdminSection';
import { T, inputStyle, labelStyle, sectionCardStyle, rowStyle } from '../adminTheme';
import SaveBar from '../ui/SaveBar';

const Field = ({ label, value, onChange, type = 'text', placeholder }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={rowStyle}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type} value={value || ''} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={inputStyle(focused)}
      />
    </div>
  );
};

const HeroSection = () => {
  const { formData, setFormData, saving, saveStatus, save } = useAdminSection(
    'heroData',
    d => d.heroData?.homeOneHero
  );

  if (!formData) return <p style={{ color: T.textSub }}>Loading…</p>;

  const set = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSave = () => save({ homeOneHero: formData });

  return (
    <div>
      <h2 style={{ color: T.text, fontSize: '22px', fontWeight: '700', margin: '0 0 6px' }}>Hero Section</h2>
      <p style={{ color: T.textSub, fontSize: '14px', margin: '0 0 28px' }}>
        Edit the main landing banner text displayed at the top of your portfolio.
      </p>
      <div style={sectionCardStyle}>
        <Field label="Greeting (e.g. Hello, I'm)" value={formData.subTitle} onChange={v => set('subTitle', v)} />
        <Field label="Name (HTML allowed, e.g. Isha &lt;br /&gt; Kakadiya)" value={formData.title} onChange={v => set('title', v)} />
        <Field label="Designation / Role" value={formData.designation} onChange={v => set('designation', v)} placeholder="Machine Learning & AI Enthusiast" />
      </div>
      <SaveBar saving={saving} saveStatus={saveStatus} onSave={handleSave} />
    </div>
  );
};

export default HeroSection;
