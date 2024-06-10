"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/firebase/firebase';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import Loading from '@/components/Loading';

interface UserPageProps {
  params: {
    username: string;
  };
}

export default function UserPage({ params: { username } }: UserPageProps) {
  const searchParams = useSearchParams();
  const queryUsername = searchParams.get('nxtPusername') || username;
  const [userData, setUserData] = useState<DocumentData | null>(null);

  useEffect(() => {
    if (queryUsername) {
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', queryUsername));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.error('User not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [queryUsername]);

  if (!queryUsername) {
    return <Loading />;
  }

  return (
    <div>
      <h1>User: {queryUsername}</h1>
      {userData && <pre>{JSON.stringify(userData, null, 2)}</pre>}
    </div>
  );
}










// "use client";
// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { notFound } from 'next/navigation';
// import styles from '@/styles/userlinkPage.module.scss';
// import Loading from '@/components/Loading';
// import Link from 'next/link';
// import { fetchUserDataByUsername } from '@/utils/firebaseUtils';

// interface UserPageProps {
//   params: {
//     username: string;
//   };
// }

// const UserPage = ({ params: { username } }: UserPageProps) => {
//   const [userData, setUserData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const data = await fetchUserDataByUsername(username);

//         if (!data) {
//           notFound();
//           return;
//         }

//         setUserData(data);
//       } catch (err) {
//         console.error('Error fetching user data:', err);
//         setError('Failed to load user data.');
//         notFound();
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [username]);

//   if (loading) return <Loading />;

//   if (error) {
//     return <div className={styles.error}>{error}</div>;
//   }

//   if (!userData) {
//     return <div className={styles.error}>User data not found.</div>;
//   }

//   return (
//     <div className={styles.containerPublicProfile}>
//       <div className={styles.background}></div>
//       <div className={styles.innerContainer}>
//         <div className={styles.profileContainer}>
//           {userData?.photoUrl && (
//             <Image 
//               src={userData.photoUrl} 
//               alt={userData.username} 
//               width={150} 
//               height={150} 
//             />
//           )}
//           <p className={styles.username}>@{userData.username}</p>
//         </div>
//         {userData?.links && (
//           <div className={styles.linksContainer}>
//             <ul>
//               {userData?.links.map((link: any) => (
//                 <Link href={link.link} key={link.id} target="_blank" rel="noopener noreferrer">
//                   <li key={link.id}>
//                     {link.title}
//                   </li>
//                 </Link>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserPage;
