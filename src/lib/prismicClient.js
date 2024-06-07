// prismicClient.js
import { createClient } from "@/prismicio";

export async function fetchSettingsAndNavigation() {
  try {
    const client = createClient();
    const settings = await client.getSingle("settings");
    const navigation = await client.getSingle("navigation");
    const page = await client.getByUID("page", "home");
    return { settings, navigation, page };
  } catch (error) {
    console.error("Failed to fetch settings and navigation:", error);
    return { settings: null, navigation: null, page: null };
  }
}
