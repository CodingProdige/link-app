"use client";
import { useState, useEffect } from 'react';
import { FormEvent } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import styles from '@/styles/signin.module.scss';
import { FaGoogle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { fetchSettingsAndNavigation } from '@/lib/prismicClient';
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import Link from 'next/link';


async function handleSignIn(email: string, password: string, setError: (message: string) => void) {
  try {
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Call the generate-token API with the UID to get a custom token
    const response = await fetch('/api/generate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid: user.uid })
    });

    if (response.ok) {
      const { customToken } = await response.json();

      // Save the custom token as a cookie
      document.cookie = `token=${customToken}; Path=/;`;

      // Redirect to the dashboard
      window.location.href = '/dashboard';
    } else {
      const error = await response.json();
      setError('Error generating token: ' + error.error);
      console.error('Error generating token:', error.error);
    }
  } catch (error) {
    setError('Error signing in: ' + error.message);
    console.error('Error signing in:', error);
  }
}

async function handleGoogleSignIn(setError: (message: string) => void) {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Call the generate-token API with the UID to get a custom token
    const response = await fetch('/api/generate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid: user.uid })
    });

    if (response.ok) {
      const { customToken } = await response.json();

      // Save the custom token as a cookie
      document.cookie = `token=${customToken}; Path=/;`;

      // Redirect to the dashboard
      window.location.href = '/dashboard';
    } else {
      const error = await response.json();
      setError('Error generating token: ' + error.error);
      console.error('Error generating token:', error.error);
    }
  } catch (error) {
    setError('Error signing in with Google: ' + error.message);
    console.error('Error signing in with Google:', error);
  }
}

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [data, setData] = useState({ settings: null, navigation: null, page: null });

  useEffect(() => {
    async function fetchData() {
      const { settings, navigation, page } = await fetchSettingsAndNavigation();
      setData({ settings, navigation, page });
    }

    fetchData();
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    handleSignIn(email, password, setError);
  };
  

  return (
    <div className={styles.loginPage}>
      <div className={styles.imageContainer}>
        {
          data.navigation && data.navigation.data && data.settings.data && (
            <PrismicNextImage field={data.settings.data.signin_hero_image} />
          )
        }
      </div>
      <div className={styles.formContainer}>
        {
          data.navigation && data.navigation.data && data.settings.data && (
            <Link href="/">
              <div className={styles.logoContainer}>
                <PrismicNextImage field={data.settings.data.logo} />
              </div>
            </Link>
          )
        }
        <form onSubmit={onSubmit}>
          <div className={styles.formHeader}>
            <h3>Welcome back!</h3>
            <p>Signin to your Fanslink dashboard!</p>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputContainer}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className={error ? styles.inputError : ''}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className={error ? styles.inputError : ''}
            />
            <button type="submit">Sign In</button>
          </div>
          <p className={styles.signupOr}>Or</p>
          <div className={styles.socialLogin}>
            <button onClick={() => handleGoogleSignIn(setError)}>
              <FcGoogle />
              Sign in with Google
            </button>
          </div>
          <div className={styles.redirectContainer}>
            <p>Dont have an account? <Link href={"/signup"}>Signup</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
