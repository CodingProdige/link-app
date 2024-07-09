"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/auth';
import { usePrismic } from '@/context/PrismicContext';
import { hasUsernameField, isUsernameTaken, updateUsername, fetchUserData, updateUserProfilePicture, resetPassword } from '@/utils/firebaseUtils';
import Loading from '@/components/Loading';
import { PrismicNextImage } from "@prismicio/next";
import Image from 'next/image';
import styles from '@/styles/dashboardAccount.module.scss';

export default function Account() {
  const { user, loading: authLoading } = useAuth();
  const { settings, loading: prismicLoading } = usePrismic();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [initialUsername, setInitialUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [suggestedUsernames, setSuggestedUsernames] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.uid) {
        const data = await fetchUserData(user.uid);
        setUserData(data);
        setUsername(data?.username || '');
        setInitialUsername(data?.username || '');
      }
    };

    fetchData();
  }, [user]);

  const validateUsername = (username) => {
    // Updated regex to include only URL-safe characters
    const validUsernameRegex = /^[a-zA-Z0-9-_]+$/;
    return validUsernameRegex.test(username);
  };

  const handleUsernameChange = async (e) => {
    const newUsername = e.target.value.toLowerCase();
    setUsername(newUsername);

    if (newUsername === initialUsername.toLowerCase()) {
      setUsernameError('');
      setIsUsernameValid(false);
      setSuggestedUsernames([]);
      return;
    }

    if (!validateUsername(newUsername)) {
      setUsernameError('Username contains invalid characters. Only letters, numbers, dashes, and underscores are allowed.');
      setIsUsernameValid(false);
      setSuggestedUsernames([]);
      return;
    }

    setSuggestedUsernames([]);
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

  const handleSaveClick = async () => {
    if (user && user.uid && isUsernameValid && username !== initialUsername.toLowerCase()) {
      try {
        await updateUsername(user.uid, username);
        setInitialUsername(username);
        window.location.reload();
      } catch (error) {
        setUsernameError('Error updating username');
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

  const handleResetPassword = async () => {
    if (user && user.email) {
      try {
        await resetPassword(user.email);
        alert('Password reset email sent!');
      } catch (error) {
        alert('Error sending password reset email');
      }
    }
  };

  if (authLoading || prismicLoading) {
    return <Loading />;
  }

  const isDataChanged = username !== initialUsername.toLowerCase();

  return (
    <div className={styles.accountPage}>
        <h4>Account</h4>
      <div className={styles.accountUsernameContainer}>
        <div className={styles.accountUsernameInnerContainer}>
          <div className={styles.field}>
            <label htmlFor="username">Username</label>
            <div className={styles.inputContainer}>
              <span className={styles.baseUrl}>fansl.ink /</span>
              <input
                type="text"
                id="username"
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
          {isDataChanged && (
            <button disabled={!isUsernameValid} onClick={handleSaveClick}>
              Save
            </button>
          )}
        </div>
      </div>
      <div className={styles.accountProfileContainer}>
        <div className={styles.emailContainer}>
          <label>Email</label>
          <p>{user?.email}</p>
          <p className={styles.resetPassword} onClick={handleResetPassword}>Reset Password</p>
        </div>
      </div>
    </div>
  );
}
