import React, { createContext, useContext, useEffect, useState } from 'react';
import localData from '../Data.json';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('loading'); // 'firestore' | 'local' | 'loading'

  useEffect(() => {
    const fetchData = async () => {
      setData(localData);
      setDataSource('local');
      setLoading(false);
      let fetched = null;
      try {
        const { db } = await import('../firebase/publicData');
        if (!db) {
          console.warn("Firestore not initialized. Using local Data.json fallback.");
          fetched = structuredClone(localData);
          setDataSource('local');
        } else {
          const { doc, getDoc } = await import('firebase/firestore');
          const docRef = doc(db, 'portfolio', 'main');
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            fetched = docSnap.data();
            setDataSource('firestore');
          } else {
            console.warn("No portfolio data found in Firestore (portfolio/main is empty). Falling back to local Data.json.");
            fetched = structuredClone(localData);
            setDataSource('local');
          }
        }
      } catch (err) {
        console.warn("Firestore data fetch failed, using local Data.json fallback:", err);
        fetched = structuredClone(localData);
        setDataSource('local');
      }

      if (fetched) {
        // Firestore is the CMS source of truth when a section exists there.
        // Use the bundled JSON only to fill sections that have never been saved.
        fetched = { ...structuredClone(localData), ...fetched };
        fetched.heroData = { ...localData.heroData, ...(fetched.heroData || {}) };
        fetched.aboutData = { ...localData.aboutData, ...(fetched.aboutData || {}) };
        fetched.skillData = { ...localData.skillData, ...(fetched.skillData || {}) };
        if (fetched.aboutData.text?.startsWith('Machine Learning and Deep Learning enthusiast')) {
          fetched.aboutData.text = localData.aboutData.text;
        }
        if (fetched.aboutData.title === "Hi There! I'm Isha Kakadiya") {
          fetched.aboutData.title = localData.aboutData.title;
          fetched.aboutData.subtitle = localData.aboutData.subtitle;
        }
        if (fetched.skillData.text?.startsWith('Extensive hands-on expertise')) {
          fetched.skillData.title = localData.skillData.title;
          fetched.skillData.text = localData.skillData.text;
        }
        if (fetched.aboutData.cvPdf === '/images/Resume.pdf') {
          fetched.aboutData.cvPdf = localData.aboutData.cvPdf;
        }
        fetched.resumeData = {
          ...(localData.resumeData || { education: [], experience: [] }),
          ...(fetched.resumeData || {}),
        };
        fetched.certificates = fetched.certificates || localData.certificates || [];
        fetched.projects = fetched.projects || localData.projects || [];
        fetched.events = fetched.events || localData.events || [];
        fetched.contactData = { ...localData.contactData, ...(fetched.contactData || {}) };
        fetched.socialData = Array.isArray(fetched.socialData)
          ? fetched.socialData
          : structuredClone(localData.socialData || []);

        // Sort projects by featured items first
        const sortByFeatured = (a, b) => (b.featured === true ? 1 : 0) - (a.featured === true ? 1 : 0);
        if (Array.isArray(fetched.projects)) {
          fetched.projects.sort(sortByFeatured);
        }

        // Sort certificates by featured first, then by displayOrder ascending
        if (Array.isArray(fetched.certificates)) {
          fetched.certificates.sort((a, b) => {
            const aFeatured = a.featured === true ? 1 : 0;
            const bFeatured = b.featured === true ? 1 : 0;
            if (aFeatured !== bFeatured) {
              return bFeatured - aFeatured;
            }
            const aOrder = a.displayOrder !== undefined && a.displayOrder !== null && a.displayOrder !== '' ? Number(a.displayOrder) : 999999;
            const bOrder = b.displayOrder !== undefined && b.displayOrder !== null && b.displayOrder !== '' ? Number(b.displayOrder) : 999999;
            if (aOrder !== bOrder) {
              return aOrder - bOrder;
            }
            // Fallback to newest date
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            if (!isNaN(dateA) && !isNaN(dateB)) {
              return dateB - dateA;
            }
            return 0;
          });
        }

        setData(fetched);
      } else {
        setError(new Error("Failed to load portfolio data (both Firestore and local fallback failed)"));
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const cleanPayload = (val) => {
    if (val === undefined || val === null) return null;
    if (Array.isArray(val)) return val.map(cleanPayload);
    if (typeof val === 'object') {
      const res = {};
      for (const key in val) {
        res[key] = cleanPayload(val[key]);
      }
      return res;
    }
    if (typeof val === 'string' && val.startsWith('data:') && val.length > 50000) {
      throw new Error('This file is too large to store in the portfolio record. Upload it to Firebase Storage or Cloudinary and save its URL.');
    }
    return val;
  };

  const updateData = async (newData) => {
    const [{ db }, { doc, setDoc }] = await Promise.all([
      import('../firebase/publicData'),
      import('firebase/firestore'),
    ]);
    if (!db) {
      throw new Error("Cannot save: Firebase Firestore is not initialized. Check your .env configuration and restart the dev server.");
    }
    try {
      const sanitized = cleanPayload(newData);
      await setDoc(doc(db, 'portfolio', 'main'), sanitized, { merge: true });
      setData((previous) => ({ ...previous, ...sanitized }));
      setDataSource('firestore');
    } catch (err) {
      console.error('Error updating data:', err);
      throw err;
    }
  };

  // Granular save — only overwrites one top-level key (e.g. 'heroData', 'projects')
  const updateSection = async (sectionKey, sectionData) => {
    const [{ db }, { doc, setDoc }] = await Promise.all([
      import('../firebase/publicData'),
      import('firebase/firestore'),
    ]);
    if (!db) {
      throw new Error("Cannot save: Firebase Firestore is not initialized. Check your .env configuration and restart the dev server.");
    }
    try {
      const sanitizedSection = cleanPayload(sectionData);
      await setDoc(doc(db, 'portfolio', 'main'), { [sectionKey]: sanitizedSection }, { merge: true });
      setData(prev => ({ ...prev, [sectionKey]: sanitizedSection }));
      setDataSource('firestore');
    } catch (err) {
      console.error(`Error updating section "${sectionKey}":`, err);
      throw err;
    }
  };

  const value = { data, loading, error, dataSource, updateData, updateSection };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
