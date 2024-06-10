"use client";

import React from 'react';
import styles from '@/styles/dashboardLayout.module.scss';
import { PrismicProvider, usePrismic } from '@/context/PrismicContext';
import Loading from '@/components/Loading';

const LayoutComponent = ({ children }) => {
  const { settings, navigation, page, loading: prismicLoading } = usePrismic();

  if (prismicLoading) {
    return <Loading />;
  }

  return (
    <div>
        {children}
    </div>
  );
};

const Layout = ({ children }) => {
  return (
    <PrismicProvider>
      <LayoutComponent>{children}</LayoutComponent>
    </PrismicProvider>
  );
};

export default Layout;
