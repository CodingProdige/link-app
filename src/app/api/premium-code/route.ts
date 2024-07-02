import { db } from '@/firebase/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// Function to generate a 5-digit random code
const generateCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

export async function POST(request) {
  try {
    const docRef = doc(db, 'activationCodes', 'codesList'); // The single document containing all codes
    const docSnap = await getDoc(docRef);

    let existingCodes = [];
    if (docSnap.exists()) {
      existingCodes = docSnap.data().codes || [];
    } else {
      // Create the document if it doesn't exist
      await setDoc(docRef, { codes: [] });
    }

    let newCode = generateCode();
    while (existingCodes.includes(newCode)) {
      newCode = generateCode();
    }

    await updateDoc(docRef, {
      codes: arrayUnion(newCode),
    });

    return new Response(JSON.stringify({ code: newCode }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error generating and saving code:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate code' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
