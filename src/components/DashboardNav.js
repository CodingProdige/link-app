"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ROUTES, DASHBOARD_ROUTES } from '@/lib/constants';
import { useRouter, usePathname } from 'next/navigation';
import styles from '@/styles/dashboardNav.module.scss';
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { useAuth } from '@/firebase/auth';
import Logout from '@/lib/logout';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';
import { fetchUserData, checkSubscriptionStatus  } from '@/utils/firebaseUtils';
import Link from 'next/link';
import { createCustomerPortal } from '@/components/CustomerPortal';
import checkStripeSubscription from '@/lib/subscriptionStatus';
import DashboardPricing from '@/components/DashboardPricing';

function getRandomHumanImage() {
  const humanImages = Object.values(IMAGES.PROFILE.HUMANS);
  const randomIndex = Math.floor(Math.random() * humanImages.length);
  return humanImages[randomIndex];
}

async function handleLogout(router) {
  try {
    await Logout();
    router.push('/');
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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);


  useEffect(() => {
    const fetchAndSetUserData = async () => {
      if (authUser) {
        try {
          const data = await fetchUserData(authUser.uid);
          setUserData(data);
          const subscriptionStatus = await checkSubscriptionStatus(authUser.uid);
          setHasActiveSubscription(subscriptionStatus);
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      }
    };

    fetchAndSetUserData();

    // Prefetch pages
    const paths = [
      '/dashboard/premium', 
      '/dashboard/settings', 
      '/dashboard/appearance', 
      '/dashboard/analytics', 
      '/dashboard/links'
    ];

    paths.forEach(path => {
      if (typeof path === 'string') {
        router.prefetch(path);
      } else {
        console.error('Invalid path for prefetching:', path);
      }
    });
  }, [authUser, router]);

  const handleProfileMenuToggle = () => setProfileMenuOpen(prevState => !prevState);
  const handleGoPremiumClick = () => router.push('/dashboard/premium');
  const handleProfileMenuNavigation = (route) => {
    setProfileMenuOpen(false)
    router.push(`/dashboard/${route}`);
  };


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
  };

  return (
    <div className={styles.dashboardNav}>
      <div className={styles.navLogoContainer}>
        <PrismicNextImage field={settings.data.logo} />
      </div>
      <div className={styles.navLinks}>
        <ul>
          {dashboardRoutesArray.map((route, index) => {
            const isActive = pathname === route.ROUTE;
            return (
              <Link href={route.ROUTE} key={index}>
                <li className={isActive ? styles.active : ''}>
                  {returnIcon(route.NAME)}
                  <p>{route.NAME}</p>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>

      <div className={styles.navInnerContainerMobile}>
        {
          !hasActiveSubscription && (
            <div className={styles.goPremiumContainer} onClick={ handleGoPremiumClick }>
              <div className={styles.goPremium}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightning-charge" viewBox="0 0 16 16">
                  <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41z"/>
                </svg>
                <p>Go Premium</p>
              </div>
            </div>
          ) 
        }
        <div className={styles.profileImageContainer}>
          {userData && (
            <div className={styles.profileInnerContainer} onClick={handleProfileMenuToggle}>
              <Image src={userData.photoUrl || getRandomHumanImage()} alt={userData.displayName} width={40} height={40} />
              <div className={styles.userInfo}>
                <p>@{userData.username}</p>
              </div>
            </div>
          )}

          {profileMenuOpen && (
            <div className={styles.profileDropdownMenu}>
              {userData && (
                <div className={styles.profileMenuUserDetailsContainer}>
                  <Image src={userData?.photoUrl || getRandomHumanImage()} alt={userData.displayName} width={40} height={40} />
                  <div className={styles.userInfo}>
                    <p>@{userData.username}</p>
                    <sub>fansl.ink/user/{userData.username}</sub>
                  </div>
                </div>
              )}
              <ul>
                <div className={styles.dropdownMenuContainer}>
                  <h5>Account</h5>
                  <li onClick={() => handleProfileMenuNavigation(ROUTES.ACCOUNT.ROUTE_HANDLE)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                    </svg>
                    <p>My account</p>
                  </li>
                  { hasActiveSubscription && (
                    <li onClick={createCustomerPortal}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-dollar" viewBox="0 0 16 16">
                        <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z"/>
                      </svg>
                      <p>Billing</p>
                    </li>
                  )}
                  <li onClick={() => handleLogout(router)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                      <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
                    </svg>
                    <p>Logout</p>
                  </li>
                </div>
                <div className={styles.dropdownMenuContainer}>
                  <h5>Support</h5>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                    </svg>
                    <p>Ask a question</p>
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-question-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
                    </svg>
                    <p>Help topics</p>
                  </li>
                </div>
              </ul>
            </div>
          )}
        </div>

        <div className={styles.mobileMenu}>
          <div className={styles.navLinksMobile}>
            <ul>
              {dashboardRoutesArray.map((route, index) => {
                const isActive = pathname === route.ROUTE;
                return (
                  <Link href={route.ROUTE} key={index}>
                    <li className={isActive ? styles.active : ''}>
                      {returnIcon(route.NAME)}
                      <p>{route.NAME}</p>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardNav;
