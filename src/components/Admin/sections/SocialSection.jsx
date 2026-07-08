import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useAdminSection } from '../hooks/useAdminSection';
import { T, inputStyle, labelStyle, sectionCardStyle } from '../adminTheme';
import SaveBar from '../ui/SaveBar';
import ConfirmDialog from '../ui/ConfirmDialog';

const ICON_OPTIONS = ['linkedin', 'github', 'twitter', 'instagram', 'youtube', 'globe'];

const SocialSection = () => {
  const { formData: links, setFormData: setLinks, saving, saveStatus, save } = useAdminSection('socialData');
  const [confirmIdx, setConfirmIdx] = useState(null);
  if (!links) return <p style={{ color: T.textSub }}>Loading…</p>;

  const update = (idx, key, val) => {
    const updated = [...links];
    updated[idx] = { ...updated[idx], [key]: val };
    setLinks(updated);
  };

  const addLink = () => setLinks([...links, { icon: 'linkedin', title: '', link: '' }]);
  const deleteLink = (idx) => { setLinks(links.filter((_, i) => i !== idx)); setConfirmIdx(null); };

  return (
    <div>
      {confirmIdx !== null && (
        <ConfirmDialog
          message={`Remove "${links[confirmIdx]?.title || 'this social link'}"?`}
          onConfirm={() => deleteLink(confirmIdx)}
          onCancel={() => setConfirmIdx(null)}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h2 style={{ color: T.text, fontSize: '22px', fontWeight: '700', margin: '0 0 6px' }}>Social Links</h2>
          <p style={{ color: T.textSub, fontSize: '14px', margin: 0 }}>Links displayed in the Hero and Contact sections.</p>
        </div>
        <button onClick={addLink} style={{ padding: '10px 18px', background: T.accentBg, border: `1px solid ${T.accentBorder}`, borderRadius: '10px', color: '#a5b4fc', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: T.font }}>
          <Icon icon="mdi:plus" />Add Link
        </button>
      </div>

      {links.map((link, idx) => (
        <div key={idx} style={{ ...sectionCardStyle, marginBottom: '12px', padding: '18px', display: 'grid', gridTemplateColumns: '120px 1fr 2fr auto', gap: '12px', alignItems: 'flex-end' }}>
          <div>
            <label style={labelStyle}>Icon</label>
            <select value={link.icon || ''} onChange={e => update(idx, 'icon', e.target.value)} style={{ ...inputStyle(), cursor: 'pointer' }}>
              {ICON_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Label</label>
            <input value={link.title || ''} onChange={e => update(idx, 'title', e.target.value)} style={inputStyle()} placeholder="LinkedIn" />
          </div>
          <div>
            <label style={labelStyle}>URL</label>
            <input value={link.link || ''} onChange={e => update(idx, 'link', e.target.value)} style={inputStyle()} placeholder="https://…" />
          </div>
          <button onClick={() => setConfirmIdx(idx)} style={{ padding: '10px', background: T.dangerBg, border: `1px solid ${T.dangerBorder}`, borderRadius: '8px', color: T.danger, cursor: 'pointer' }}>
            <Icon icon="mdi:delete" />
          </button>
        </div>
      ))}

      <SaveBar saving={saving} saveStatus={saveStatus} onSave={() => save()} />
    </div>
  );
};

export default SocialSection;
