"use client";

import React from 'react';
import styles from '@/styles/loading.module.scss';

const Loading = () => {
  return (
    <div className={styles.loadingBarContainer}>
      <div className={styles.loadingBar}></div>
    </div>
  );
};

export default Loading;
