import { createClient } from "@/prismicio";

/**
 * Fetches the latest master reference from Prismic.
 */
const fetchLatestRef = async () => {
  const response = await fetch(`https://${process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT}.cdn.prismic.io/api/v2`);
  const data = await response.json();
  return data.refs.find(ref => ref.id === 'master').ref;
};

export async function fetchSettingsAndNavigation() {
  try {
    const client = createClient();
    const latestRef = await fetchLatestRef();

    const settings = await client.getSingle("settings", { ref: latestRef });
    const navigation = await client.getSingle("navigation", { ref: latestRef });
    const footer = await client.getSingle("footer", { ref: latestRef });
    const faqs = await client.getSingle("faqs", { ref: latestRef });
    const page = await client.getByUID("page", "home", { ref: latestRef });

    return { settings, navigation, page, footer, faqs };
  } catch (error) {
    console.error("Failed to fetch settings and navigation:", error);
    return { settings: null, navigation: null, page: null, footer: null, faqs: null};
  }
}
