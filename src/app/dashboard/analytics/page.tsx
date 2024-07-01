// components/Analytics.js
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/auth';
import { usePrismic } from '@/context/PrismicContext';
import { fetchUserAnalytics } from '@/utils/firebaseUtils';
import Loading from '@/components/Loading';
import AnalyticsChart from '@/components/AnalyticsChart';

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

  const prepareChartData = (data) => {
    const titles = [];
    const visits = [];
    const clicks = [];
    const hovers = [];
  
    data.links.forEach(link => {
      titles.push(link.title || `Link ${link.id}`);
      visits.push(link.visits || 0);
      clicks.push(link.clicks || 0);
      hovers.push(link.hovers || 0);
    });
  
    return { titles, visits, clicks, hovers };
  };
  
  const chartData = analyticsData ? prepareChartData(analyticsData) : null;

  return (
    <div>
      <h1>Analytics for {user.displayName || user.email}</h1>
      {analyticsData ? (
        <div>
          <p>Visits: {analyticsData.visits}</p>
          <p>Last Visit: {analyticsData.lastVisit ? new Date(analyticsData.lastVisit).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + ' at ' + new Date(analyticsData.lastVisit).toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric', hour12: true }) : 'N/A'}</p>
          <p>Mobile Visits: {analyticsData.mobile || 0}</p>
          <p>Desktop Visits: {analyticsData.desktop || 0}</p>
          <p>Last Location: {analyticsData.lastLocation || 'N/A'}</p>
          <h2>Referrers</h2>
          <ul>
            {analyticsData.referrers && analyticsData.referrers.map((referrer, index) => (
              <li key={index}>{referrer}</li>
            ))}
          </ul>

          <h2>Link Analytics</h2>
          {analyticsData.links && analyticsData.links.map(link => (
            <div key={link.id}>
              <h3>{link.title || `Link ${link.id}`}</h3>
              <p>Clicks: {link.clicks}</p>
              <p>Hovers: {link.hovers}</p>
            </div>
          ))}

          {chartData && <AnalyticsChart data={chartData} />}
        </div>
      ) : (
        <p>No analytics data available.</p>
      )}
    </div>
  );
}
