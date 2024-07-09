import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  arrayUnion, 
  updateDoc, 
  increment, 
  writeBatch ,
  serverTimestamp, 
  runTransaction,
  Timestamp,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteField } from 'firebase/storage';
import { sendPasswordResetEmail } from "firebase/auth";
import {auth, db, storage, analytics } from '@/firebase/firebase';
import { logEvent } from "firebase/analytics";
import axios from 'axios';
import imageCompression from 'browser-image-compression';


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
    // Convert the username to lowercase
    const lowerCaseUsername = username.toLowerCase();
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, { username: lowerCaseUsername }, { merge: true });
    console.log('Username updated successfully');
  } catch (error) {
    console.error('Error updating username:', error.message);
    throw new Error('Username update failed');
  }
};


/**
 * Update the showLogo field of a user in Firestore.
 * @param {string} uid - User ID.
 * @param {boolean} showLogo - Boolean value to set showLogo to.
 * @returns {Promise<object>} - The updated user data.
 */
export const updateUserShowLogo = async (uid, showLogo) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, { showLogo }, { merge: true });
    console.log('showLogo field updated successfully');

    // Fetch the updated document
    const updatedDoc = await getDoc(userDocRef);
    if (updatedDoc.exists()) {
      return updatedDoc.data();
    } else {
      throw new Error('User document does not exist');
    }
  } catch (error) {
    console.error('Error updating showLogo field:', error.message);
    throw new Error('showLogo field update failed');
  }
};



/**
 * Update the bio of a user in Firestore.
 * @param {string} uid - User ID.
 * @param {string} bio - New bio.
 * @returns {Promise<void>}
 */
export const updateUserBio = async (uid, bio) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, { bio }, { merge: true });
    console.log('Bio updated successfully');
  } catch (error) {
    console.error('Error updating bio:', error.message);
    throw new Error('Bio update failed');
  }
};

/**
 * Update the bio of a user in Firestore.
 * @param {string} uid - User ID.
 * @param {string} title - New title.
 * @returns {Promise<void>}
 */
export const updateUserTitle = async (uid, title) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, { title }, { merge: true });
    console.log('Title updated successfully');
  } catch (error) {
    console.error('Error updating title:', error.message);
    throw new Error('Title update failed');
  }
};

/**
 * Update the photo URL of a user in Firestore.
 * @param {string} uid - User ID.
 * @param {string} photoUrl - New photo URL.
 * @returns {Promise<void>}
 */
export const updateUserPhotoUrl = async (uid, photoUrl) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, { photoUrl }, { merge: true });
    console.log('Photo URL updated successfully');
  } catch (error) {
    console.error('Error updating photo URL:', error.message);
    throw new Error('Photo URL update failed');
  }
};

/**
 * Delete the photo URL of a user in Firestore.
 * @param {string} uid - User ID.
 * @returns {Promise<void>}
 */
export const deleteUserPhotoUrl = async (uid) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, { photoUrl: '' }, { merge: true });
    console.log('Photo URL cleared successfully');
  } catch (error) {
    console.error('Error clearing photo URL:', error.message);
    throw new Error('Photo URL clearing failed');
  }
};

/**
 * Updates the user's Opengraph data in Firestore.
 * @param {string} userId - The ID of the user.
 * @param {any} openGraphDetails - The Open Graph details to update.
 */
export const updateOpenGraphDetails = async (userId, openGraphDetails) => {
  const userDocRef = doc(db, 'users', userId);

  try {
    await updateDoc(userDocRef, {
      openGraph: openGraphDetails
    });
    console.log('Open Graph details updated successfully');
  } catch (error) {
    console.error('Error updating Open Graph details:', error);
    throw new Error('Failed to update Open Graph details');
  }
};

/**
 * Updates the user's Meta data in Firestore.
 * @param {string} userId - The ID of the user.
 * @param {any} metaDataDetails - The Open Meta data to update.
 */
export const updateMetaDataDetails = async (userId, metaDataDetails) => {
  const userDocRef = doc(db, 'users', userId);

  try {
    await updateDoc(userDocRef, {
      metaData: metaDataDetails
    });
    console.log('Meta Data details updated successfully');
  } catch (error) {
    console.error('Error updating Meta Data details:', error);
    throw new Error('Failed to update Meta Data details');
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
 * Checks for an active subscription on the user.
 * @param {string} uid - User ID.
 * @param {boolean} status - The new premium status.
 */
export const updatePremiumStatus = async (uid, status) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    premium: status
  });
};

/**
 * Checks if the provided code exists in the activationCodes collection.
 * @param {string} code - The code to check.
 * @returns {Promise<boolean>} - Returns true if the code exists, false otherwise.
 */
export const checkIfCodeExists = async (code) => {
  try {
    const docRef = doc(db, 'activationCodes', 'codesList');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingCodes = docSnap.data().codes || [];
      return existingCodes.includes(code);
    } else {
      console.error('Document does not exist.');
      return false;
    }
  } catch (error) {
    console.error('Error checking if code exists:', error);
    return false;
  }
};

/**
 * Removes a code from the activationCodes collection.
 * @param {string} code - The code to remove.
 * @returns {Promise<void>}
 */
export const removeCode = async (code) => {
  try {
    const docRef = doc(db, 'activationCodes', 'codesList');
    await updateDoc(docRef, {
      codes: arrayRemove(code),
    });
  } catch (error) {
    console.error('Error removing code:', error);
  }
};

/**
 * Fetch user data by username.
 * @param {string} username - The username of the user.
 * @returns {Promise<Object|null>} - User data or null if not found.
 */
export const fetchUserDataByUsername = async (username) => {
  try {
    // Convert the input username to lowercase
    const lowerCaseUsername = username.toLowerCase();

    // Create a query to find the user by lowercase username
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('username', '==', lowerCaseUsername));
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


// Function to generate a random 10-digit ID
const generateRandomId = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

export const addLinkToFirestore = async ({ title, link, userId, urlMetaData }) => {
  if (!title || !link || !userId || !urlMetaData) {
    throw new Error('Missing required fields');
  }

  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);

  let currentLinks = [];

  if (userDoc.exists()) {
    const userData = userDoc.data();
    currentLinks = userData.links || [];
  }

  // Ensure urlMetaData and its fields have no undefined values
  const validatedUrlMetaData = { mediaType: urlMetaData.mediaType, metadata: {} };
  for (const key in urlMetaData.metadata) {
    if (urlMetaData.metadata[key] !== undefined) {
      validatedUrlMetaData.metadata[key] = urlMetaData.metadata[key];
    }
  }

  // Generate a unique ID
  let newId;
  do {
    newId = generateRandomId();
  } while (currentLinks.some(link => link.id === newId));

  const newLink = { 
    id: newId, 
    title, 
    link,
    active: true,
    metadata: validatedUrlMetaData,
    layout: 'classic',
    linkType: 'external',
  };

  // Log the newLink object to check for any undefined fields
  console.log('New Link:', newLink);

  let updatedLinks = [];
  if (currentLinks.length === 0) {
    // If the links array does not exist, set the document with the new link
    await setDoc(userDocRef, { links: [newLink] }, { merge: true });
    updatedLinks = [newLink];
  } else {
    // If the links array exists, update the document with the new link
    await updateDoc(userDocRef, {
      links: arrayUnion(newLink)
    });
    updatedLinks = [...currentLinks, newLink];
  }

  return updatedLinks;
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


export const updateUserProfilePicture = async (userId, file) => {
  const storage = getStorage();
  const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  const userDocRef = doc(db, 'users', userId);
  await updateDoc(userDocRef, {
    profilePicture: downloadURL
  });

  return downloadURL;
};


export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent.");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};


/**
 * Updates the active state of a specific link in Firestore.
 * If the active key does not exist, it adds the key with a default value.
 * @param {string} userId - The ID of the user.
 * @param {number} linkId - The ID of the link.
 * @param {boolean} active - The new active state.
 */
export const updateLinkActiveState = async (userId, linkId, active) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const links = userData.links || [];
      
      const updatedLinks = links.map(link => {
        if (link.id === linkId) {
          return { ...link, active };
        }
        return link;
      });

      await updateDoc(userRef, { links: updatedLinks });

      console.log('Link active state updated successfully');
      return updatedLinks;
    } else {
      throw new Error('User document does not exist');
    }
  } catch (error) {
    console.error('Error updating link active state: ', error);
    throw error;
  }
};

/**
 * Updates a specific link data (e.g., title or url) in Firestore.
 * If the field key does not exist, it adds the key with the provided value.
 * @param {string} userId - The ID of the user.
 * @param {number} linkId - The ID of the link.
 * @param {string} field - The field to update (e.g., 'title' or 'link').
 * @param {any} value - The new value for the field.
 */
export const updateLinkData = async (userId, linkId, field, value) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const links = userData.links || [];

      const updatedLinks = links.map(link => {
        if (link.id === linkId) {
          return { ...link, [field]: value };
        }
        return link;
      });

      await updateDoc(userRef, { links: updatedLinks });

      console.log(`Link ${field} updated successfully`);
      return updatedLinks;
    } else {
      throw new Error('User document does not exist');
    }
  } catch (error) {
    console.error(`Error updating link ${field}: `, error);
    throw error;
  }
};

/**
 * Deletes a specific link from the user's links array in Firestore.
 * @param {string} userId - The ID of the user.
 * @param {number} linkId - The ID of the link to be deleted.
 * @returns {Array} - The updated links array after deletion.
 */
export const deleteLinkById = async (userId, linkId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    const analyticsRef = doc(db, 'analytics', userId);
    const analyticsDoc = await getDoc(analyticsRef);

    if (analyticsDoc.exists()) {
      const analyticsData = analyticsDoc.data();
      const links = analyticsData.links || [];
      
      const updatedLinks = links.filter(link => link.id !== linkId);

      await updateDoc(analyticsRef, { links: updatedLinks });

      console.log('Analytics link deleted successfully: ', updatedLinks);
    } else {
      throw new Error('analytics document does not exist');
    }

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const links = userData.links || [];
      
      const updatedLinks = links.filter(link => link.id !== linkId);

      await updateDoc(userRef, { links: updatedLinks });

      console.log('Link deleted successfully');
      return updatedLinks;
    } else {
      throw new Error('User document does not exist');
    }
  } catch (error) {
    console.error('Error deleting link: ', error);
    throw error;
  }
};


/**
 * Validates a URL against a specified regex pattern.
 * @param {string} url The URL to validate.
 * @return {boolean} True if the URL is valid, false otherwise.
 */
export const validateUrl = (url) => {
  const urlPattern = new RegExp(
    'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
  );
  return urlPattern.test(url);
};

/**
 * Downloads an image from the given URL using the proxy API route and uploads it to Firebase Storage under the current user.
 * @param {string} userId - The ID of the current user.
 * @param {string} imageUrl - The URL of the image to download.
 * @returns {Promise<string>} - The download URL of the uploaded image.
 */
export const downloadAndUploadImage = async (userId, imageUrl) => {
  try {
    // Fetch the image as a blob using the Next.js API route
    const proxyUrl = `/api/downloadImage?url=${encodeURIComponent(imageUrl)}`;
    const response = await axios.get(proxyUrl, { responseType: 'blob' });
    const imageBlob = response.data;

    // Create a reference to the Firebase Storage location
    const storageRef = ref(storage, `users/${userId}/images/${Date.now()}_${imageUrl.split('/').pop()}`);

    // Upload the image blob to Firebase Storage
    await uploadBytes(storageRef, imageBlob);

    // Get the download URL of the uploaded image
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error('Error downloading or uploading image: ', error);
    throw error;
  }
};

/**
 * Compresses and uploads the given image file to Firebase Storage under the current user.
 * @param {string} userId - The ID of the current user.
 * @param {File} imageFile - The image file to upload.
 * @returns {Promise<string>} - The download URL of the uploaded image.
 */
export const uploadImage = async (userId, imageFile) => {
  try {
    // Compress the image file
    const options = {
      maxSizeMB: 5, // Maximum size in MB
      maxWidthOrHeight: 1920, // Max width or height
      useWebWorker: true, // Use web worker for better performance
    };
    const compressedFile = await imageCompression(imageFile, options);

    // Create a reference to the Firebase Storage location
    const storageRef = ref(storage, `users/${userId}/images/${Date.now()}_${imageFile.name}`);

    // Upload the compressed image file to Firebase Storage
    await uploadBytes(storageRef, compressedFile);

    // Get the download URL of the uploaded image
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading image: ', error);
    throw error;
  }
};

/**
 * Compresses and uploads the given video file to Firebase Storage under the current user.
 * Ensures the video is no longer than 5 minutes.
 * @param {string} userId - The ID of the current user.
 * @param {File} videoFile - The video file to upload.
 * @returns {Promise<string>} - The download URL of the uploaded video.
 */
export const uploadVideo = async (userId, videoFile) => {
  try {
    // Create a reference to the Firebase Storage location
    const storage = getStorage();
    const storageRef = ref(storage, `users/${userId}/videos/${Date.now()}_${videoFile.name}`);

    // Upload the compressed video file to Firebase Storage
    await uploadBytes(storageRef, videoFile);

    // Get the download URL of the uploaded video
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading video: ', error);
    throw error;
  }
};

/**
 * Updates the theme data in Firestore.
 * @param {string} userId - The ID of the user.
 * @param {object} theme - The new theme object to update.
 */
export const updateUserTheme = async (userId, theme) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, { theme });

      console.log(`User theme updated successfully`);
      return theme;
    } else {
      throw new Error('User document does not exist');
    }
  } catch (error) {
    console.error('Error updating user theme: ', error);
    throw error;
  }
};



// ANALYTICS FUNCTIONS
const LOCATION_RETENTION_DAYS = 30;
const EVENT_RETENTION_DAYS = 90; // 3 months
const VISIT_RETENTION_DAYS = 90; // 3 months

export const trackUserVisit = async (uid, referer) => {
  const docRef = doc(db, "analytics", uid);

  try {
    const docSnap = await getDoc(docRef);
    const visitData = {
      timestamp: new Date().toISOString(),
      referer: referer || document.referrer,
      deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
    };

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        visits: [visitData],
        lastVisit: new Date().toISOString(),
        links: [],
        locations: [],
        mobile: visitData.deviceType === 'mobile' ? 1 : 0,
        desktop: visitData.deviceType === 'desktop' ? 1 : 0,
        referers: referer ? [visitData] : [],
      });
    } else {
      const userData = docSnap.data();
      const visits = userData.visits || [];
      const cutoffTimestamp = new Date(Date.now() - VISIT_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
      const filteredVisits = visits.filter(visit => new Date(visit.timestamp) > new Date(cutoffTimestamp));

      filteredVisits.push(visitData);

      const referrers = userData.referers || [];
      if (referer && !referrers.find(r => r.referer === referer)) {
        referrers.push({ referer, timestamp: visitData.timestamp });
      }

      const deviceCountUpdate = visitData.deviceType === 'mobile' ? { mobile: increment(1) } : { desktop: increment(1) };

      await updateDoc(docRef, {
        visits: filteredVisits,
        lastVisit: new Date().toISOString(),
        referers: referrers,
        ...deviceCountUpdate
      });
    }
  } catch (error) {
    console.error("Error tracking user visit:", error);
  }
};

export const trackDeviceType = async (userId, deviceType) => {
  const docRef = doc(db, "analytics", userId);

  try {
    await updateDoc(docRef, {
      [deviceType]: increment(1),
    });
  } catch (error) {
    console.error("Error tracking device type:", error);
  }
};

export const trackVisitorLocation = async (userId, location) => {
  const docRef = doc(db, "analytics", userId);

  if (!location.city || !location.country_name) {
    console.error('Invalid location data:', location);
    return;
  }

  try {
    const userDoc = await getDoc(docRef);
    if (!userDoc.exists()) {
      throw new Error("User document does not exist!");
    }

    const locationData = {
      city: location.city,
      country: location.country_name,
      timestamp: new Date().toISOString(),
    };

    const userData = userDoc.data();
    const locations = userData.locations || [];

    const cutoffTimestamp = new Date(Date.now() - LOCATION_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const filteredLocations = locations.filter(loc => new Date(loc.timestamp) > new Date(cutoffTimestamp));

    filteredLocations.push(locationData);

    await updateDoc(docRef, {
      locations: filteredLocations,
      lastLocation: location.city,
    });
  } catch (error) {
    console.error('Error tracking visitor location:', error);
  }
};

const updateLinkEvent = async (userId, linkId, title, eventType) => {
  try {
    const userRef = doc(db, 'analytics', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const links = userData.links || [];
      const event = {
        type: eventType,
        timestamp: new Date().toISOString(),
      };

      const updatedLinks = links.map(link => {
        if (link.id === linkId) {
          const events = link.events || [];
          const cutoffTimestamp = new Date(Date.now() - EVENT_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
          const filteredEvents = events.filter(event => new Date(event.timestamp) > new Date(cutoffTimestamp));
          return { ...link, title, events: [...filteredEvents, event] };
        }
        return link;
      });

      if (!updatedLinks.find(link => link.id === linkId)) {
        updatedLinks.push({ id: linkId, title, events: [event] });
      }

      await updateDoc(userRef, { links: updatedLinks });

      console.log(`Link ${eventType} event updated successfully`);
      return updatedLinks;
    } else {
      throw new Error('User document does not exist');
    }
  } catch (error) {
    console.error(`Error updating link ${eventType} event: `, error);
    throw error;
  }
};

export const trackLinkClick = (userId, linkId, title) => updateLinkEvent(userId, linkId, title, 'click');
export const trackLinkHover = (userId, linkId, title) => updateLinkEvent(userId, linkId, title, 'hover');

export const fetchUserAnalytics = async (userId) => {
  const docRef = doc(db, "analytics", userId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return data;
};



