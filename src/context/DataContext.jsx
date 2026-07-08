import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import localData from '../Data.json';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let fetched = null;
      try {
        const docRef = doc(db, 'portfolio', 'main');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          fetched = docSnap.data();
        } else {
          console.warn("No portfolio data found in Firestore (portfolio/main is empty). Falling back to local Data.json.");
          fetched = localData;
        }
      } catch (err) {
        console.warn("Firestore data fetch failed, using local Data.json fallback:", err);
        fetched = localData;
      }

      if (fetched) {
        // Ensure all required sections exist, falling back to localData for missing keys
        fetched.heroData = fetched.heroData || localData.heroData;
        fetched.aboutData = fetched.aboutData || localData.aboutData;
        fetched.skillData = fetched.skillData || localData.skillData || { skills: [] };
        fetched.resumeData = fetched.resumeData || localData.resumeData || { education: [], experience: [] };
        fetched.certificates = fetched.certificates || localData.certificates || [];
        fetched.projects = fetched.projects || localData.projects || [];
        fetched.events = fetched.events || localData.events || [];
        fetched.contactData = fetched.contactData || localData.contactData;
        fetched.socialData = fetched.socialData || localData.socialData;

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

  const updateData = async (newData) => {
    try {
      await setDoc(doc(db, 'portfolio', 'main'), newData, { merge: true });
      setData(newData);
    } catch (err) {
      console.error('Error updating data:', err);
      throw err;
    }
  };

  // Granular save — only overwrites one top-level key (e.g. 'heroData', 'projects')
  const updateSection = async (sectionKey, sectionData) => {
    try {
      await setDoc(doc(db, 'portfolio', 'main'), { [sectionKey]: sectionData }, { merge: true });
      setData(prev => ({ ...prev, [sectionKey]: sectionData }));
    } catch (err) {
      console.error(`Error updating section "${sectionKey}":`, err);
      throw err;
    }
  };

  const value = { data, loading, error, updateData, updateSection };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
