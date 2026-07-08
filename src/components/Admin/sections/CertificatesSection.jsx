import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useAdminSection } from '../hooks/useAdminSection';
import { T, inputStyle, labelStyle, sectionCardStyle } from '../adminTheme';
import CloudinaryUploader from '../CloudinaryUploader';
import SaveBar from '../ui/SaveBar';
import ConfirmDialog from '../ui/ConfirmDialog';

const emptyCert = () => ({ id: Date.now(), title: '', issuer: '', date: '', imgUrl: '', credentialUrl: '', featured: false, displayOrder: '' });

const CertificatesSection = () => {
  const { formData: certs, setFormData: setCerts, saving, saveStatus, save } = useAdminSection('certificates');
  const [confirmIdx, setConfirmIdx] = useState(null);

  if (!certs) return <p style={{ color: T.textSub }}>Loading…</p>;

  const updateCert = (idx, key, val) => {
    const updated = [...certs];
    updated[idx] = { ...updated[idx], [key]: val };
    setCerts(updated);
  };

  const addCert = () => setCerts([...certs, emptyCert()]);
  const deleteCert = (idx) => { setCerts(certs.filter((_, i) => i !== idx)); setConfirmIdx(null); };

  return (
    <div>
      {confirmIdx !== null && (
        <ConfirmDialog
          message={`Delete "${certs[confirmIdx]?.title || 'this certificate'}"?`}
          onConfirm={() => deleteCert(confirmIdx)}
          onCancel={() => setConfirmIdx(null)}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h2 style={{ color: T.text, fontSize: '22px', fontWeight: '700', margin: '0 0 6px' }}>Certificates</h2>
          <p style={{ color: T.textSub, fontSize: '14px', margin: 0 }}>Add, edit, and reorder your professional certifications.</p>
        </div>
        <button onClick={addCert} style={{ padding: '10px 18px', background: T.accentBg, border: `1px solid ${T.accentBorder}`, borderRadius: '10px', color: '#a5b4fc', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: T.font, fontWeight: '500' }}>
          <Icon icon="mdi:plus" />Add Certificate
        </button>
      </div>

      {certs.map((cert, idx) => (
        <div key={cert.id || idx} style={{ ...sectionCardStyle, marginBottom: '16px', padding: '22px' }}>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: T.textSub, fontSize: '13px', cursor: 'pointer' }}>
              <input type="checkbox" checked={cert.featured || false} onChange={e => updateCert(idx, 'featured', e.target.checked)} style={{ accentColor: T.accent }} />
              Featured (show first)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div>
                <span style={{ color: T.textMuted, fontSize: '12px', marginRight: '6px' }}>Order:</span>
                <input type="number" value={cert.displayOrder || ''} onChange={e => updateCert(idx, 'displayOrder', e.target.value)} style={{ ...inputStyle(), width: '60px', display: 'inline-block' }} />
              </div>
              <button onClick={() => setConfirmIdx(idx)} style={{ padding: '6px 12px', background: T.dangerBg, border: `1px solid ${T.dangerBorder}`, borderRadius: '7px', color: T.danger, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: T.font }}>
                <Icon icon="mdi:delete" style={{ fontSize: '14px' }} />Delete
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>Certificate Title</label>
              <input value={cert.title || ''} onChange={e => updateCert(idx, 'title', e.target.value)} style={inputStyle()} />
            </div>
            <div>
              <label style={labelStyle}>Issuer / Organisation</label>
              <input value={cert.issuer || ''} onChange={e => updateCert(idx, 'issuer', e.target.value)} style={inputStyle()} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>Issue Date</label>
              <input value={cert.date || ''} onChange={e => updateCert(idx, 'date', e.target.value)} style={inputStyle()} placeholder="e.g. June 2024" />
            </div>
            <div>
              <label style={labelStyle}>Credential URL (optional)</label>
              <input value={cert.credentialUrl || ''} onChange={e => updateCert(idx, 'credentialUrl', e.target.value)} style={inputStyle()} placeholder="https://…" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Certificate Image</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input value={cert.imgUrl || ''} onChange={e => updateCert(idx, 'imgUrl', e.target.value)} style={{ ...inputStyle(), flex: 1 }} placeholder="Paste URL or upload →" />
              <CloudinaryUploader accept="image/*,application/pdf" buttonText="Upload" onUploadSuccess={url => updateCert(idx, 'imgUrl', url)} />
            </div>
            {cert.imgUrl && (
              <img src={cert.imgUrl} alt="preview" style={{ marginTop: '10px', height: '70px', objectFit: 'contain', border: `1px solid ${T.border}`, borderRadius: '6px', padding: '4px', background: 'rgba(255,255,255,0.03)' }} />
            )}
          </div>
        </div>
      ))}

      <SaveBar saving={saving} saveStatus={saveStatus} onSave={() => save()} />
    </div>
  );
};

export default CertificatesSection;
