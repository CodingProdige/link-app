import { useState } from 'react';
import styles from '@/styles/addLinkForm.module.scss';
import { addLinkToFirestore } from '@/utils/firebaseUtils';

export default function AddLinkForm({ toggleAddLink }) {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Sanitize link input
    const urlPattern = new RegExp(
      'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
    );

    if (!urlPattern.test(link)) {
      setError('Invalid URL format');
      return;
    }

    try {
      await addLinkToFirestore({ title, link });
      toggleAddLink();
    } catch (error) {
      console.error('Error adding link: ', error);
      setError('Failed to add link. Please try again.');
    }
  };

  return (
    <div className={styles.addLinkFormContainer}>
      <div className={styles.addLinkHeader}>
        <h3>Add Link</h3>
        <svg onClick={toggleAddLink} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
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
        <button type="submit" disabled={!title || !link } >Save</button>
      </form>
    </div>
  );
}
