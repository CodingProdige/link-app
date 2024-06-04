import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const fetchUserData = async (uid) => {
  try {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.error('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    return null;
  }
};


/**
 * Add or update user data in Firestore.
 * @param {string} uid - User ID.
 * @param {Object} data - User data to add or update.
 */
export const addUserData = async (uid, data) => {
  try {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, data, { merge: true });
    console.log('User data added/updated successfully');
  } catch (error) {
    console.error('Error adding/updating user data:', error.message);
  }
};