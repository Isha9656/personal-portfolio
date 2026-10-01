import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [authClient, setAuthClient] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const needsAuth = location.pathname === '/login'
    || location.pathname === '/admin'
    || location.pathname.startsWith('/admin/');

  useEffect(() => {
    if (!needsAuth) {
      setLoading(false);
      setAuthClient(null);
      setAuthInitialized(false);
      return undefined;
    }

    setLoading(true);
    setAuthInitialized(false);
    localStorage.removeItem('admin_bypass');
    let active = true;
    let unsubscribe = () => {};

    const initializeAuth = async () => {
      try {
        const [{ auth }, authSdk] = await Promise.all([
          import('../firebase/firebase'),
          import('firebase/auth'),
        ]);
        if (!active) return;
        if (!auth) {
          setAuthError('Authentication service unavailable.');
          setAuthInitialized(true);
          setLoading(false);
          return;
        }

        const client = { auth, ...authSdk };
        setAuthClient(client);
        setAuthInitialized(true);
        unsubscribe = authSdk.onAuthStateChanged(auth, async (currentUser) => {
          setAuthError('');
          try {
            if (!currentUser) {
              setUser(null);
              setIsAdmin(false);
              return;
            }

            const allowedEmail = import.meta.env.VITE_ADMIN_EMAIL;
            const allowedEmails = (allowedEmail || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean);
            const userEmail = currentUser.email?.trim().toLowerCase();
            if (userEmail && allowedEmails.includes(userEmail)) {
              setUser(currentUser);
              setIsAdmin(true);
            } else {
              setAuthError(allowedEmails.length
                ? `Access denied for ${currentUser.email || 'this account'}.`
                : 'Admin access is not configured on the server.');
              setUser(null);
              setIsAdmin(false);
              await authSdk.signOut(auth);
            }
          } catch (error) {
            console.error('Auth state error:', error);
            setAuthError('Authentication verification failed.');
          } finally {
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Firebase Auth setup failed:', error);
        if (active) {
          setAuthError('Authentication service unavailable.');
          setAuthInitialized(true);
          setLoading(false);
        }
      }
    };

    initializeAuth();
    return () => {
      active = false;
      unsubscribe();
    };
  }, [needsAuth]);

  const loginWithGoogle = async () => {
    localStorage.removeItem('admin_bypass');
    if (!authClient) throw new Error('Authentication service is not initialized.');
    return authClient.signInWithPopup(authClient.auth, new authClient.GoogleAuthProvider());
  };

  const logout = async () => {
    localStorage.removeItem('admin_bypass');
    if (authClient) await authClient.signOut(authClient.auth);
    setUser(null);
    setIsAdmin(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, authReady: needsAuth && authInitialized, authError, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
