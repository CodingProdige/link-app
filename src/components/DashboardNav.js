"use client";
import React, { useState, useEffect } from 'react';
import { ROUTES, DASHBOARD_ROUTES } from '@/lib/constants';
import { useRouter, usePathname } from 'next/navigation';
import styles from '@/styles/dashboardNav.module.scss';
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { useAuth } from '@/firebase/auth';
import Logout from '@/lib/logout';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';
import { fetchUserData } from '@/utils/firebaseUtils';
import { BsViewList } from "react-icons/bs";
import { RiHome6Line } from "react-icons/ri";
import Link from 'next/link';

function getRandomHumanImage() {
  const humanImages = Object.values(IMAGES.PROFILE.HUMANS);
  const randomIndex = Math.floor(Math.random() * humanImages.length);
  return humanImages[randomIndex];
}

async function handleLogout() {
  try {
    await Logout();
    // Redirect to the home page after logout
    window.location.href = '/';
  } catch (error) {
    console.error('Error logging out:', error.message);
    // Handle error (e.g., show error message to user)
  }
}

const DashboardNav = ({ settings }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchAndSetUserData = async () => {
      if (authUser) {
        try {
          const data = await fetchUserData(authUser.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      }
    };

    fetchAndSetUserData();
  }, [authUser]);

  const dashboardRoutesArray = Object.values(DASHBOARD_ROUTES);

  const returnIcon = (routeName) => {
    const isActive = pathname === routeName.toLowerCase();
    const iconClass = isActive ? `${styles.icon} ${styles.active}` : styles.icon;
    
    switch (routeName) {
      case 'Dashboard':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className={iconClass}>
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
          </svg>
        );
      case 'Links':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className={iconClass}>
            <path d="M3 4.5h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zM1 2a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 2m0 12a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 14"/>
          </svg>
        );
      case 'Settings':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className={iconClass}>
            <path fillRule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z"/>
          </svg>
        );
      case 'Appearance':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className={iconClass}>
            <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
          </svg>
        );
      case 'Analytics':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className={iconClass}>
            <path d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/>
          </svg>
        );
      default:
        return null;
    }
  }

  return (
    <div className={styles.dashboardNav}>
      <div className={styles.navLogoContainer}>
        <PrismicNextImage field={settings.data.logo} />
      </div>
      <button onClick={handleLogout} style={{ padding: '10px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px' }} aria-label="Logout">
        Logout
      </button>
      <div className={styles.navLinks}>
        <ul>
          {
            dashboardRoutesArray.map((route, index) => {
              const isActive = pathname === route.ROUTE;
              return (
                <Link href={route.ROUTE} key={index}>
                  <li key={index} className={isActive ? styles.active : ''}>
                    {returnIcon(route.NAME)}
                    <p>{route.NAME}</p>
                  </li>
                </Link>
              );
            })
          }
        </ul>
      </div>

      <div className={styles.profileImageContainer}>
        {userData && (
          <div className={styles.profileInnerContainer}>
            <Image src={userData.photoURL || getRandomHumanImage()} alt={userData.displayName} width={40} height={40} />
            <div className={styles.userInfo}>
              <p>{userData.name}</p>
              <p>{userData.email}</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default DashboardNav;
