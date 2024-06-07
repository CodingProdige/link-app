import { db } from '@/firebase/firebase'; // Ensure this path matches your project structure
import { collection, query, where, getDocs } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { username } = await req.json();

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}
