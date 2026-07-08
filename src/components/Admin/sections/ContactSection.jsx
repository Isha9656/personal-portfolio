import React, { useState } from 'react';
import { useAdminSection } from '../hooks/useAdminSection';
import { T, inputStyle, labelStyle, sectionCardStyle, rowStyle } from '../adminTheme';
import SaveBar from '../ui/SaveBar';

const ContactSection = () => {
  const { formData, setFormData, saving, saveStatus, save } = useAdminSection('contactData');
  if (!formData) return <p style={{ color: T.textSub }}>Loading…</p>;

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const Field = ({ label, field, placeholder, multiline }) => {
    const [focused, setFocused] = useState(false);
    const Tag = multiline ? 'textarea' : 'input';
    return (
      <div style={rowStyle}>
        <label style={labelStyle}>{label}</label>
        <Tag
          value={formData[field] || ''}
          onChange={e => set(field, e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...inputStyle(focused), ...(multiline ? { minHeight: '90px', resize: 'vertical' } : {}) }}
        />
      </div>
    );
  };

  return (
    <div>
      <h2 style={{ color: T.text, fontSize: '22px', fontWeight: '700', margin: '0 0 6px' }}>Contact Information</h2>
      <p style={{ color: T.textSub, fontSize: '14px', margin: '0 0 28px' }}>Details shown in the Contact section of your portfolio.</p>

      <div style={sectionCardStyle}>
        <Field label="Section Heading" field="formTitle" placeholder="Get In Touch" />
        <Field label="Section Subtitle" field="subTitle" placeholder="Let's discuss data science and collaboration" />
        <Field label="Contact Description" field="text" multiline />
      </div>

      <div style={sectionCardStyle}>
        <h3 style={{ color: T.textSub, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 18px' }}>Contact Details</h3>
        <Field label="Email Address" field="email" placeholder="you@example.com" />
        <Field label="Phone Number (optional)" field="phone" placeholder="+91 …" />
        <Field label="Location / Address" field="address" placeholder="Gujarat, India" />
      </div>

      <SaveBar saving={saving} saveStatus={saveStatus} onSave={() => save()} />
    </div>
  );
};

export default ContactSection;
