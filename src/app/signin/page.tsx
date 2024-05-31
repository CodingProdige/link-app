"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import styles from '@/styles/signin.module.scss';

async function setHttpOnlyCookie(token: string) {
  await fetch('/api/set-cookie', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
}

async function handleSignIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const idToken = await user.getIdToken();

    // Update the user's document with the new token
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { token: idToken });

    // Set the HTTP-only cookie with the token
    await setHttpOnlyCookie(idToken);

    // Redirect to the dashboard
    window.location.href = '/dashboard';
  } catch (error: any) {
    console.error('Error signing in:', error.message);
    // Handle error (e.g., show error message to user)
  }
}

async function handleGoogleSignIn() {
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    const idToken = await user.getIdToken();

    // Update the user's document with the new token
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { token: idToken });

    // Set the HTTP-only cookie with the token
    await setHttpOnlyCookie(idToken);

    // Redirect to the dashboard
    window.location.href = '/dashboard';
  } catch (error: any) {
    console.error('Error signing in with Google:', error.message);
    // Handle error (e.g., show error message to user)
  }
}

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSignIn(email, password);
  };

  return (
    <section className={styles.loginPage}>
      <div className={styles.formContainer}>
        <form onSubmit={onSubmit}>
          <div className={styles.inputContainer}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit">Sign In</button>
        </form>
        <button onClick={handleGoogleSignIn}>Sign In with Google</button>
      </div>
    </section>
  );
}
