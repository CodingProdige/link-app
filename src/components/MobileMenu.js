"use clients";
import React from 'react';
import styles  from '@/styles/mobileMenu.module.scss';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import * as prismic from '@prismicio/client';
import { PrismicText } from '@prismicio/react';
import { PrismicNextLink } from '@prismicio/next';
import Link from 'next/link';
import { ROUTES, DASHBOARD_ROUTES } from '@/lib/constants';

const MobileMenu = ({ isOpen, navigation, user }) => {
    const pathname = usePathname();

    return (
        <div className={clsx(styles.dropdownMenu, { [styles.open]: isOpen })}>
            <nav className={styles.mobileMenuNav}>
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
            <div className={styles.profileButtonsMobile}>
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
        </div>
    );
};

export default MobileMenu;
