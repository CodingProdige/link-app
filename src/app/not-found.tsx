// pages/not-found.tsx

import Link from 'next/link';
import styles from '@/styles/notFound.module.scss'; // Make sure to create corresponding styles if needed

const Custom404 = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>404</h1>
      <p className={styles.errorMessage}>Oops! The page you are looking for does not exist.</p>
      <Link href="/">
        Go back home
      </Link>
    </div>
  );
};

export default Custom404;
