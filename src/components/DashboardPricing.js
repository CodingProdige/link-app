// components/Pricing.js
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/lib/firebaseConfig.ts';
import { DASHBOARD_ROUTES } from '@/app/lib/constants';
import { useRouter } from 'next/navigation'; // Correct import for Next.js 13+

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

  const checkSubscriptionStatus = async () => {
    const subscriptionQuery = query(
      collection(db, 'customers', currentUser.uid, 'subscriptions'),
      where('status', 'in', ['trialing', 'active'])
    );

    const subscriptionSnapshot = await getDocs(subscriptionQuery);
    return !subscriptionSnapshot.empty;
  };

  const handleCheckout = async (priceId) => {
    const hasActiveSubscription = await checkSubscriptionStatus();

    if (hasActiveSubscription) {
      alert('You already have a premium subscription.');
      router.push(DASHBOARD_ROUTES.DASHBOARD.ROUTE);
      return;
    }

    const docRef = await addDoc(collection(db, 'customers', currentUser.uid, 'checkout_sessions'), {
      price: priceId,
      success_url: window.location.origin + DASHBOARD_ROUTES.DASHBOARD.ROUTE,
      cancel_url: window.location.origin + DASHBOARD_ROUTES.DASHBOARD.ROUTE,
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Pricing</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products?.map((product) => (
          <div key={product.id} className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">{product.name}</h2>
            <p className="mb-4">{product.description}</p>
            {product.prices.map((price) => (
              <div key={price.id}>
                <p className="text-lg font-bold mb-4">
                  {price.currency ? price.currency.toUpperCase() : ''} {(price.unit_amount / 100).toFixed(2)}
                </p>
                <button
                  onClick={() => handleCheckout(price.id)}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
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
