"use client";
import { useState, useEffect } from 'react';
import { FormEvent } from 'react';
import { auth, db } from '@/firebase/firebase'; // Import the db object
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import styles from '@/styles/signup.module.scss';
import { FaGoogle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { fetchSettingsAndNavigation } from '@/lib/prismicClient';
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import Link from 'next/link';
import { IMAGES } from '@/lib/images'; // Import the IMAGES object

function getRandomHumanImage() {
  const humanImages = Object.values(IMAGES.PROFILE.HUMANS);
  const randomIndex = Math.floor(Math.random() * humanImages.length);
  return humanImages[randomIndex];
}

async function handleEmailSignUp(email: string, password: any, setError: (message: string) => void) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create a new user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || getRandomHumanImage(),
      createdAt: new Date(),
      userName: '',
    });

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
    setError('Error signing up: ' + error.message);
    console.error('Error signing up:', error);
  }
}

async function handleGoogleSignUp(setError: (message: string) => void) {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Create a new user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || getRandomHumanImage(),
      createdAt: new Date(),
      userName: '',
    });

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
    setError('Error signing up with Google: ' + error.message);
    console.error('Error signing up with Google:', error);
  }
}

export default function SignUpPage() {
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
    handleEmailSignUp(email, password, setError);
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.imageContainer}>
        {
          data.navigation && data.navigation.data && data.settings.data && (
            <PrismicNextImage field={data.settings.data.signup_hero_image} />
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
            <h3>Join Fanslink</h3>
            <p>Signup free, Fanslink is the ultimate link-in-bio platform.</p>
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
            <button type="submit">Create account</button>
          </div>
          <p className={styles.signupOr}>Or</p>
          <div className={styles.socialLogin}>
            <button onClick={() => handleGoogleSignUp(setError)}>
              <FcGoogle />
              Sign Up with Google
            </button>
          </div>
          <div className={styles.redirectContainer}>
            <p>Already have an account? <Link href={"/signin"}>Signin</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
