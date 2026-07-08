import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useData } from '../../../context/DataContext';
import { T } from '../adminTheme';
import localData from '../../../Data.json';

const StatCard = ({ icon, label, value, color }) => (
  <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '14px', padding: '24px', display: 'flex', alignItems: 'center', gap: '18px' }}>
    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: color || T.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon icon={icon} style={{ fontSize: '26px', color: T.accent }} />
    </div>
    <div>
      <p style={{ color: T.text, fontSize: '26px', fontWeight: '700', margin: 0, lineHeight: 1 }}>{value}</p>
      <p style={{ color: T.textSub, fontSize: '13px', margin: '4px 0 0' }}>{label}</p>
    </div>
  </div>
);

const OverviewSection = () => {
  const { data, updateData } = useData();
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  if (!data) return null;

  const handleSeed = async () => {
    if (!window.confirm("This will overwrite your Firestore database with the default local Data.json file. Continue?")) {
      return;
    }
    setSeeding(true);
    setSeedSuccess(false);
    try {
      await updateData(localData);
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 4000);
    } catch (err) {
      alert("Failed to sync data: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const stats = [
    { icon: 'mdi:folder-multiple', label: 'Projects', value: data.projects?.length ?? 0 },
    { icon: 'mdi:certificate', label: 'Certificates', value: data.certificates?.length ?? 0 },
    { icon: 'mdi:briefcase', label: 'Experience', value: data.resumeData?.experience?.length ?? 0 },
    { icon: 'mdi:school', label: 'Education', value: data.resumeData?.education?.length ?? 0 },
    { icon: 'mdi:code-braces', label: 'Skills', value: data.skillData?.skills?.length ?? 0 },
    { icon: 'mdi:share-variant', label: 'Social Links', value: data.socialData?.length ?? 0 },
  ];

  return (
    <div>
      <h2 style={{ color: T.text, fontSize: '22px', fontWeight: '700', margin: '0 0 8px' }}>Dashboard Overview</h2>
      <p style={{ color: T.textSub, margin: '0 0 30px', fontSize: '14px' }}>
        Welcome back! Here's a summary of your portfolio content.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Seeding / Sync Section */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Icon icon="mdi:database-sync" style={{ color: T.sky, fontSize: '20px' }} />
          <h3 style={{ color: T.text, fontWeight: '600', fontSize: '16px', margin: 0 }}>Sync Local Data to Firebase</h3>
        </div>
        <p style={{ color: T.textSub, fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px' }}>
          First-time setup? You can upload all your existing static portfolio data (from <code>Data.json</code>) directly to your new Firestore database with one click.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handleSeed}
            disabled={seeding}
            style={{
              padding: '10px 20px',
              background: seeding ? T.accentBg : `linear-gradient(135deg, ${T.accent}, ${T.sky})`,
              border: 'none',
              borderRadius: T.radiusSm,
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: seeding ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: seeding ? 0.7 : 1,
              transition: 'all 0.2s ease',
              fontFamily: T.font,
            }}
          >
            {seeding ? (
              <><Icon icon="mdi:loading" style={{ animation: 'spin 0.8s linear infinite' }} />Syncing...</>
            ) : (
              <><Icon icon="mdi:cloud-upload" />Push Data.json to Firestore</>
            )}
          </button>
          {seedSuccess && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: T.success, fontSize: '13px', fontWeight: '500' }}>
              <Icon icon="mdi:check-circle" />Firestore populated successfully!
            </span>
          )}
        </div>
      </div>

      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '14px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Icon icon="mdi:information" style={{ color: T.accent, fontSize: '20px' }} />
          <h3 style={{ color: T.text, fontWeight: '600', fontSize: '16px', margin: 0 }}>Quick Guide</h3>
        </div>
        <ul style={{ color: T.textSub, fontSize: '14px', lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
          <li>Use the sidebar to navigate between content sections.</li>
          <li>Each section has its own <strong style={{ color: T.text }}>Save Changes</strong> button — changes are not auto-saved.</li>
          <li>Images upload directly to <strong style={{ color: T.text }}>Cloudinary</strong> via the Upload buttons.</li>
          <li>Your portfolio updates live as soon as you save to Firestore.</li>
          <li>Use the <strong style={{ color: T.text }}>View Portfolio</strong> link in the sidebar to see live changes.</li>
        </ul>
      </div>
    </div>
  );
};

export default OverviewSection;

