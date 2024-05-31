// Code: Layout for the Dashboard
import React from 'react'
import styles from '@/styles/dashboardLayout.module.scss';
import { createClient } from '@/prismicio';

import DashboardNav from '@/components/DashboardNav';

async function fetchSettingsAndNavigation() {
    const client = createClient();
    const settings = await client.getSingle("settings");
    const navigation = await client.getSingle("navigation");
    const page = await client.getByUID("page", "home");
    return { settings, navigation, page };
  }


const layout = async ({children}) => {
  const { settings, navigation, page } = await fetchSettingsAndNavigation();


  return (
    <div className={styles.dashboard}>
        <div className={styles.navContainer}>
            <DashboardNav settings={settings}/>
        </div>
        <div className={styles.dashboardContent}>
            {children}
        </div>
    </div>
  )
}

export default layout