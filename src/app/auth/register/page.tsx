// app/register/page.js
"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { DASHBOARD_ROUTES } from '@/app/lib/constants';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, register, loginWithGoogle, loginWithFacebook } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      router.push(DASHBOARD_ROUTES.DASHBOARD.ROUTE);
    } catch (error) {
      console.error('Failed to register', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push(DASHBOARD_ROUTES.DASHBOARD.ROUTE);
    } catch (error) {
      console.error('Failed to sign up with Google', error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
      router.push(DASHBOARD_ROUTES.DASHBOARD.ROUTE);
    } catch (error) {
      console.error('Failed to sign up with Facebook', error);
    }
  };

  useEffect(() => {
    if (user) {
      router.push(DASHBOARD_ROUTES.DASHBOARD.ROUTE);
    }
  }, [user, router]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Register</button>
      </form>
      <button onClick={handleGoogleLogin}>Sign up with Google</button>
      <button onClick={handleFacebookLogin}>Sign up with Facebook</button>
    </div>
  );
}
