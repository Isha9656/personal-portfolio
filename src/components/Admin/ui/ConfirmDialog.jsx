import React from 'react';
import { Icon } from '@iconify/react';
import { T } from '../adminTheme';

/** Reusable confirmation dialog for destructive actions (delete). */
const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
  }}>
    <div style={{
      background: 'rgba(15,23,42,0.97)', border: `1px solid ${T.border}`,
      borderRadius: '18px', padding: '32px', maxWidth: '400px', width: '100%',
      boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: T.dangerBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon icon="mdi:alert" style={{ color: T.danger, fontSize: '24px' }} />
        </div>
        <div>
          <p style={{ color: T.text, fontWeight: '600', fontSize: '16px', margin: '0 0 4px' }}>Confirm Delete</p>
          <p style={{ color: T.textSub, fontSize: '13px', margin: 0, lineHeight: 1.5 }}>{message || 'This action cannot be undone.'}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button onClick={onCancel} style={{ padding: '9px 20px', background: T.surfaceLight, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.textSub, fontSize: '14px', cursor: 'pointer', fontFamily: T.font }}>
          Cancel
        </button>
        <button onClick={onConfirm} style={{ padding: '9px 20px', background: T.danger, border: 'none', borderRadius: T.radiusSm, color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: T.font }}>
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
