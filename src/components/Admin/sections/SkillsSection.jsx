import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useAdminSection } from '../hooks/useAdminSection';
import { T, inputStyle, labelStyle, sectionCardStyle, rowStyle } from '../adminTheme';
import SaveBar from '../ui/SaveBar';

const SkillsSection = () => {
  const { formData, setFormData, saving, saveStatus, save } = useAdminSection('skillData');
  if (!formData) return <p style={{ color: T.textSub }}>Loading…</p>;

  const skills = formData.skills || [];

  const setField = (field, val) => setFormData(prev => ({ ...prev, [field]: val }));

  const setSkill = (idx, key, val) => {
    const updated = [...skills];
    updated[idx] = { ...updated[idx], [key]: val };
    setField('skills', updated);
  };

  const addSkill = () => setField('skills', [...skills, { title: 'New Skill (Tool1, Tool2)', effect: 'fade-up', duration: '500', delay: '200' }]);

  const removeSkill = (idx) => setField('skills', skills.filter((_, i) => i !== idx));

  const moveSkill = (idx, dir) => {
    if (idx + dir < 0 || idx + dir >= skills.length) return;
    const updated = [...skills];
    [updated[idx], updated[idx + dir]] = [updated[idx + dir], updated[idx]];
    setField('skills', updated);
  };

  return (
    <div>
      <h2 style={{ color: T.text, fontSize: '22px', fontWeight: '700', margin: '0 0 6px' }}>Skills</h2>
      <p style={{ color: T.textSub, fontSize: '14px', margin: '0 0 28px' }}>
        Manage your skill categories. Use the format <code style={{ color: '#a5b4fc', background: T.accentBg, padding: '1px 6px', borderRadius: '4px' }}>Category (Tool1, Tool2)</code> to auto-generate tech badges.
      </p>

      <div style={sectionCardStyle}>
        <div style={rowStyle}>
          <label style={labelStyle}>Section Title</label>
          <input value={formData.title || ''} onChange={e => setField('title', e.target.value)} style={inputStyle()} />
        </div>
        <div style={rowStyle}>
          <label style={labelStyle}>Section Description</label>
          <textarea value={formData.text || ''} onChange={e => setField('text', e.target.value)} style={{ ...inputStyle(), minHeight: '80px', resize: 'vertical' }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ color: T.text, fontSize: '15px', fontWeight: '600', margin: 0 }}>Skill Entries ({skills.length})</h3>
        <button onClick={addSkill} style={{ padding: '8px 16px', background: T.accentBg, border: `1px solid ${T.accentBorder}`, borderRadius: '8px', color: '#a5b4fc', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: T.font }}>
          <Icon icon="mdi:plus" />Add Skill
        </button>
      </div>

      {skills.map((skill, idx) => (
        <div key={idx} style={{ ...sectionCardStyle, display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '12px', padding: '18px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Skill Title</label>
            <input value={skill.title || ''} onChange={e => setSkill(idx, 'title', e.target.value)} style={inputStyle()} placeholder="e.g. Machine Learning (Scikit-Learn, XGBoost)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '22px' }}>
            <button onClick={() => moveSkill(idx, -1)} disabled={idx === 0} style={{ padding: '6px', background: T.surfaceLight, border: `1px solid ${T.border}`, borderRadius: '6px', color: T.textSub, cursor: 'pointer' }} title="Move up">
              <Icon icon="mdi:chevron-up" />
            </button>
            <button onClick={() => moveSkill(idx, 1)} disabled={idx === skills.length - 1} style={{ padding: '6px', background: T.surfaceLight, border: `1px solid ${T.border}`, borderRadius: '6px', color: T.textSub, cursor: 'pointer' }} title="Move down">
              <Icon icon="mdi:chevron-down" />
            </button>
            <button onClick={() => removeSkill(idx)} style={{ padding: '6px', background: T.dangerBg, border: `1px solid ${T.dangerBorder}`, borderRadius: '6px', color: T.danger, cursor: 'pointer' }} title="Delete">
              <Icon icon="mdi:delete" />
            </button>
          </div>
        </div>
      ))}

      <SaveBar saving={saving} saveStatus={saveStatus} onSave={() => save()} />
    </div>
  );
};

export default SkillsSection;
