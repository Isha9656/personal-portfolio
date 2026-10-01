import React, { useRef, useState } from 'react';

/**
 * File uploader component.
 * Cloudinary is used for uploads so this project can stay on Firebase Spark.
 *
 * Base64 data URLs are intentionally NOT used — they bloat Firestore documents
 * and cause the 1MB document size limit to be hit with just a few images.
 */
const CloudinaryUploader = ({ onUploadSuccess, accept = "image/*", multiple = false, buttonText = "Upload Image" }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  /**
   * Upload a single file to Cloudinary.
   */
  const uploadToCloudinary = async (file, fileIndex, totalFiles) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Cloudinary upload failed');
    }

    setProgress(Math.round(((fileIndex + 1) / totalFiles) * 100));
    return data.secure_url;
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const oversizedFile = [...files].find((file) => file.size > 15 * 1024 * 1024);
    if (oversizedFile) {
      setMessage(`${oversizedFile.name} is larger than the 15 MB upload limit.`);
      e.target.value = '';
      return;
    }

    if (!cloudName || !uploadPreset) {
      setMessage('Cloudinary is not configured yet. Add its cloud name and unsigned preset to the app environment before uploading.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    setMessage('');
    setProgress(5);

    const uploadedUrls = [];
    const uploadedFiles = [];
    const totalFiles = files.length;
    try {
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        let url = null;

        url = await uploadToCloudinary(file, i, totalFiles);
        uploadedUrls.push(url);
        uploadedFiles.push({ name: file.name, type: file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : '') });
      }

      if (multiple) {
        onUploadSuccess(uploadedUrls, uploadedFiles);
      } else {
        onUploadSuccess(uploadedUrls[0], uploadedFiles[0]);
      }

      setMessage('✓ Uploaded successfully. Save the portfolio section to publish it.');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(`Upload failed: ${error.message || 'Unknown error'}`);
      setTimeout(() => setMessage(''), 8000);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: uploading ? 'not-allowed' : 'pointer',
    opacity: uploading ? 0.7 : 1,
    whiteSpace: 'nowrap',
    fontFamily: 'Inter, sans-serif',
    fontWeight: '500',
    fontSize: '13px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
      />
      <button
        type="button"
        style={buttonStyle}
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        {uploading ? `Uploading... ${progress}%` : buttonText}
      </button>
      {message && (
        <span style={{
          fontSize: '12px',
          color: message.startsWith('✓') ? '#34d399' : '#f87171',
          fontWeight: '500',
          maxWidth: '300px',
          lineHeight: 1.3,
        }}>
          {message}
        </span>
      )}
    </div>
  );
};

export default CloudinaryUploader;

