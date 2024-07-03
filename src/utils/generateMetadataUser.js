
import { fetchSettingsAndNavigation } from "@/lib/prismicClient";
import { fetchUserDataByUsername } from "@/utils/firebaseUtils";

/**
 * @returns {Promise<import("next").Metadata>}
 */
export default async function generateMetadata({ username }) {
    const userData = await fetchUserDataByUsername(username);
    const { settings, navigation, page, footer, faqs } = await fetchSettingsAndNavigation();
  
    
    return {
      title: {
        template: userData.metaData.title || '%s | Fanslink',
        default: userData.metaData.title, // a default is required when creating a template
      },
      description: userData.metaData.description,
      openGraph: {
        title: userData.openGraph.title || userData.username,
        description: userData.openGraph.description || userData.bio,
        url: `https://fansl.ink/user/${userData.username}`,
        siteName: 'Fanslink',
        images: [
          {
            url: userData.openGraph.image, // Must be an absolute URL
            width: 800,
            height: 600,
          },
          {
            url: userData.openGraph.image, // Must be an absolute URL
            width: 1800,
            height: 1600,
            alt: userData.openGraph.title,
          },
        ],
        type: 'website',
      },
      icons: {
        icon: settings?.data?.favicon?.url || "/default-favicon.png",
      },
    };
  }