import React from 'react';
import styles from '@/styles/paymentFailed.module.scss';

export default function Failed() {
    return (
        <div className={styles.failedContainer}>
            <h1 className={styles.title}>Payment Failed</h1>
            <p className={styles.message}>Sorry, your payment was not successful. Please try again.</p>
        </div>
    );
}
