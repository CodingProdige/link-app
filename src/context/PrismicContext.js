"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchSettingsAndNavigation } from '@/lib/prismicClient';

const PrismicContext = createContext();

export const usePrismic = () => {
  return useContext(PrismicContext);
};

export const PrismicProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [navigation, setNavigation] = useState(null);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const { settings, navigation, page } = await fetchSettingsAndNavigation();
        setSettings(settings);
        setNavigation(navigation);
        setPage(page);
      } catch (error) {
        console.error('Error fetching Prismic data:', error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <PrismicContext.Provider value={{ settings, navigation, page, loading }}>
      {children}
    </PrismicContext.Provider>
  );
};
