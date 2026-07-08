import { useState, useEffect } from 'react';
import { useData } from '../../../context/DataContext';

/**
 * Shared hook for admin sections.
 * Handles local form state, save/error status, and calling updateSection.
 *
 * @param {string} sectionKey  Top-level key in the Firestore portfolio/main doc
 * @param {function} [selector] Optional — extract a nested value from `data`
 */
export const useAdminSection = (sectionKey, selector) => {
  const { data, updateSection } = useData();
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    if (data) {
      const value = selector ? selector(data) : data[sectionKey];
      setFormData(value ?? null);
    }
  }, [data, sectionKey]);

  const save = async (override) => {
    setSaving(true);
    setSaveStatus(null);
    try {
      await updateSection(sectionKey, override !== undefined ? override : formData);
      setSaveStatus('success');
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 3500);
    }
  };

  return { formData, setFormData, saving, saveStatus, save };
};
