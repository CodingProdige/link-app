"use client";
import { useState, useEffect, FormEvent } from 'react';
import { auth, db } from '@/firebase/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import styles from '@/styles/signup.module.scss';
import { FcGoogle } from "react-icons/fc";
import { fetchSettingsAndNavigation } from '@/lib/prismicClient';
import { PrismicNextImage } from "@prismicio/next";
import Link from 'next/link';
import { IMAGES } from '@/lib/images';
import { fetchUserData } from '@/utils/firebaseUtils';

function getRandomHumanImage() {
  const humanImages = Object.values(IMAGES.PROFILE.HUMANS);
  const randomIndex = Math.floor(Math.random() * humanImages.length);
  return humanImages[randomIndex];
}

async function sendEmail(to, subject, template, templateData) {
  const response = await fetch('/api/sendEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ishtml: "true",
      to,
      subject,
      template,
      templateData
    })
  });

  if (!response.ok) {
    console.error('Failed to send email');
  }
}

async function handleEmailSignUp(email, password, setError, setLoading) {
  try {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoUrl: user.photoURL || getRandomHumanImage(),
      createdAt: new Date(),
      username: '',
      title: '',
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    // Send welcome email to user
    await sendEmail(user.email, 'Welcome to Fanslink!', 'welcome', { name: user.displayName || user.email || 'User' });

    // Send new user notification to admin
    await sendEmail('admin@example.com', 'New User Joined Fanslink!', 'newUserNotification', { name: user.displayName || 'User', email: user.email });

    // Generate a custom token and redirect to dashboard
    const response = await fetch('/api/generate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid: user.uid })
    });

    if (response.ok) {
      const { customToken } = await response.json();
      document.cookie = `token=${customToken}; Path=/;`;
      window.location.href = '/dashboard';
    } else {
      const error = await response.json();
      console.error('Error generating token:', error.error);
    }
  } catch (error) {
    setError('Error signing up: ' + error.message);
    console.error('Error signing up:', error);
  } finally {
    setLoading(false);
  }
}

async function handleGoogleSignUp(setError, setLoading) {
  try {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoUrl: user.photoURL || getRandomHumanImage(),
      createdAt: new Date(),
      username: '',
      title: '',
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    // Send welcome email to user
    await sendEmail(user.email, 'Welcome to Fanslink!', 'welcome', { name: user.displayName || user.email || 'User' });

    // Send new user notification to admin
    await sendEmail('dillonjurgens@gmail.com', 'New User Joined Fanslink!', 'newUserNotification', { name: user.displayName || 'User', email: user.email });

    const response = await fetch('/api/generate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid: user.uid })
    });

    if (response.ok) {
      const { customToken } = await response.json();
      document.cookie = `token=${customToken}; Path=/;`;
      window.location.href = '/dashboard';
    } else {
      const error = await response.json();
      setError('Error generating token: ' + error.error);
      console.error('Error generating token:', error.error);
    }
  } catch (error) {
    setError('Error signing up with Google: ' + error.message);
    console.error('Error signing up with Google:', error);
  } finally {
    setLoading(false);
  }
}

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    handleEmailSignUp(email, password, setError, setLoading);
  };

  return (
    <div className={styles.registerPage}>
      <head>
        <title>Sign Up for FansLink - Join Influencers & Content Creators</title>
        <meta name="description" content="Sign up for FansLink today and streamline your social media presence. Perfect for influencers and content creators looking to manage their links effectively." />
        <meta name="title" content="FansLink Sign Up - Join Influencers & Creators" />
      </head>
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
            <button type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
          <p className={styles.signupOr}>Or</p>
          <div className={styles.socialLogin}>
            <button onClick={() => handleGoogleSignUp(setError, setLoading)} disabled={loading}>
              {loading ? 'Signing Up...' : (
                <>
                  <FcGoogle />
                  Sign Up with Google
                </>
              )}
            </button>
          </div>
          <div className={styles.redirectContainer}>
            <p>Already have an account? <Link href="/signin">Signin</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
