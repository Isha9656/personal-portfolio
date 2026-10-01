import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useAdminSection } from '../hooks/useAdminSection';
import { T, inputStyle, labelStyle, sectionCardStyle } from '../adminTheme';
import CloudinaryUploader from '../CloudinaryUploader';
import SaveBar from '../ui/SaveBar';
import ConfirmDialog from '../ui/ConfirmDialog';

const emptyEntry = () => ({ title: '', duration: '', subTitle: '', text: '', imgLink: '', extraDetails: '', certificateUrl: '' });

const EntryEditor = ({ entry, onChange, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const set = (key, val) => onChange({ ...entry, [key]: val });

  return (
    <div style={{ ...sectionCardStyle, marginBottom: '14px', padding: '20px' }}>
      {confirmDelete && (
        <ConfirmDialog
          message={`Delete "${entry.title || 'this entry'}"? This cannot be undone.`}
          onConfirm={onDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
        <button onClick={() => setConfirmDelete(true)} style={{ padding: '6px 12px', background: T.dangerBg, border: `1px solid ${T.dangerBorder}`, borderRadius: '7px', color: T.danger, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: T.font }}>
          <Icon icon="mdi:delete" style={{ fontSize: '14px' }} />Delete
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
        <div>
          <label style={labelStyle}>Title / Role / Degree</label>
          <input value={entry.title || ''} onChange={e => set('title', e.target.value)} style={inputStyle()} />
        </div>
        <div>
          <label style={labelStyle}>Duration</label>
          <input value={entry.duration || ''} onChange={e => set('duration', e.target.value)} style={inputStyle()} placeholder="e.g. Apr 2026 – Present" />
        </div>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Organisation / Company</label>
        <input value={entry.subTitle || ''} onChange={e => set('subTitle', e.target.value)} style={inputStyle()} />
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Description</label>
        <textarea value={entry.text || ''} onChange={e => set('text', e.target.value)} style={{ ...inputStyle(), minHeight: '80px', resize: 'vertical' }} />
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Additional Details (appears when clicked - optional)</label>
        <textarea value={entry.extraDetails || ''} onChange={e => set('extraDetails', e.target.value)} style={{ ...inputStyle(), minHeight: '60px', resize: 'vertical' }} placeholder="Add bullet points or extra information about your projects/responsibilities here..." />
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Certificate Link (Google Drive / PDF URL - optional)</label>
        <input value={entry.certificateUrl || ''} onChange={e => set('certificateUrl', e.target.value)} style={inputStyle()} placeholder="https://drive.google.com/..." />
      </div>

      <div>
        <label style={labelStyle}>Organisation Logo</label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input value={entry.imgLink || ''} onChange={e => set('imgLink', e.target.value)} style={{ ...inputStyle(), flex: 1 }} placeholder="Paste URL or upload →" />
          <CloudinaryUploader accept="image/*" buttonText="Upload" onUploadSuccess={url => set('imgLink', url)} />
        </div>
        {entry.imgLink && (
          <img src={entry.imgLink} alt="logo" style={{ marginTop: '10px', height: '50px', objectFit: 'contain', border: `1px solid ${T.border}`, borderRadius: '6px', padding: '4px', background: 'rgba(255,255,255,0.04)' }} />
        )}
      </div>
    </div>
  );
};

const ResumeSection = () => {
  const { formData, setFormData, saving, saveStatus, save } = useAdminSection('resumeData');
  if (!formData) return <p style={{ color: T.textSub }}>Loading…</p>;

  const updateList = (type, list) => setFormData(prev => ({ ...prev, [type]: list }));

  const updateEntry = (type, idx, updated) => {
    const list = [...(formData[type] || [])];
    list[idx] = updated;
    updateList(type, list);
  };

  const addEntry = (type) => updateList(type, [...(formData[type] || []), emptyEntry()]);
  const deleteEntry = (type, idx) => updateList(type, (formData[type] || []).filter((_, i) => i !== idx));

  const renderSection = (type, heading) => (
    <div style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ color: T.text, fontSize: '16px', fontWeight: '600', margin: 0 }}>{heading}</h3>
        <button onClick={() => addEntry(type)} style={{ padding: '8px 16px', background: T.accentBg, border: `1px solid ${T.accentBorder}`, borderRadius: '8px', color: '#a5b4fc', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: T.font }}>
          <Icon icon="mdi:plus" />Add {heading}
        </button>
      </div>
      {(formData[type] || []).map((entry, idx) => (
        <EntryEditor
          key={idx}
          entry={entry}
          onChange={updated => updateEntry(type, idx, updated)}
          onDelete={() => deleteEntry(type, idx)}
        />
      ))}
    </div>
  );

  return (
    <div>
      <h2 style={{ color: T.text, fontSize: '22px', fontWeight: '700', margin: '0 0 6px' }}>Resume</h2>
      <p style={{ color: T.textSub, fontSize: '14px', margin: '0 0 28px' }}>Manage your work experience and academic education timeline entries.</p>
      {renderSection('experience', 'Experience')}
      {renderSection('education', 'Education')}
      <SaveBar saving={saving} saveStatus={saveStatus} onSave={() => save()} />
    </div>
  );
};

export default ResumeSection;
