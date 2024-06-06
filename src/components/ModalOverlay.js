"use client";
import React, { useState, useEffect } from 'react';
import styles from '@/styles/modalOverlay.module.scss';
import { hasUsernameField, isUsernameTaken, updateUsername } from '@/utils/firebaseUtils';
import { useAuth } from '@/firebase/auth';
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";

const ModalOverlay = ({ settings }) => {
  const [username, setUsername] = useState('');
  const [usernameExists, setUsernameExists] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [suggestedUsernames, setSuggestedUsernames] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkUsername = async () => {
      if (user && user.uid) {
        console.log('Checking if username exists for user:', user.uid);
        const exists = await hasUsernameField(user.uid);
        console.log('Username exists:', exists);
        setUsernameExists(exists);
      }
    };

    checkUsername();
  }, [user]);

  const handleUsernameChange = async (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    setSuggestedUsernames([]);
    if (newUsername) {
      try {
        console.log('Checking if username is taken:', newUsername);
        const isTaken = await isUsernameTaken(newUsername);
        console.log('Is username taken:', isTaken);
        if (isTaken) {
          setUsernameError('Username is already in use');
          setIsUsernameValid(false);
          suggestAlternativeUsernames(newUsername);
        } else {
          setUsernameError('');
          setIsUsernameValid(true);
        }
      } catch (error) {
        console.error('Error checking username:', error.message);
        setUsernameError('Error checking username');
        setIsUsernameValid(false);
      }
    } else {
      setUsernameError('');
      setIsUsernameValid(false);
    }
  };

  const suggestAlternativeUsernames = async (baseUsername) => {
    const suggestions = [];
    for (let i = 1; i <= 3; i++) {
      const suggestion = `${baseUsername}${i}`;
      if (!(await isUsernameTaken(suggestion))) {
        suggestions.push(suggestion);
      }
    }
    setSuggestedUsernames(suggestions);
  };

  const handleSuggestionClick = (suggestion) => {
    setUsername(suggestion);
    setUsernameError('');
    setIsUsernameValid(true);
    setSuggestedUsernames([]);
  };

  const handleContinueClick = async () => {
    if (user && user.uid && isUsernameValid) {
      try {
        await updateUsername(user.uid, username);
        console.log('Username updated successfully');
        setModalVisible(false); // Hide the modal on successful username update
      } catch (error) {
        console.error('Error updating username:', error.message);
      }
    }
  };

  const getInputClassNames = () => {
    if (usernameError) {
      return `${styles.input} ${styles.inputError}`;
    } else if (isUsernameValid) {
      return `${styles.input} ${styles.inputSuccess}`;
    } else {
      return styles.input;
    }
  };

  if (!modalVisible) {
    return null; // Hide the modal
  }

  if (loading) {
    return null;
  }

  return (
    <>
      {!usernameExists && (
        <div className={styles.overlay}>
          <div className={styles.logoContainer}>
            <PrismicNextImage field={settings.data.logo} />
          </div>
          <div className={styles.modal}>
            <div className={styles.titleText}>
              <h2>Choose a username</h2>
              <p>Choose a Fanslink URL for your new shareable link. You can always change it later.</p>
            </div>
            <div className={styles.inputContainer}>
              <span className={styles.baseUrl}>fansl.ink /</span>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Username"
                className={getInputClassNames()}
              />
            </div>
            {usernameError && <p className={styles.error}>{usernameError}</p>}
            {suggestedUsernames.length > 0 && (
              <div className={styles.nameSuggestions}>
                <p>Available:</p>
                <ul>
                  {suggestedUsernames.map((suggestion) => (
                    <li key={suggestion} onClick={() => handleSuggestionClick(suggestion)}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button disabled={!isUsernameValid} onClick={handleContinueClick}>Continue</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalOverlay;
