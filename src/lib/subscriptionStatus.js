import { getFirestore, doc, getDocs, collection } from 'firebase/firestore';
import { useAuth } from '@/firebase/auth';

const CheckStripeSubscription = async () => {
    const { user: authUser } = useAuth();

  if (authUser) {
    const db = getFirestore();
    const subscriptionsRef = collection(db, `customers/${authUser.uid}/subscriptions`);
    const subscriptionsSnapshot = await getDocs(subscriptionsRef);

    if (!subscriptionsSnapshot.empty) {
      const activeSubscription = subscriptionsSnapshot.docs.find(sub => sub.data().status === 'active');
      return !!activeSubscription;
    }
  }

  return false;
};

export default CheckStripeSubscription;
