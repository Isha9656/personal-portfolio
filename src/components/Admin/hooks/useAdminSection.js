import { useState, useEffect, useRef, useCallback } from 'react';
import { useData } from '../../../context/DataContext';

const sanitizeData = (val) => {
  if (val === undefined) return null;
  if (val === null) return null;
  if (Array.isArray(val)) {
    return val.map(sanitizeData);
  }
  if (typeof val === 'object') {
    const res = {};
    for (const key in val) {
      res[key] = sanitizeData(val[key]);
    }
    return res;
  }
  // Safeguard against Firestore 1MB document size limit:
  // If a field contains a huge base64 Data URL (>50KB), sanitize it to avoid setDoc failure.
  if (typeof val === 'string' && val.startsWith('data:') && val.length > 50000) {
    throw new Error('The selected file did not finish uploading. Upload it to cloud storage, then save the resulting URL.');
  }
  return val;
};

/**
 * Shared hook for admin sections.
 * Handles local form state, save/error status, and calling updateSection.
 *
 * Key fix: tracks a "dirty" flag so saves don't overwrite in-progress form edits.
 * After a successful save the context data updates, but we skip re-syncing
 * because the user's local edits ARE the source of truth until they navigate away.
 *
 * @param {string} sectionKey  Top-level key in the Firestore portfolio/main doc
 * @param {function} [selector] Optional — extract a nested value from `data`
 */
export const useAdminSection = (sectionKey, selector) => {
  const { data, updateSection } = useData();
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [saveError, setSaveError] = useState('');

  // Track whether the user has made local edits (dirty) or we just saved.
  const dirtyRef = useRef(false);
  const justSavedRef = useRef(false);
  const initializedRef = useRef(false);

  // Wrap setFormData so it also marks the form as dirty
  const setFormDataWrapped = useCallback((valueOrFn) => {
    dirtyRef.current = true;
    setFormData(valueOrFn);
  }, []);

  // Sync from context → local form state ONLY on initial load or when the
  // sectionKey changes. Skip if user has dirty edits or we just saved.
  useEffect(() => {
    if (!data) return;

    // If we just saved, context data will update — don't overwrite local state
    if (justSavedRef.current) {
      justSavedRef.current = false;
      return;
    }

    // If user has dirty edits, don't overwrite
    if (dirtyRef.current && initializedRef.current) {
      return;
    }

    const value = selector ? selector(data) : data[sectionKey];
    // Deep clone to avoid mutating context data
    const cloned = value != null ? JSON.parse(JSON.stringify(value)) : null;
    setFormData(cloned);
    initializedRef.current = true;
  }, [data, sectionKey]); // selector intentionally excluded — it's stable per component

  const save = async (override) => {
    setSaving(true);
    setSaveStatus(null);
    setSaveError('');
    try {
      const rawData = override !== undefined ? override : formData;
      const sanitized = sanitizeData(rawData);
      justSavedRef.current = true;   // prevent useEffect from overwriting after save
      dirtyRef.current = false;       // reset dirty flag
      await updateSection(sectionKey, sanitized);
      setSaveStatus('success');
    } catch (err) {
      console.error("Firestore save failed:", err);
      justSavedRef.current = false;
      setSaveStatus('error');
      setSaveError(err?.message || 'Could not save. Check Firebase configuration and security rules.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 3500);
    }
  };

  // Allow sections to explicitly reload from context (e.g. after navigation)
  const reload = useCallback(() => {
    if (!data) return;
    const value = selector ? selector(data) : data[sectionKey];
    const cloned = value != null ? JSON.parse(JSON.stringify(value)) : null;
    setFormData(cloned);
    dirtyRef.current = false;
    justSavedRef.current = false;
  }, [data, sectionKey]);

  return { formData, setFormData: setFormDataWrapped, saving, saveStatus, saveError, save, reload };
};
