// components/ClientHeader.js
"use client";

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ClientHeader({ settings, navigation, user }) {
  const pathname = usePathname();
  return <Header settings={settings} navigation={navigation} pathname={pathname} user={user} />;
}
