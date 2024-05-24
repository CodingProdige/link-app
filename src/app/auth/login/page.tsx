// app/login/page.js
"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { DASHBOARD_ROUTES } from '@/app/lib/constants';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import Image from 'next/image';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, loginWithGoogle, loginWithFacebook } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push(DASHBOARD_ROUTES.DASHBOARD.ROUTE);
    } catch (error) {
      console.error('Failed to login', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push(DASHBOARD_ROUTES.DASHBOARD.ROUTE);
    } catch (error) {
      console.error('Failed to login with Google', error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
      router.push(DASHBOARD_ROUTES.DASHBOARD.ROUTE);
    } catch (error) {
      console.error('Failed to login with Facebook', error);
    }
  };

  useEffect(() => {
    if (user) {
      router.push(DASHBOARD_ROUTES.DASHBOARD.ROUTE);
    }
  }, [user, router]);

  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-center min-h-screen bg-gray-100">
      <div className="hidden lg:block lg:w-1/2 overflow-hidden">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/linkapp-a5ccb.appspot.com/o/Platform%20Images%2Fsmiling-young-woman-using-mobile-phone-against-sky.jpg?alt=media&token=fda1f0b3-61ee-4ca8-a374-0cdcf7fcc3ad"
          alt="Login illustration"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg lg:w-1/2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-brand-primary border border-transparent rounded-md shadow-sm hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
            >
              Login
            </button>
          </div>
        </form>
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleGoogleLogin}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm flex items-center justify-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FaGoogle className="mr-2" />
            Login with Google
          </button>
          <button
            onClick={handleFacebookLogin}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaFacebook className="mr-2" />
            Login with Facebook
          </button>
        </div>
      </div>
    </div>
  );
}
