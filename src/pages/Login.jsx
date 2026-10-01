import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from '@iconify/react';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, isAdmin, loading: authLoading, authReady, authError, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && isAdmin) navigate('/admin');
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (authError) { setError(authError); setLoading(false); }
  }, [authError]);

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(`Sign-in failed: ${err.message || err.code || 'Please try again'}`);
      }
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0b0f1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', 'Roboto', sans-serif", padding: '20px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{ position: 'fixed', top: '15%', left: '10%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '15%', right: '10%', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '22px',
        padding: '48px 40px',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08)',
        position: 'relative',
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '60px', height: '60px',
            background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
            borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', boxShadow: '0 10px 25px rgba(99,102,241,0.35)',
          }}>
            <Icon icon="mdi:shield-lock" style={{ fontSize: '30px', color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
            Portfolio Admin
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Sign in to manage your content
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.22)',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '24px',
            display: 'flex', alignItems: 'flex-start', gap: '10px',
          }}>
            <Icon icon="mdi:alert-circle" style={{ color: '#f87171', fontSize: '18px', flexShrink: 0, marginTop: '1px' }} />
            <span style={{ color: '#fca5a5', fontSize: '13px', lineHeight: 1.55 }}>{error}</span>
          </div>
        )}

        {/* Google button */}
        <GoogleButton onClick={handleGoogleLogin} loading={loading || !authReady} />

        {/* Security note */}
        <div style={{ marginTop: '28px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Icon icon="mdi:lock-check" style={{ color: '#6366f1', fontSize: '15px' }} />
            <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Restricted Access</span>
          </div>
          <p style={{ color: '#475569', fontSize: '12px', margin: 0, lineHeight: 1.6 }}>
            Only the authorized admin Google account can access this dashboard. All other sign-in attempts are automatically blocked.
          </p>
        </div>

        {/* Portfolio link */}
        <p style={{ textAlign: 'center', marginTop: '24px', marginBottom: 0 }}>
          <a href="/" style={{ color: '#475569', fontSize: '13px', textDecoration: 'none' }}>
            ← Back to portfolio
          </a>
        </p>
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
};

const GoogleButton = ({ onClick, loading }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick} disabled={loading} type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', padding: '14px 20px',
        background: hovered && !loading ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${hovered && !loading ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '12px', color: '#e2e8f0', fontSize: '15px', fontWeight: '500',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
        transition: 'all 0.2s ease', opacity: loading ? 0.65 : 1,
        fontFamily: 'inherit',
        boxShadow: hovered && !loading ? '0 0 20px rgba(99,102,241,0.12)' : 'none',
      }}
    >
      {loading
        ? <Icon icon="mdi:loading" style={{ fontSize: '20px', animation: 'spin 0.8s linear infinite' }} />
        : <Icon icon="flat-color-icons:google" style={{ fontSize: '22px' }} />
      }
      {loading ? 'Signing in…' : 'Continue with Google'}
    </button>
  );
};

export default Login;
