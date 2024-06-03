// prismicClient.js
import { repositoryName, createClient } from "@/prismicio";

export async function fetchSettingsAndNavigation() {
  const client = createClient();
  const settings = await client.getSingle("settings");
  const navigation = await client.getSingle("navigation");
  const page = await client.getByUID("page", "home");
  return { settings, navigation, page };
}
