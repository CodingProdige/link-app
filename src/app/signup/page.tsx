"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

async function setHttpOnlyCookie(token: string) {
  await fetch('/api/set-cookie', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
}

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      // Create a new user document in Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { email: user.email, token: idToken });

      // Set the HTTP-only cookie with the token
      await setHttpOnlyCookie(idToken);

      // Redirect to the dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      setError(error.message || 'An error occurred');
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      // Create a new user document in Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { email: user.email, token: idToken });

      // Set the HTTP-only cookie with the token
      await setHttpOnlyCookie(idToken);

      // Redirect to the dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error signing up with Google:', error.message);
      setError(error.message || 'An error occurred');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px', marginBottom: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px', marginBottom: '10px' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px' }}>
          Sign Up
        </button>
      </form>
      <button onClick={handleGoogleSignUp} style={{ padding: '10px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px' }}>
        Sign Up with Google
      </button>
    </div>
  );
}
