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
  const [startinCheckout, setStartingCheckout] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

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
    try {
      setStartingCheckout(true);
      setSelectedProductId(priceId);
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
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setStartingCheckout(false);
      setSelectedProductId(null);
    }
  };

  return (
    <div className={styles.pricingPage}>

      <div className={styles.pricingCardsContainer}>
        {products?.map((product) => (
          <div key={product.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{product.name}</h2>
              {product.name === 'Premium Yearly' ? (
                <p className={styles.cardSupper}>Save 20% with the yearly plan</p>
              ) : (null)}
              <p className={styles.cardDescription}>{product.description}</p>
            </div>
            
            <ul className={styles.pricingFeatures}>
              <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightning-charge" viewBox="0 0 16 16">
                      <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41z"/>
                  </svg>
                  Unlimited links
              </li>
              <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightning-charge" viewBox="0 0 16 16">
                      <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41z"/>
                  </svg>
                  Track visitor analytics
              </li>
              <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightning-charge" viewBox="0 0 16 16">
                      <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41z"/>
                  </svg>
                  Priority support
              </li>
              <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightning-charge" viewBox="0 0 16 16">
                      <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41z"/>
                  </svg>
                  Remove the Fanslink branding
              </li>
            </ul>

            {product.prices.map((price) => (
              <div className={styles.buttonAndPriceContainer} key={price.id}>
                <p className={styles.price}>
                  {price.currency ? price.currency.toUpperCase() : ''} {(price.unit_amount / 100).toFixed(2)}
                </p>
                <button
                  onClick={() => handleCheckout(price.id)}
                  className={styles.button}
                >
                  {startinCheckout && selectedProductId === price.id ? 'Processing...' : 'Subscribe'}
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
