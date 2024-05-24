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
  return { settings, navigation };
}

export default async function RootLayout({ children }) {
  const { settings, navigation } = await fetchSettingsAndNavigation();

  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow" />
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
