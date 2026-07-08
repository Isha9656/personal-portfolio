import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useAdminSection } from '../hooks/useAdminSection';
import { T, inputStyle, labelStyle, sectionCardStyle } from '../adminTheme';
import CloudinaryUploader from '../CloudinaryUploader';
import SaveBar from '../ui/SaveBar';
import ConfirmDialog from '../ui/ConfirmDialog';

const emptyProject = () => ({
  id: `proj-${Date.now()}`,
  title: '', subTitle: '', category: '', overview: '', methodology: '', results: '',
  tags: [], githubUrl: '', liveUrl: '', imgLink: '', imgLinkLg: '',
  images: [], featured: false,
});

const ProjectsSection = () => {
  const { formData: projects, setFormData: setProjects, saving, saveStatus, save } = useAdminSection('projects');
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [confirmIdx, setConfirmIdx] = useState(null);

  if (!projects) return <p style={{ color: T.textSub }}>Loading…</p>;

  const update = (idx, key, val) => {
    const list = [...projects];
    list[idx] = { ...list[idx], [key]: val };
    setProjects(list);
  };

  const addProject = () => {
    setProjects([...projects, emptyProject()]);
    setExpandedIdx(projects.length);
  };

  const deleteProject = (idx) => { setProjects(projects.filter((_, i) => i !== idx)); setConfirmIdx(null); setExpandedIdx(null); };

  const move = (idx, dir) => {
    if (idx + dir < 0 || idx + dir >= projects.length) return;
    const list = [...projects];
    [list[idx], list[idx + dir]] = [list[idx + dir], list[idx]];
    setProjects(list);
  };

  return (
    <div>
      {confirmIdx !== null && (
        <ConfirmDialog
          message={`Delete "${projects[confirmIdx]?.title || 'this project'}"?`}
          onConfirm={() => deleteProject(confirmIdx)}
          onCancel={() => setConfirmIdx(null)}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h2 style={{ color: T.text, fontSize: '22px', fontWeight: '700', margin: '0 0 6px' }}>Projects</h2>
          <p style={{ color: T.textSub, fontSize: '14px', margin: 0 }}>Full CRUD for your portfolio projects. Click a card to expand and edit.</p>
        </div>
        <button onClick={addProject} style={{ padding: '10px 18px', background: T.accentBg, border: `1px solid ${T.accentBorder}`, borderRadius: '10px', color: '#a5b4fc', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: T.font, fontWeight: '500' }}>
          <Icon icon="mdi:plus" />Add Project
        </button>
      </div>

      {projects.map((proj, idx) => {
        const expanded = expandedIdx === idx;
        return (
          <div key={proj.id || idx} style={{ ...sectionCardStyle, marginBottom: '12px', padding: '0', overflow: 'hidden' }}>
            {/* Collapsed header */}
            <div
              onClick={() => setExpandedIdx(expanded ? null : idx)}
              style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', userSelect: 'none' }}
            >
              {proj.imgLink
                ? <img src={proj.imgLink} alt="" style={{ width: '44px', height: '34px', objectFit: 'cover', borderRadius: '6px', border: `1px solid ${T.border}`, flexShrink: 0 }} />
                : <div style={{ width: '44px', height: '34px', background: T.accentBg, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon icon="mdi:folder" style={{ color: T.accent }} /></div>
              }
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ color: T.text, fontWeight: '600', fontSize: '14px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proj.title || 'Untitled Project'}</p>
                <p style={{ color: T.textMuted, fontSize: '12px', margin: 0 }}>{proj.category || 'No category'} {proj.featured ? '⭐ Featured' : ''}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                <button onClick={() => move(idx, -1)} disabled={idx === 0} style={{ padding: '5px', background: T.surfaceLight, border: `1px solid ${T.border}`, borderRadius: '6px', color: T.textSub, cursor: 'pointer' }} title="Move up"><Icon icon="mdi:chevron-up" /></button>
                <button onClick={() => move(idx, 1)} disabled={idx === projects.length - 1} style={{ padding: '5px', background: T.surfaceLight, border: `1px solid ${T.border}`, borderRadius: '6px', color: T.textSub, cursor: 'pointer' }} title="Move down"><Icon icon="mdi:chevron-down" /></button>
                <button onClick={() => setConfirmIdx(idx)} style={{ padding: '5px', background: T.dangerBg, border: `1px solid ${T.dangerBorder}`, borderRadius: '6px', color: T.danger, cursor: 'pointer' }}><Icon icon="mdi:delete" /></button>
              </div>
              <Icon icon={expanded ? 'mdi:chevron-up' : 'mdi:chevron-down'} style={{ color: T.textMuted, fontSize: '20px' }} />
            </div>

            {/* Expanded editor */}
            {expanded && (
              <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${T.border}` }}>
                <div style={{ paddingTop: '18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Title</label>
                    <input value={proj.title || ''} onChange={e => update(idx, 'title', e.target.value)} style={inputStyle()} />
                  </div>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <input value={proj.category || ''} onChange={e => update(idx, 'category', e.target.value)} style={inputStyle()} placeholder="e.g. Machine Learning" />
                  </div>
                </div>

                <div style={{ marginTop: '14px' }}>
                  <label style={labelStyle}>Short Description (Subtitle)</label>
                  <input value={proj.subTitle || ''} onChange={e => update(idx, 'subTitle', e.target.value)} style={inputStyle()} />
                </div>

                <div style={{ marginTop: '14px' }}>
                  <label style={labelStyle}>Overview</label>
                  <textarea value={proj.overview || ''} onChange={e => update(idx, 'overview', e.target.value)} style={{ ...inputStyle(), minHeight: '80px', resize: 'vertical' }} />
                </div>

                <div style={{ marginTop: '14px' }}>
                  <label style={labelStyle}>Methodology</label>
                  <textarea value={proj.methodology || ''} onChange={e => update(idx, 'methodology', e.target.value)} style={{ ...inputStyle(), minHeight: '80px', resize: 'vertical' }} />
                </div>

                <div style={{ marginTop: '14px' }}>
                  <label style={labelStyle}>Results</label>
                  <textarea value={proj.results || ''} onChange={e => update(idx, 'results', e.target.value)} style={{ ...inputStyle(), minHeight: '70px', resize: 'vertical' }} />
                </div>

                <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>GitHub URL</label>
                    <input value={proj.githubUrl || ''} onChange={e => update(idx, 'githubUrl', e.target.value)} style={inputStyle()} placeholder="https://github.com/…" />
                  </div>
                  <div>
                    <label style={labelStyle}>Live Demo URL</label>
                    <input value={proj.liveUrl || ''} onChange={e => update(idx, 'liveUrl', e.target.value)} style={inputStyle()} placeholder="https://…" />
                  </div>
                </div>

                <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Tags (comma-separated)</label>
                    <input
                      value={(proj.tags || []).join(', ')}
                      onChange={e => update(idx, 'tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                      style={inputStyle()} placeholder="Python, XGBoost, SMOTE" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '22px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: T.textSub, fontSize: '13px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={proj.featured || false} onChange={e => update(idx, 'featured', e.target.checked)} style={{ accentColor: T.accent }} />
                      Featured project
                    </label>
                  </div>
                </div>

                {/* Images */}
                <div style={{ marginTop: '18px' }}>
                  <label style={labelStyle}>Thumbnail Image</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input value={proj.imgLink || ''} onChange={e => update(idx, 'imgLink', e.target.value)} style={{ ...inputStyle(), flex: 1 }} placeholder="Paste URL or upload →" />
                    <CloudinaryUploader accept="image/*" buttonText="Upload" onUploadSuccess={url => update(idx, 'imgLink', url)} />
                  </div>
                </div>

                <div style={{ marginTop: '14px' }}>
                  <label style={labelStyle}>Hero / Detail Image (large)</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input value={proj.imgLinkLg || ''} onChange={e => update(idx, 'imgLinkLg', e.target.value)} style={{ ...inputStyle(), flex: 1 }} placeholder="Paste URL or upload →" />
                    <CloudinaryUploader accept="image/*" buttonText="Upload" onUploadSuccess={url => update(idx, 'imgLinkLg', url)} />
                  </div>
                </div>

                <div style={{ marginTop: '14px' }}>
                  <label style={labelStyle}>Gallery / Screenshot Images</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                    <CloudinaryUploader multiple accept="image/*" buttonText="Upload Images" onUploadSuccess={urls => update(idx, 'images', [...(proj.images || []), ...urls])} />
                    <span style={{ color: T.textMuted, fontSize: '12px' }}>{(proj.images || []).length} uploaded</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(proj.images || []).map((img, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={img} alt="" style={{ width: '80px', height: '56px', objectFit: 'cover', borderRadius: '6px', border: `1px solid ${T.border}` }} />
                        <button
                          onClick={() => update(idx, 'images', proj.images.filter((_, ii) => ii !== i))}
                          style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: T.danger, border: 'none', color: '#fff', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <SaveBar saving={saving} saveStatus={saveStatus} onSave={() => save()} />
    </div>
  );
};

export default ProjectsSection;
