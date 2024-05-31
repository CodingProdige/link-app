// components/ClientHeader.js
'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import { useState } from 'react';
import { useAuth } from '@/firebase/auth';

export default function ClientHeader({ settings, navigation }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  

  const toggleMenu = () => {
    console.log('Toggle menu called');
    setIsOpen(!isOpen);
  };

  return <Header settings={settings} navigation={navigation} pathname={pathname} user={user} isOpen={isOpen} toggleMenu={toggleMenu} />;
}
