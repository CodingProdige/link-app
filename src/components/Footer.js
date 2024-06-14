"use client";
import React, { useState, useEffect } from 'react';
import { usePrismic } from '@/context/PrismicContext';
import styles from '@/styles/footer.module.scss';
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import Link from 'next/link';
import Image from 'next/image';
import { ROUTES, DASHBOARD_ROUTES } from '@/lib/constants';
import { useAuth } from '@/firebase/auth';
import { usePathname } from 'next/navigation';


export default function Footer({ settings, footer }) {
    const [footerStyles, setFooterStyles] = useState({});
    const [subTextStyles, setSubTextStyles] = useState({});
    const { user } = useAuth();
    const pathname = usePathname();

    useEffect(() => {
        if (footer?.data?.background_color) {
            setFooterStyles({
                backgroundColor: footer.data.background_color,
            });
        } else if (footer?.data?.background_image?.url) {
            setFooterStyles({
                backgroundImage: `url("${footer.data.footer_background_image.url}")`,
            });
        }

        if (footer?.data?.sub_text_color) {
            setSubTextStyles({
                color: footer.data.sub_text_color,
            });
        }
    }, [settings, footer]);

    const hasLinkMenu = (menuName) => {
        return footer?.data?.link?.some(item => item.link_menu === menuName);
    }

    // Do not render header on login and register pages
    if ( pathname === '/signin' || pathname === '/signup' || pathname.includes('dashboard') || pathname.includes('user')) {
        return null;
    }

    return (
        <footer className={styles.footer} style={footerStyles}>
            <div className={styles.footerOuterContainer}>
                <div className={styles.footerInnerContainer}>
                    <div className={styles.footerMenusContainer}>
                        {hasLinkMenu('Company') && (
                            <nav className={styles.footerCompanyMenu}>
                                <label>Company</label>
                                <ul>
                                    {footer?.data?.link
                                        .filter(item => item.link_menu === 'Company')
                                        .map((item, index) => (
                                            <li key={index}>
                                                <PrismicNextLink field={item.link_url}>
                                                    {item.link_label}
                                                </PrismicNextLink>
                                            </li>
                                        ))}
                                </ul>
                            </nav>
                        )}

                        {hasLinkMenu('Community') && (
                            <nav className={styles.footerCommunityMenu}>
                                <label>Community</label>
                                <ul>
                                    {footer?.data?.link
                                        .filter(item => item.link_menu === 'Community')
                                        .map((item, index) => (
                                            <li key={index}>
                                                <PrismicNextLink field={item.link_url}>
                                                    {item.link_label}
                                                </PrismicNextLink>
                                            </li>
                                        ))}
                                </ul>
                            </nav>
                        )}

                        {hasLinkMenu('Support') && (
                            <nav className={styles.footerSupportMenu}>
                                <label>Support</label>
                                <ul>
                                    {footer?.data?.link
                                        .filter(item => item.link_menu === 'Support')
                                        .map((item, index) => (
                                            <li key={index}>
                                                <PrismicNextLink field={item.link_url}>
                                                    {item.link_label}
                                                </PrismicNextLink>
                                            </li>
                                        ))}
                                </ul>
                            </nav>
                        )}

                        {hasLinkMenu('Legal') && (
                            <nav className={styles.footerLegalMenu}>
                                <label>Legal</label>
                                <ul>
                                    {footer?.data?.link
                                        .filter(item => item.link_menu === 'Legal')
                                        .map((item, index) => (
                                            <li key={index}>
                                                <PrismicNextLink field={item.link_url}>
                                                    {item.link_label}
                                                </PrismicNextLink>
                                            </li>
                                        ))}
                                </ul>
                            </nav>
                        )}
                    </div>

                    <div className={styles.footerSocialContainer}>
                        <div className={styles.footerCtaButtons}>
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
                        <div className={styles.footerSocialIconsContainer}>
                            {footer?.data?.social_links?.map((item, index) => (
                                <Link key={index} href={item.social_link.url} target='_blank' >
                                    <PrismicNextImage field={item.social_icon} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.footerLogoContainer}>
                    <PrismicNextImage field={settings?.data?.logo} />
                </div>

                <p className={styles.footerSubText} style={subTextStyles}>{new Date().getFullYear()} {footer?.data?.footer_sub_text}</p>

            </div>
        </footer>
    );
}
