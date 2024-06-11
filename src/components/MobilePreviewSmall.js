import React, { useEffect } from 'react';
import styles from '@/styles/mobilePreviewSmall.module.scss';

const MobilePreviewSmall = ({ linkPageUrl, isPreviewSmall, setIsPreviewSmall }) => {
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

  const handleTogglePreview = () => {
    setIsPreviewSmall(prevState => !prevState);
  };

  return (
    <div className={styles.containerMobilePreviewSmall}>
        <div className={styles.buttonsContainer}>
            <div onClick={handleShareLink} className={styles.shareButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                    <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
                </svg>
                <p>Share</p>
            </div>
            <div onClick={handleTogglePreview} className={styles.closeButton}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
              </svg>
                <p>Close Preview</p>
            </div>
        </div>

      <div className={styles.mobileMockup}>
        <iframe id="preview-iframe" className={styles.iframeContainer} src={linkPageUrl}></iframe>
      </div>
    </div>
  );
};

export default MobilePreviewSmall;
