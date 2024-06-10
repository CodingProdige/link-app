import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs, arrayUnion, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {auth, db } from '@/firebase/firebase';

/**
 * Fetch user data by UID.
 * @param {string} uid - User ID.
 * @returns {Promise<Object|null>} - User data or null if not found.
 */
export const fetchUserData = async (uid) => {
  try {
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
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, data, { merge: true });
    console.log('User data added/updated successfully');
  } catch (error) {
    console.error('Error adding/updating user data:', error.message);
  }
};

/**
 * Check if the user has a username field and if it is not empty.
 * @param {string} uid - User ID.
 * @returns {Promise<boolean>} - True if username field exists and is not empty, false otherwise.
 */
export const hasUsernameField = async (uid) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.hasOwnProperty('username') && userData.username.trim() !== '';
    } else {
      console.error('No such document!');
      return false;
    }
  } catch (error) {
    console.error('Error checking username field:', error.message);
    return false;
  }
};

/**
 * Check if the username is already taken.
 * @param {string} username - Username to check.
 * @returns {Promise<boolean>} - True if username is taken, false otherwise.
 */
export const isUsernameTaken = async (username) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking username:', error.message);
    return false;
  }
};

/**
 * Update the username of a user in Firestore.
 * @param {string} uid - User ID.
 * @param {string} username - New username.
 * @returns {Promise<void>}
 */
export const updateUsername = async (uid, username) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, { username }, { merge: true });
    console.log('Username updated successfully');
  } catch (error) {
    console.error('Error updating username:', error.message);
    throw new Error('Username update failed');
  }
};


/**
 * Checks for an active subscription on the user.
 * @param {string} uid - User ID.
 */
export const checkSubscriptionStatus = async (uid) => {
  const subscriptionQuery = query(
    collection(db, 'customers', uid, 'subscriptions'),
    where('status', 'in', ['trialing', 'active', 'canceled'])
  );

  const subscriptionSnapshot = await getDocs(subscriptionQuery);

  if (subscriptionSnapshot.empty) {
    return false;
  }

  let hasActiveSubscription = false;

  subscriptionSnapshot.forEach((doc) => {
    const subscription = doc.data();
    if (subscription.status === 'canceled' && subscription.cancel_at_period_end) {
      hasActiveSubscription = true;
    }
    if (['trialing', 'active'].includes(subscription.status)) {
      hasActiveSubscription = true;
    }
  });

  return hasActiveSubscription;
};

/**
 * Fetch user data by username.
 * @param {string} username - The username of the user.
 * @returns {Promise<Object|null>} - User data or null if not found.
 */
export const fetchUserDataByUsername = async (username) => {
  try {
    // Create a query to find the user by username
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data();
    } else {
      console.error('No such user!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data by username:', error.message);
    return null;
  }
};

/**
 * Fetches a user's links from Firestore.
 */
export const addLinkToFirestore = async ({ title, link }) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  let currentLinks = [];
  let newId = 1;

  if (userDoc.exists()) {
    const userData = userDoc.data();
    currentLinks = userData.links || [];
    newId = currentLinks.length + 1;
  }

  const newLink = { id: newId, title, link };

  if (currentLinks.length === 0) {
    // If the links array does not exist, set the document with the new link
    await setDoc(userDocRef, { links: [newLink] }, { merge: true });
  } else {
    // If the links array exists, update the document with the new link
    await updateDoc(userDocRef, {
      links: arrayUnion(newLink)
    });
  }
};

/**
 * Update the users links array in Firestore
 * @param {string} userId 
 * @param {*} links 
 */
export const updateLinks = async (userId, links) => {
  const userDocRef = doc(db, 'users', userId);

  try {
    await updateDoc(userDocRef, {
      links: links
    });
    console.log('Links updated successfully');
  } catch (error) {
    console.error('Error updating links: ', error);
    throw error;
  }
};

export const getAllTemplates = async () => {
  try {
    const templatesCol = collection(db, 'templates');
    const templateSnapshot = await getDocs(templatesCol);
    const templateList = templateSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return templateList;
  } catch (error) {
    console.error("Error fetching templates: ", error);
    throw error;
  }
};


export const generateStaticParams = async () => {
  try {
    const usernames = [];
    const querySnapshot = await getDocs(collection(db, 'users')); // Adjust the collection name as necessary
    querySnapshot.forEach((doc) => {
      usernames.push(doc.id); // Assuming the document ID is the username
    });
    return usernames.map((username) => ({ params: { username } }));
  } catch (error) {
    console.error('Error fetching usernames:', error);
    return [];
  }
}
