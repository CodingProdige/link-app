// lib/customerPortal.js
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/app/lib/firebaseConfig.ts'; // Import your Firebase config

export const createCustomerPortal = async () => {
  try {
    const functionRef = httpsCallable(functions, 'ext-firestore-stripe-payments-createPortalLink');
    const { data } = await functionRef({
      returnUrl: window.location.origin,
      locale: "auto", // Optional, defaults to "auto"
      // configuration: "your_configuration_id_here", // Uncomment and replace with your actual configuration ID if needed
    });
    window.location.assign(data.url);
  } catch (error) {
    console.error("Error creating customer portal:", error);
    alert("An error occurred while creating the customer portal. Please try again.");
  }
};
