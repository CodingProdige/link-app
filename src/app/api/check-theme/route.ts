import { db } from '@/firebase/firebase';
import { collection, query, where, updateDoc, getDocs, doc } from 'firebase/firestore';
import type { NextApiResponse } from 'next';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(
  req: NextRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { uid, theme } = await req.json();

    if (!uid || !theme) {
      return NextResponse.json({ message: 'UID and theme are required' }, { status: 400 });
    }

    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        
        if (!userData.theme) {
          const userDocRef = doc(db, 'users', userDoc.id);
          await updateDoc(userDocRef, { theme });
          return NextResponse.json({ message: 'Theme field updated' }, { status: 200 });
        } else {
          return NextResponse.json({ message: 'Theme field already exists' }, { status: 200 });
        }
      } else {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
    } catch (error) {
      console.error('Error checking or updating theme:', error);
      return NextResponse.json({ message: 'Failed to check or update theme' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
}
