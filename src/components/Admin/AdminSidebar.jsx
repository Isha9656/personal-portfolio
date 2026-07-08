import React from 'react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../context/AuthContext';
import { T } from './adminTheme';

const navItems = [
  { key: 'overview',      label: 'Overview',      icon: 'mdi:view-dashboard' },
  { key: 'hero',          label: 'Hero',           icon: 'mdi:home-account' },
  { key: 'about',         label: 'About',          icon: 'mdi:account' },
  { key: 'skills',        label: 'Skills',         icon: 'mdi:code-braces' },
  { key: 'experience',    label: 'Experience',     icon: 'mdi:briefcase' },
  { key: 'education',     label: 'Education',      icon: 'mdi:school' },
  { key: 'certificates',  label: 'Certificates',   icon: 'mdi:certificate' },
  { key: 'projects',      label: 'Projects',       icon: 'mdi:folder-multiple' },
  { key: 'social',        label: 'Social Links',   icon: 'mdi:share-variant' },
  { key: 'contact',       label: 'Contact',        icon: 'mdi:email' },
];

const AdminSidebar = ({ activeSection, setActiveSection, collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();

  const itemStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: collapsed ? 0 : '12px',
    justifyContent: collapsed ? 'center' : 'flex-start',
    padding: collapsed ? '12px' : '10px 14px',
    borderRadius: '10px',
    background: active ? T.accentBg : 'transparent',
    border: `1px solid ${active ? T.accentBorder : 'transparent'}`,
    color: active ? '#a5b4fc' : T.textSub,
    fontSize: '14px',
    fontWeight: active ? '600' : '400',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: '100%',
    textAlign: 'left',
    fontFamily: T.font,
  });

  return (
    <aside style={{
      width: collapsed ? '68px' : '230px',
      minHeight: '100vh',
      background: 'rgba(10,14,26,0.95)',
      borderRight: `1px solid ${T.border}`,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s ease',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflow: 'hidden',
    }}>
      {/* Brand + collapse toggle */}
      <div style={{ padding: '20px 14px 16px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: `linear-gradient(135deg, ${T.accent}, ${T.sky})`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon icon="mdi:shield-lock" style={{ color: '#fff', fontSize: '17px' }} />
            </div>
            <span style={{ color: T.text, fontWeight: '700', fontSize: '14px', letterSpacing: '-0.2px' }}>CMS Admin</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer', padding: '4px', borderRadius: '6px', display: 'flex' }}>
          <Icon icon={collapsed ? 'mdi:menu-open' : 'mdi:menu'} style={{ fontSize: '20px' }} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {navItems.map(item => (
          <button key={item.key} onClick={() => setActiveSection(item.key)} title={collapsed ? item.label : ''} style={itemStyle(activeSection === item.key)}>
            <Icon icon={item.icon} style={{ fontSize: '18px', flexShrink: 0 }} />
            {!collapsed && item.label}
          </button>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '12px 8px', borderTop: `1px solid ${T.border}` }}>
        {!collapsed && user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', marginBottom: '6px' }}>
            {user.photoURL
              ? <img src={user.photoURL} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', border: `2px solid ${T.accentBorder}` }} />
              : <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: T.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon icon="mdi:account" style={{ color: T.accent }} /></div>
            }
            <div style={{ overflow: 'hidden' }}>
              <p style={{ color: T.text, fontSize: '13px', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.displayName || 'Admin'}</p>
              <p style={{ color: T.textMuted, fontSize: '11px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
            </div>
          </div>
        )}
        <button onClick={logout} title={collapsed ? 'Logout' : ''} style={{ ...itemStyle(false), color: '#f87171', borderColor: 'transparent' }}>
          <Icon icon="mdi:logout" style={{ fontSize: '18px', flexShrink: 0 }} />
          {!collapsed && 'Logout'}
        </button>
        {!collapsed && (
          <a href="/" target="_blank" rel="noopener noreferrer" style={{ ...itemStyle(false), textDecoration: 'none', display: 'flex' }}>
            <Icon icon="mdi:open-in-new" style={{ fontSize: '18px', flexShrink: 0 }} />
            View Portfolio
          </a>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
