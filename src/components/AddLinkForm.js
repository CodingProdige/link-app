import { useState } from 'react';
import styles from '@/styles/addLinkForm.module.scss';
import { addLinkToFirestore, validateUrl } from '@/utils/firebaseUtils';

const downloadAndUploadImage = async (userId, imageUrl) => {
  try {
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, userId }),
    });
    const data = await res.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image.');
  }
};

export default function AddLinkForm({ toggleAddLink, setItems, userId, setAddLinkActive }) {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [urlMetaData, setUrlMetaData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateUrl(link)) {
      setError('Invalid URL format');
      return;
    }
    try {
      setLoading(true);
      const updatedItems = await addLinkToFirestore({ title, link, userId, urlMetaData });
      setItems(updatedItems);
      toggleAddLink();
    } catch (error) {
      setError(error.message);
    } finally {
      setTitle('');
      setLink('');
      setLoading(false);
    }
  };

  const handleFetchMetadata = async (e) => {
    e.preventDefault();
    if (!validateUrl(url)) {
      setError('Invalid URL format');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/media-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      console.log(data.mediaType);
  
      // Validate and sanitize metadata
      const sanitizedMetadata = {};
      for (const key in data.metadata) {
        if (data.metadata[key] !== undefined) {
          sanitizedMetadata[key] = data.metadata[key];
        }
      }
  
      if (sanitizedMetadata["og:image"]) {
        const imageUrl = sanitizedMetadata["og:image"];
        const uploadedImageUrl = await downloadAndUploadImage(userId, imageUrl);
        sanitizedMetadata["og:image"] = uploadedImageUrl;
      } else {
        sanitizedMetadata["og:image"] = '';
      }
  
      const mediaType = data.mediaType || sanitizedMetadata["og:type"] || '';
  
      setUrlMetaData({
        mediaType: mediaType,
        metadata: sanitizedMetadata,
      });
      setTitle(sanitizedMetadata["og:title"]);
      setLink(url);
    } catch (error) {
      setError('Failed to fetch media type. Please try again.');
    } finally {
      setUrl('');
      setLoading(false);
    }
  };
  
  

  return (
    <div className={styles.addLinkFormContainer}>
      {!urlMetaData ? (
        <div className={styles.getMediaTypeForm}>
          <form className={styles.addLinkForm} onSubmit={handleFetchMetadata}>
            <input
              type="text"
              placeholder="Enter a URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" disabled={!url || loading}>
              {loading ? 'Scanning URL...' : 'Add'}
            </button>
            <button type="button" onClick={() => setAddLinkActive(false)}>
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <div className={styles.saveLinkForm}>
          <div className={styles.addLinkHeader}>
            <h3>Add Link</h3>
            <svg
              onClick={toggleAddLink}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-x-lg"
              viewBox="0 0 16 16"
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          </div>
          <form className={styles.addLinkForm} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={error ? styles.inputError : ''}
              required
            />
            <input
              type="text"
              placeholder="Link URL"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className={error ? styles.inputError : ''}
              required
            />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" disabled={!title || !link || loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
