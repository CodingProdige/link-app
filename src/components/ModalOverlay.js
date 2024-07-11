"use client";
import React, { useState, useEffect } from 'react';
import styles from '@/styles/modalOverlay.module.scss';
import { hasUsernameField, isUsernameTaken, updateUsername, fetchUserData, updateUserTheme, updateUserTitle } from '@/utils/firebaseUtils';
import { useAuth } from '@/firebase/auth';
import { PrismicNextImage } from "@prismicio/next";
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import ThemeSelector from '@/components/ThemeSelector'; // Adjust the import path if necessary

const ModalOverlay = ({ settings, onUsernameUpdate }) => {
  const [username, setUsername] = useState('');
  const [usernameExists, setUsernameExists] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [suggestedUsernames, setSuggestedUsernames] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [theme, setTheme] = useState(null);
  const [continueLoading, setContinueLoading] = useState(false);

  useEffect(() => {
    const checkUsername = async () => {
      if (user && user.uid) {
        const exists = await hasUsernameField(user.uid);
        setUsernameExists(exists);
        if (!exists) {
          setModalVisible(true); // Show the modal if username does not exist
        }
      }
    };

    const getUserData = async () => {
      if (user) {
        try {
          const data = await fetchUserData(user.uid);
          setUserData(data);
          setTheme(data.theme);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    if (user) {
      checkUsername();
      getUserData();
    }
  }, [user]);

  const validateUsername = (username) => {
    // Updated regex to include only URL-safe characters and exclude spaces
    const validUsernameRegex = /^[a-zA-Z0-9-_]+$/;
    return validUsernameRegex.test(username);
  };

  const handleUsernameChange = async (e) => {
    const newUsername = e.target.value.toLowerCase().replace(/\s+/g, ''); // Remove spaces
    setUsername(newUsername);

    // Validate the username
    if (!validateUsername(newUsername)) {
      setUsernameError('Username contains invalid characters. Only letters, numbers, dashes, and underscores are allowed.');
      setIsUsernameValid(false);
      setSuggestedUsernames([]);
      return;
    }

    if (newUsername) {
      try {
        const isTaken = await isUsernameTaken(newUsername);
        if (isTaken) {
          setUsernameError('Username is already in use');
          setIsUsernameValid(false);
          suggestAlternativeUsernames(newUsername);
        } else {
          setUsernameError('');
          setIsUsernameValid(true);
          setSuggestedUsernames([]);
        }
      } catch (error) {
        setUsernameError('Error checking username');
        setIsUsernameValid(false);
      }
    } else {
      setUsernameError('');
      setIsUsernameValid(false);
      setSuggestedUsernames([]);
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
        setContinueLoading(true);
        await updateUsername(user.uid, username);
        await updateUserTheme(user.uid, theme);
        await updateUserTitle(user.uid, username);

        onUsernameUpdate(username);
        setModalVisible(false); // Hide the modal on successful username update
        router.reload(); // Reload the page to reflect the new username
      } catch (error) {
        setUsernameError('Error updating username');
      } finally {
        setContinueLoading(false);
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
    return <Loading />;
  }

  return (
    <>
      {!usernameExists && (
        <div className={styles.overlay}>
          <div className={styles.logoContainer}>
            <PrismicNextImage field={settings.data.logo} />
          </div>
          <div className={styles.modal}>
            <div className={styles.logoContainerSmallScreen}>
              <PrismicNextImage field={settings.data.logo} />
            </div>
            <div className={styles.usernameSelectorContainer}>
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
            </div>

            <div className={styles.themeSelectContainer}>
              <div className={styles.titleText}>
                <h2>Choose a theme</h2>
                <p>Choose a theme to get started. You can always change it later.</p>
              </div>
              <ThemeSelector
                user={user}
                userData={userData}
                theme={theme}
                setTheme={setTheme}
                linkPageUrl={`${window.location.origin}/user/${userData?.username}`}
              />
            </div>

            <button disabled={!isUsernameValid || !theme} onClick={handleContinueClick}>
              {continueLoading ? 'Finalizing...' : 'Continue'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalOverlay;
