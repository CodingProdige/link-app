import React from 'react';
import styles from '@/styles/paymentSuccess.module.scss';

export default function Success() {
    return (
        <div className={styles.successContainer}>
            <h1 className={styles.title}>Payment Success</h1>
            <p className={styles.message}>Thank you for your payment. Your transaction was successful.</p>
        </div>
    );
}
