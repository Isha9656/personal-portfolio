import React, { useRef, useState } from 'react';

const CloudinaryUploader = ({ onUploadSuccess, accept = "image/*", multiple = false, buttonText = "Upload Image" }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!cloudName || !uploadPreset) {
      setMessage("Error: Cloudinary config missing in .env");
      return;
    }

    setUploading(true);
    setMessage('');
    setProgress(0);

    const uploadedUrls = [];
    const totalFiles = files.length;

    try {
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        // Using auto allows both images and PDFs to be handled
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          uploadedUrls.push(data.secure_url);
        } else {
          console.error('Cloudinary upload error:', data);
          throw new Error(data.error?.message || 'Upload failed');
        }

        setProgress(Math.round(((i + 1) / totalFiles) * 100));
      }

      if (multiple) {
        onUploadSuccess(uploadedUrls);
      } else {
        onUploadSuccess(uploadedUrls[0]);
      }
      
      setMessage('Upload successful!');
      setTimeout(() => setMessage(''), 3000); // clear success message after 3s
    } catch (error) {
      setMessage(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: uploading ? 'not-allowed' : 'pointer',
    opacity: uploading ? 0.7 : 1,
    whiteSpace: 'nowrap'
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        {uploading ? `Uploading... ${progress}%` : buttonText}
      </button>
      {message && (
        <span style={{ fontSize: '12px', color: message.includes('failed') || message.includes('Error') ? 'red' : 'green' }}>
          {message}
        </span>
      )}
    </div>
  );
};

export default CloudinaryUploader;
