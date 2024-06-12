// components/Header.js
import { PrismicText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import * as prismic from "@prismicio/client";
import Link from 'next/link';

import { ROUTES, DASHBOARD_ROUTES } from '@/lib/constants';
import styles from '@/styles/header.module.scss';
import variables from '@/styles/variables.module.scss';
import { PrismicNextImage } from "@prismicio/next";
import { FiAlignCenter } from "react-icons/fi";
import MobileMenu from '@/components/MobileMenu';

export default function Header({ settings, navigation, pathname, user, isOpen, toggleMenu }) {
  if (!settings || !navigation || pathname === null) {
    return <div>Loading...</div>;
  }

  // Do not render header on login and register pages
  if ( pathname === '/signin' || pathname === '/signup' || pathname.includes('dashboard') || pathname.includes('user')) {
    return null;
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer} style={{ maxWidth: variables.screenXxl }}>
        <PrismicNextLink href="/">
          {settings.data.logo ? (
            <>
              <div className={styles.logoContainer}>
                <div className={styles.logoDesktop}>
                  <PrismicNextImage field={settings.data.logo} />
                </div>
                <div className={styles.logoMobile}>
                  <PrismicNextImage field={settings.data.logoEmblem} />
                </div>
              </div>
            </>
          ) : (
            <PrismicText field={settings.data.siteTitle} />
          )}
        </PrismicNextLink>
        <nav className={styles.menuNav}>
          <ul>
            {navigation.data?.links.map((item) => {
              const isActive = pathname === prismic.asLink(item.link);
              return (
                <li key={prismic.asText(item.label)} className={isActive ? styles.active : ''}>
                  <PrismicNextLink field={item.link}>
                    <PrismicText field={item.label} />
                  </PrismicNextLink>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className={styles.profileButtons}>
          {user ? (
            <Link href={DASHBOARD_ROUTES.DASHBOARD.ROUTE}>
              <button className={styles.dashboardButton}>Dashboard</button>
            </Link>
          ) : (
            <>
              <Link href={ROUTES.LOGIN.ROUTE}>
                <button className={styles.loginButton}>Login</button>
              </Link>
              <Link href={ROUTES.REGISTER.ROUTE}>
                <button className={styles.registerButton}>Sign up free</button>
              </Link>
            </>
          )}
        </div>
        <div className={styles.mobileMenu} onClick={toggleMenu}>
            <FiAlignCenter className={styles.hamburgerIcon} />
            <MobileMenu navigation={navigation} user={user} isOpen={isOpen} />
        </div>
      </div>
    </header>
  );
}
