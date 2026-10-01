import React from 'react';
import { Icon } from '@iconify/react';
import { T } from '../adminTheme';

/**
 * Reusable Save button with inline status feedback.
 * Eliminates repeated save-button boilerplate across every section.
 */
const SaveBar = ({ saving, saveStatus, saveError, onSave, label = 'Save Changes' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      style={{
        padding: '10px 24px',
        background: saving ? T.accentBg : `linear-gradient(135deg, ${T.accent}, ${T.sky})`,
        border: 'none',
        borderRadius: T.radiusSm,
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        cursor: saving ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        opacity: saving ? 0.7 : 1,
        transition: 'all 0.2s ease',
        fontFamily: T.font,
      }}
    >
      {saving
        ? <><Icon icon="mdi:loading" style={{ animation: 'spin 0.8s linear infinite' }} />Saving…</>
        : <><Icon icon="mdi:content-save" />{label}</>
      }
    </button>

    {saveStatus === 'success' && (
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: T.success, fontSize: '13px', fontWeight: '500' }}>
        <Icon icon="mdi:check-circle" />Saved successfully
      </span>
    )}
    {saveStatus === 'error' && (
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: T.danger, fontSize: '13px', fontWeight: '500' }}>
        <Icon icon="mdi:alert-circle" />{saveError || 'Save failed. Check Firebase configuration and security rules.'}
      </span>
    )}
  </div>
);

export default SaveBar;
