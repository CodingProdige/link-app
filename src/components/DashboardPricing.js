// components/Pricing.js
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { DASHBOARD_ROUTES, PAYMENT_ROUTES } from '@/lib/constants';
import { useRouter } from 'next/navigation'; // Correct import for Next.js 13+
import styles from '@/styles/dashboardPricing.module.scss';
import { checkSubscriptionStatus } from '@/utils/firebaseUtils'; // Import the utility function

const Pricing = ({ currentUser }) => {
  const [products, setProducts] = useState([]);
  const router = useRouter(); // Correct usage of useRouter

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'products');
      const activeProductsQuery = query(productsCollection, where('active', '==', true));
      const productsSnapshot = await getDocs(activeProductsQuery);
      const productsList = [];

      for (const productDoc of productsSnapshot.docs) {
        const productData = productDoc.data();
        const priceSnap = await getDocs(collection(productDoc.ref, 'prices'));
        const prices = priceSnap.docs.map(priceDoc => ({
          id: priceDoc.id,
          ...priceDoc.data(),
        }));

        productsList.push({
          id: productDoc.id,
          ...productData,
          prices,
        });
      }

      setProducts(productsList);
    };

    fetchProducts();
  }, []);

  const handleCheckout = async (priceId) => {
    const hasActiveSubscription = await checkSubscriptionStatus(currentUser.uid);

    if (hasActiveSubscription) {
      alert('You already have a premium subscription.');
      return;
    }

    const docRef = await addDoc(collection(db, 'customers', currentUser.uid, 'checkout_sessions'), {
      price: priceId,
      success_url: window.location.origin + PAYMENT_ROUTES.SUCCESS.ROUTE,
      cancel_url: window.location.origin + PAYMENT_ROUTES.FAILED.ROUTE,
    });

    onSnapshot(docRef, (snap) => {
      const { error, url } = snap.data();
      if (error) {
        alert(`An error occurred: ${error.message}`);
      }
      if (url) {
        window.location.assign(url);
      }
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pricing</h1>
      <div className={styles.grid}>
        {products?.map((product) => (
          <div key={product.id} className={styles.card}>
            <h2 className={styles.cardTitle}>{product.name}</h2>
            <p className={styles.cardDescription}>{product.description}</p>
            {product.prices.map((price) => (
              <div key={price.id}>
                <p className={styles.price}>
                  {price.currency ? price.currency.toUpperCase() : ''} {(price.unit_amount / 100).toFixed(2)}
                </p>
                <button
                  onClick={() => handleCheckout(price.id)}
                  className={styles.button}
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
