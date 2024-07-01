// components/Analytics.js
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/auth';
import { usePrismic } from '@/context/PrismicContext';
import { fetchUserAnalytics } from '@/utils/firebaseUtils';
import Loading from '@/components/Loading';
import AnalyticsChart from '@/components/AnalyticsChart';
import LinkAnalyticsChart from '@/components/LinkAnalyticsChart';
import ReferrerChart from '@/components/ReferrerChart';
import DailyVisitorChart from '@/components/DailyVisitorsChart';
import DeviceTypeChart from '@/components/DeviceTypeChart';
import TopLocationsChart from '@/components/TopLocationsChart';
import styles from '@/styles/dashboardAnalytics.module.scss';

export default function Analytics() {
  const { user, loading: authLoading } = useAuth();
  const { settings, loading: prismicLoading } = usePrismic();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAnalyticsData = async () => {
      if (!user) return;

      try {
        const data = await fetchUserAnalytics(user.uid);
        setAnalyticsData(data);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
      } finally {
        setLoading(false);
      }
    };

    getAnalyticsData();
  }, [user]);

  if (authLoading || prismicLoading || loading) {
    return <Loading />;
  }

  if (!user) {
    router.push('/login');
    return null;
  }



  return (
    <div className={styles.analyticsPage}>

        <div className={styles.analyticsCardsContainer}>

          <div className={styles.generalAnalyticsWrapper}>
            <h3>General Analytics</h3>  
            <div className={styles.generalAnalyticsContainer}>
              <div className={styles.analyticsCard}>
                <DailyVisitorChart visits={analyticsData ? analyticsData.visits : []} />
              </div>

              <div className={styles.analyticsCard}>
                <DeviceTypeChart visits={analyticsData ? analyticsData.visits : []} />
              </div>

              <div className={styles.analyticsCard}>
                <TopLocationsChart locations={analyticsData ? analyticsData.locations : []} />
              </div>

              <div className={styles.analyticsCard}>
                <ReferrerChart data={analyticsData ? analyticsData.referers : []} />
              </div>
            </div>
          </div>

          <div className={styles.analyticsLinksWrapper}>
            <h3>Link Analytics</h3>
            <div className={styles.analyticsLinksContainer}>
              {analyticsData && analyticsData.links ? analyticsData.links.map(link => (
                <div className={styles.analyticsCard} key={link.id}>
                  <h3>{link.title || `Link ${link.id}`}</h3>
                  <LinkAnalyticsChart link={link} />
                </div>
              )) : <p>No link analytics data available.</p>}
            </div>
          </div>
        </div>

    </div>
  );
}
