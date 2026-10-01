import React, { useState } from 'react';
import { useAdminSection } from '../hooks/useAdminSection';
import { T, inputStyle, labelStyle, sectionCardStyle, rowStyle } from '../adminTheme';
import CloudinaryUploader from '../CloudinaryUploader';
import SaveBar from '../ui/SaveBar';

const Field = ({ label, value, onChange, multiline, placeholder }) => {
  const [focused, setFocused] = useState(false);
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div style={rowStyle}>
      <label style={labelStyle}>{label}</label>
      <Tag
        value={value || ''} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ ...inputStyle(focused), ...(multiline ? { minHeight: '100px', resize: 'vertical' } : {}) }}
      />
    </div>
  );
};

const UploadField = ({ label, value, onChange, accept = 'image/*' }) => (
  <div style={rowStyle}>
    <label style={labelStyle}>{label}</label>
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <input value={value || ''} onChange={e => onChange(e.target.value)} style={{ ...inputStyle(), flex: 1 }} placeholder="Paste URL or upload →" />
      <CloudinaryUploader accept={accept} buttonText="Upload" onUploadSuccess={url => onChange(url)} />
    </div>
    {value && accept.includes('image') && !value.endsWith('.pdf') && (
      <img src={value} alt="preview" style={{ marginTop: '10px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: `1px solid ${T.border}` }} />
    )}
    {value && (accept.includes('pdf') || value.endsWith('.pdf')) && (
      <p style={{ color: '#38bdf8', fontSize: '12px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        📄 PDF Document Attached: {value}
      </p>
    )}
  </div>
);

const AboutSection = () => {
  const { formData, setFormData, saving, saveStatus, save } = useAdminSection('aboutData');
  if (!formData) return <p style={{ color: T.textSub }}>Loading…</p>;

  const set = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const updateDetail = (idx, key, val) => {
    const updated = [...(formData.details || [])];
    updated[idx] = { ...updated[idx], [key]: val };
    set('details', updated);
  };

  return (
    <div>
      <h2 style={{ color: T.text, fontSize: '22px', fontWeight: '700', margin: '0 0 6px' }}>About Section</h2>
      <p style={{ color: T.textSub, fontSize: '14px', margin: '0 0 28px' }}>Edit your bio, profile photo, and key details shown in the About section.</p>

      <div style={sectionCardStyle}>
        <h3 style={{ color: T.textSub, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 18px' }}>Profile</h3>
        <UploadField label="Profile Photo" value={formData.imgLink} onChange={v => set('imgLink', v)} />
        <UploadField label="Resume PDF" value={formData.cvPdf} onChange={v => set('cvPdf', v)} accept="application/pdf" />
        <Field label="Heading (e.g. Hi There! I'm Isha)" value={formData.title} onChange={v => set('title', v)} />
        <Field label="Subtitle / Tagline" value={formData.subtitle} onChange={v => set('subtitle', v)} />
        <Field label="Bio Text" value={formData.text} onChange={v => set('text', v)} multiline />
      </div>

      {(formData.details || []).length > 0 && (
        <div style={sectionCardStyle}>
          <h3 style={{ color: T.textSub, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 18px' }}>Detail Cards</h3>
          {formData.details.map((d, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>Label</label>
                <input value={d.title || ''} onChange={e => updateDetail(i, 'title', e.target.value)} style={inputStyle()} />
              </div>
              <div>
                <label style={labelStyle}>Value</label>
                <input value={d.info || ''} onChange={e => updateDetail(i, 'info', e.target.value)} style={inputStyle()} />
              </div>
            </div>
          ))}
        </div>
      )}

      <SaveBar saving={saving} saveStatus={saveStatus} onSave={() => save()} />
    </div>
  );
};

export default AboutSection;
