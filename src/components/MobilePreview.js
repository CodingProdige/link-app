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

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(linkPageUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy the link: ', err);
    }
  };

  return (
    <div className={styles.containerMobilePreview}>
        <div className={styles.buttonsContainer}>
            <div onClick={handleShareLink} className={styles.shareButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                    <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
                </svg>
                <p>Share</p>
            </div>
        </div>

      <div className={styles.mobileMockup}>
        <iframe id="preview-iframe" className={styles.iframeContainer} src={linkPageUrl}></iframe>
      </div>
    </div>
  );
};

export default MobilePreview;
