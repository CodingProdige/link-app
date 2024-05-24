// components/Header.js
import { PrismicText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import * as prismic from "@prismicio/client";
import Link from 'next/link';
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES, DASHBOARD_ROUTES } from '@/app/lib/constants';
import styles from '@/styles/header.module.scss';
import variables from '@/styles/variables.module.scss';

export default function Header({ settings, navigation, pathname, user }) {
  if (!settings || !navigation || pathname === null) {
    return <div>Loading...</div>;
  }

  // Do not render header on login and register pages
  if (user || pathname === '/auth/login' || pathname === '/auth/register' || pathname.includes('dashboard') ) {
    return null;
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer} style={{maxWidth: variables.screenXxl}}>
        <PrismicNextLink href="/">
          <PrismicText field={settings.data.siteTitle} />
        </PrismicNextLink>
        <nav>
          <ul>
            {navigation.data?.links.map((item) => (
              <li key={prismic.asText(item.label)}>
                <PrismicNextLink field={item.link}>
                  <PrismicText field={item.label} />
                </PrismicNextLink>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          {user ? (
            <Link href={DASHBOARD_ROUTES.DASHBOARD.ROUTE}>Dashboard</Link>
          ) : (
            <>
              <Link href={ROUTES.LOGIN.ROUTE}>Login</Link>
              <Link href={ROUTES.REGISTER.ROUTE}>Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
