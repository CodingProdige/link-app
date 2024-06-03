import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase';

export default async function Logout() {
  try {
    // Log out using Firebase Client SDK
    await signOut(auth);

    // Call the API route to unset the token cookie
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error logging out:', error);
  }
}
