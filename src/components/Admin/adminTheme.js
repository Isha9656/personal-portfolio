// Shared design tokens for the Admin Dashboard
// Mirrors the portfolio's slate-indigo-sky palette but adapted for an admin UI

export const T = {
  bg:            '#0b0f1a',
  surface:       'rgba(15, 23, 42, 0.85)',
  surfaceLight:  'rgba(255, 255, 255, 0.03)',
  border:        'rgba(255, 255, 255, 0.07)',
  borderHover:   'rgba(99, 102, 241, 0.35)',
  accent:        '#6366f1',
  accentBg:      'rgba(99, 102, 241, 0.12)',
  accentBorder:  'rgba(99, 102, 241, 0.25)',
  sky:           '#38bdf8',
  skyBg:         'rgba(56, 189, 248, 0.1)',
  text:          '#e2e8f0',
  textSub:       '#94a3b8',
  textMuted:     '#475569',
  danger:        '#ef4444',
  dangerBg:      'rgba(239, 68, 68, 0.1)',
  dangerBorder:  'rgba(239, 68, 68, 0.22)',
  success:       '#22c55e',
  successBg:     'rgba(34, 197, 94, 0.1)',
  successBorder: 'rgba(34, 197, 94, 0.22)',
  inputBg:       'rgba(255, 255, 255, 0.04)',
  inputBorder:   'rgba(255, 255, 255, 0.1)',
  radius:        '12px',
  radiusSm:      '8px',
  font:          "'Inter', 'Roboto', sans-serif",
};

// Reusable style builders
export const inputStyle = (focused = false) => ({
  width: '100%',
  padding: '10px 14px',
  background: T.inputBg,
  border: `1px solid ${focused ? T.accent : T.inputBorder}`,
  borderRadius: T.radiusSm,
  color: T.text,
  fontSize: '14px',
  fontFamily: T.font,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  boxShadow: focused ? `0 0 0 3px rgba(99,102,241,0.15)` : 'none',
});

export const labelStyle = {
  display: 'block',
  color: T.textSub,
  fontSize: '13px',
  fontWeight: '500',
  marginBottom: '6px',
};

export const sectionCardStyle = {
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: '16px',
  padding: '28px',
  marginBottom: '20px',
  backdropFilter: 'blur(10px)',
};

export const rowStyle = {
  marginBottom: '18px',
};
