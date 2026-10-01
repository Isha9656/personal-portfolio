import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useAdminSection } from '../hooks/useAdminSection';
import { T, inputStyle, labelStyle, sectionCardStyle } from '../adminTheme';
import CloudinaryUploader from '../CloudinaryUploader';
import SaveBar from '../ui/SaveBar';
import ConfirmDialog from '../ui/ConfirmDialog';
import { isPdfAsset } from '../../../utils/media';

/** Generate a unique certificate ID */
const generateId = () => `cert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

const emptyCert = () => ({ id: generateId(), title: '', issuer: '', date: '', imgUrl: '', credentialUrl: '', featured: false, displayOrder: '' });

const CertificatesSection = () => {
  const { formData: certs, setFormData: setCerts, saving, saveStatus, saveError, save } = useAdminSection('certificates');
  const [confirmIdx, setConfirmIdx] = useState(null);

  if (!certs) return <p style={{ color: T.textSub }}>Loading…</p>;

  const updateCert = (idx, keyOrFields, val) => {
    const updated = [...certs];
    if (typeof keyOrFields === 'object') {
      updated[idx] = { ...updated[idx], ...keyOrFields };
    } else {
      updated[idx] = { ...updated[idx], [keyOrFields]: val };
    }
    setCerts(updated);
  };

  const addCert = () => setCerts([...certs, emptyCert()]);
  const deleteCert = (idx) => { setCerts(certs.filter((_, i) => i !== idx)); setConfirmIdx(null); };

  const handleSave = () => {
    // Validate: warn about certificates with no title
    const valid = certs.filter(c => c.title && c.title.trim() !== '');
    if (valid.length < certs.length) {
      const removed = certs.length - valid.length;
      if (!window.confirm(`${removed} certificate(s) with empty titles will be removed. Continue?`)) return;
      setCerts(valid);
    }
    save(valid.length < certs.length ? valid : undefined);
  };

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

      {certs.length === 0 && (
        <div style={{ ...sectionCardStyle, textAlign: 'center', padding: '40px 20px' }}>
          <Icon icon="mdi:certificate-outline" style={{ fontSize: '48px', color: T.textMuted, marginBottom: '12px' }} />
          <p style={{ color: T.textSub, fontSize: '15px', margin: 0 }}>No certificates yet. Click "Add Certificate" to add your first one.</p>
        </div>
      )}

      {certs.map((cert, idx) => {
        const fileUrl = cert.pdfUrl || cert.imgUrl || '';
        const isPdf = cert.pdfType
          ? cert.pdfType === 'application/pdf'
          : cert.pdfUrl
            ? true
            : isPdfAsset(fileUrl);

        return (
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
                <label style={labelStyle}>Certificate Title *</label>
                <input value={cert.title || ''} onChange={e => updateCert(idx, 'title', e.target.value)} style={inputStyle()} placeholder="e.g. Data Analytics Job Simulation" />
              </div>
              <div>
                <label style={labelStyle}>Issuer / Organisation</label>
                <input value={cert.issuer || ''} onChange={e => updateCert(idx, 'issuer', e.target.value)} style={inputStyle()} placeholder="e.g. Deloitte (Forage)" />
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

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Description / Highlights (Shown inside modal when clicked)</label>
              <textarea
                value={cert.description || cert.text || ''}
                onChange={e => updateCert(idx, 'description', e.target.value)}
                style={{ ...inputStyle(), minHeight: '60px', resize: 'vertical' }}
                placeholder="e.g. Completed intensive coursework covering machine learning modeling, exploratory data analysis, and feature engineering..."
              />
            </div>

            {/* 1. Organization Logo */}
            <div style={{ marginBottom: '16px', padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: `1px solid ${T.border}` }}>
              <label style={{ ...labelStyle, color: T.accent, fontWeight: '600', marginBottom: '6px' }}>
                1. Organization / Issuer Logo (Displayed Outside on Card)
              </label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  value={cert.orgLogo || cert.orgImg || ''} 
                  onChange={e => updateCert(idx, { orgLogo: e.target.value, orgImg: e.target.value })} 
                  style={{ ...inputStyle(), flex: 1 }} 
                  placeholder="Paste Organization Logo URL (e.g. /images/Deloitte.png) or upload →" 
                />
                <CloudinaryUploader 
                  accept="image/*" 
                  buttonText="Upload Logo" 
                  onUploadSuccess={url => updateCert(idx, { orgLogo: url, orgImg: url })} 
                />
              </div>
              {(cert.orgLogo || cert.orgImg) && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={cert.orgLogo || cert.orgImg} alt="logo preview" style={{ height: '40px', objectFit: 'contain', border: `1px solid ${T.border}`, borderRadius: '6px', padding: '4px', background: 'rgba(255,255,255,0.04)' }} />
                  <span style={{ fontSize: '12px', color: T.textSub }}>Logo Preview</span>
                </div>
              )}
            </div>

            {/* 2. Certificate PDF / Document */}
            <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: `1px solid ${T.border}` }}>
              <label style={{ ...labelStyle, color: T.sky, fontWeight: '600', marginBottom: '6px' }}>
                2. Certificate PDF Document or Proof (Displayed Inside Detail Modal)
              </label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  value={cert.pdfUrl || cert.imgUrl || ''} 
                  onChange={e => {
                    const val = e.target.value;
                    updateCert(idx, {
                      pdfUrl: val,
                      pdfType: isPdfAsset(val) ? 'application/pdf' : '',
                      imgUrl: cert.orgLogo || cert.imgUrl || val
                    });
                  }} 
                  style={{ ...inputStyle(), flex: 1 }} 
                  placeholder="Paste PDF URL (e.g. /images/certificate.pdf) or upload file →" 
                />
                <CloudinaryUploader 
                  accept="image/*,application/pdf" 
                  buttonText="Upload Certificate PDF/File" 
                  onUploadSuccess={(url, file) => {
                    updateCert(idx, {
                      pdfUrl: url,
                      pdfType: file?.type || (isPdfAsset(url) ? 'application/pdf' : 'image/*'),
                      imgUrl: cert.orgLogo || url
                    });
                  }} 
                />
              </div>
              {(cert.pdfUrl || cert.imgUrl) && (
                <div style={{ marginTop: '8px' }}>
                  {(cert.pdfUrl || cert.imgUrl || '').toLowerCase().endsWith('.pdf') || (cert.pdfUrl || cert.imgUrl || '').includes('application/pdf') ? (
                    <span style={{ color: '#38bdf8', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      📄 Certificate PDF Attached: {cert.pdfUrl || cert.imgUrl}
                    </span>
                  ) : (
                    <img src={cert.pdfUrl || cert.imgUrl} alt="cert preview" style={{ height: '70px', objectFit: 'contain', border: `1px solid ${T.border}`, borderRadius: '6px', padding: '4px', background: 'rgba(255,255,255,0.03)' }} />
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      <SaveBar saving={saving} saveStatus={saveStatus} saveError={saveError} onSave={handleSave} />
    </div>
  );
};

export default CertificatesSection;
