import React, { useEffect } from 'react';
import styles from '@/styles/mobilePreview.module.scss';

const MobilePreview = ({ linkPageUrl }) => {
  const updatePreview = () => {
    const iframe = document.getElementById('preview-iframe');
    iframe.src = iframe.src; // Reload iframe to reflect changes
  };

  useEffect(() => {
    // Example: Listen for changes to update the preview
    document.addEventListener('change', updatePreview);
    return () => {
      document.removeEventListener('change', updatePreview);
    };
  }, []);

  return (
    <div className={styles.container}>
        <div className={styles.mobileMockup}>
        <iframe id="preview-iframe" className={styles.iframeContainer} src={linkPageUrl}></iframe>
        </div>
    </div>
  );
};

export default MobilePreview;
