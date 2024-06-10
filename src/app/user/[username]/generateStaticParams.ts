import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebase'; // Adjust the import path as necessary


export async function fetchStaticParams() {
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