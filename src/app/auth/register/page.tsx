// app/register/page.js
"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { DASHBOARD_ROUTES, ROUTES } from '@/app/lib/constants';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import Image from 'next/image';
import styles from '@/styles/register.module.scss';

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
      console.log('Attempting to sign up with Google');
      await loginWithGoogle();
      router.push(DASHBOARD_ROUTES.DASHBOARD.ROUTE);
    } catch (error) {
      console.error('Failed to sign up with Google', error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      console.log('Attempting to sign up with Facebook');
      await loginWithFacebook();
      router.push(DASHBOARD_ROUTES.DASHBOARD.ROUTE);
    } catch (error) {
      console.error('Failed to sign up with Facebook', error);
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User is registered, redirecting to dashboard');
      router.push(DASHBOARD_ROUTES.DASHBOARD.ROUTE);
    }
  }, [user, router]);

  return (
    <div className={styles.registerPage}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formHeader}>
            <h3>Create an account</h3>
            <p>Join Fanslink today.</p>
          </div>
          <div>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <div>
            <button type="submit">Create account</button>
          </div>
            <sup>By clicking Create account, you agree to Fanlink&apos;s Terms and Conditions and confirm you have read our Privacy Notice. You may receive offers, news and updates from us.</sup>
          <p>OR</p>
          <div className={styles.socialLogin}>
            <button onClick={handleGoogleLogin}>
              <FaGoogle />
              Sign up with Google
            </button>
            <button onClick={handleFacebookLogin}>
              <FaFacebook />
              Sign up with Facebook
            </button>
          </div>
          <sup>Already have an account? <a href={ROUTES.LOGIN.ROUTE}>Login.</a></sup>
        </form>
      </div>
      <div className={styles.imageContainer}>
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/linkapp-a5ccb.appspot.com/o/Platform%20Images%2Fsmiling-young-woman-using-mobile-phone-against-sky.jpg?alt=media&token=fda1f0b3-61ee-4ca8-a374-0cdcf7fcc3ad"
          alt="Registration illustration"
          layout="fill"
        />
      </div>
    </div>
  );
}
