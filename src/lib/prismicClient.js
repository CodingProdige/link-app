import { createClient } from "@/prismicio";

/**
 * Fetches the latest master reference from Prismic.
 */
const fetchLatestRef = async () => {
  try {
    const response = await fetch(`https://${process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT}.cdn.prismic.io/api/v2`);
    const data = await response.json();
    const masterRef = data.refs.find(ref => ref.id === 'master');
    if (!masterRef) {
      throw new Error("Master ref not found");
    }
    return masterRef.ref;
  } catch (error) {
    console.error("Failed to fetch the latest ref:", error);
    throw error;
  }
};

/**
 * Fetches data from Prismic with the given ref.
 * Retries once if the ref has expired.
 */
const fetchDataWithLatestRef = async (client, ref) => {
  try {
    console.log("Fetching data with ref:", ref);
    const settings = await client.getSingle("settings", { ref });
    const navigation = await client.getSingle("navigation", { ref });
    const footer = await client.getSingle("footer", { ref });
    const faqs = await client.getSingle("faqs", { ref });
    const page = await client.getByUID("page", "home", { ref });

    return { settings, navigation, page, footer, faqs };
  } catch (error) {
    if (error.type === 'RefExpiredError') {
      console.warn("Ref expired, fetching the latest ref and retrying...");
      const latestRef = await fetchLatestRef();
      console.log("Retrying with new ref:", latestRef);
      return fetchDataWithLatestRef(client, latestRef);
    } else {
      console.error("Error fetching data with ref:", error);
      throw error;
    }
  }
};

export async function fetchSettingsAndNavigation() {
  try {
    const client = createClient();
    const latestRef = await fetchLatestRef();
    console.log("Latest ref fetched:", latestRef);
    return await fetchDataWithLatestRef(client, latestRef);
  } catch (error) {
    console.error("Failed to fetch settings and navigation:", error);
    return { settings: null, navigation: null, page: null, footer: null, faqs: null };
  }
}
