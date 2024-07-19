import fs from 'fs';
import path from 'path';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, getDocs, collection } from 'firebase/firestore';


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhVf9A0P61Nuwpv3BJO9KeRVePHWPSMCg",
  authDomain: "linkapp-a5ccb.firebaseapp.com",
  databaseURL: "https://linkapp-a5ccb-default-rtdb.firebaseio.com",
  projectId: "linkapp-a5ccb",
  storageBucket: "linkapp-a5ccb.appspot.com",
  messagingSenderId: "940381602817",
  appId: "1:940381602817:web:bbd1b4b38ad0b1ef1dec00"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Fetch usernames from Firestore
const fetchUsernames = async () => {
  try {
    const usernames = [];
    const snapshot = await getDocs(collection(db, 'users'));
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.username) {
        usernames.push(data.username);
      }
    });
    return usernames;
  } catch (error) {
    console.error('Error fetching usernames:', error);
    throw new Error('Failed to fetch usernames');
  }
};

// Generate sitemap
const generateSitemap = async () => {
  try {
    const baseUrl = 'https://fansl.ink';

    const staticPages = [
      `${baseUrl}/`,
      `${baseUrl}/pricing`,
      `${baseUrl}/signin`,
      `${baseUrl}/signup`,
      `${baseUrl}/about`,
      `${baseUrl}/terms-and-conditions`,
      `${baseUrl}/privacy-policy`,
      `${baseUrl}/fanslink-for-instagram`,
      `${baseUrl}/fanslink-for-tiktok`,
    ];

    const usernames = await fetchUsernames();
    const userPages = usernames.map(username => `${baseUrl}/user/${username}`);

    const allPages = [...staticPages, ...userPages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPages
        .map((url) => {
          return `<url>
            <loc>${url}</loc>
          </url>`;
        })
        .join('')}
    </urlset>`;

    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`Sitemap generated and saved to ${sitemapPath}`);
  } catch (err) {
    console.error('Error generating sitemap:', err);
  }
};

// Run sitemap generation
generateSitemap().catch((err) => {
  console.error('Error generating sitemap:', err);
});
