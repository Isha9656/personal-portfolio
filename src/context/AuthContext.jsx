import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/firebase';
import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      if (!auth) { setLoading(false); return; }

      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setLoading(true);
        setAuthError('');
        try {
          if (currentUser) {
            const allowedEmail = import.meta.env.VITE_ADMIN_EMAIL;
            if (!allowedEmail) {
              setAuthError('Config error: VITE_ADMIN_EMAIL is not set. Restart the dev server.');
              setIsAdmin(false);
              setLoading(false);
              return;
            }
            const allowedEmails = allowedEmail.split(',').map(e => e.trim().toLowerCase());
            const userEmail = currentUser.email?.trim().toLowerCase();
            
            if (allowedEmails.includes(userEmail)) {
              setUser(currentUser);
              setIsAdmin(true);
            } else {
              setAuthError(`Access denied. "${currentUser.email}" is not an authorized admin account.`);
              setIsAdmin(false);
              setUser(null);
              await signOut(auth); // immediately sign out unauthorized users
            }
          } else {
            setUser(null);
            setIsAdmin(false);
          }
        } catch (err) {
          console.error('Auth state error:', err);
        } finally {
          setLoading(false);
        }
      });
    } catch (err) {
      console.warn('Firebase Auth setup failed:', err);
      setLoading(false);
    }
    return () => typeof unsubscribe === 'function' && unsubscribe();
  }, []);

  const loginWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, authError, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
