// app/layout.js
import "@/styles/globals.scss";
import { PrismicPreview } from "@prismicio/next";
import { repositoryName, createClient } from "@/prismicio";
import { AuthProvider } from '@/contexts/AuthContext';
import ClientHeader from '@/components/ClientHeader';

async function fetchSettingsAndNavigation() {
  const client = createClient();
  const settings = await client.getSingle("settings");
  const navigation = await client.getSingle("navigation");
  const page = await client.getByUID("page", "home");
  return { settings, navigation, page };
}

export default async function RootLayout({ children }) {
  const { settings, navigation, page } = await fetchSettingsAndNavigation();

  return (
    <html lang="en">
      <head>
        <meta name="title" content={page.data.page_title} />
        <meta name="description" content={page.data.meta_description} />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="favicon" content={settings.data.favicon.url} />
      </head>
      <body>
        <AuthProvider>
          <ClientHeader settings={settings} navigation={navigation} />
          {children}
        </AuthProvider>
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
