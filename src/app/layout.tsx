// app/layout.js
import "@/styles/globals.scss";
import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";
import ClientHeader from '@/components/ClientHeader';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from '@/firebase/auth';
import { PrismicProvider } from '@/context/PrismicContext';
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import { fetchSettingsAndNavigation } from "@/lib/prismicClient";
import GoogleTagManager from "@/components/GoogleTagManager";

/**
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata({ username }) {
    const { settings, navigation, page, footer, faqs } = await fetchSettingsAndNavigation();
  
    
    return {
      title: {
        template: '%s | Fanslink',
        default: 'Fanslink', // a default is required when creating a template
      },
      description: 'Fanslink is a platform that allows you to create a custom profile page with links to your social media, music, videos, and more.',
      icons: {
        icon: settings?.data?.favicon?.url || "/default-favicon.png",
      },
    };
  }

export default async function RootLayout({ children }) {
  const { settings, navigation, page, footer, faqs } = await fetchSettingsAndNavigation();

  if (!settings || !navigation || !page || !footer || !faqs) {
    return <Loading/>
  }

  return (
    <html lang="en">
      <head>
        <GoogleAnalytics trackingId={settings?.data?.googleAnalyticsTag} />
        <script defer src="//widget.tagembed.com/embed.min.js" type="text/javascript"></script>
        <GoogleTagManager trackingId="G-Z8FL8Y30PF" />
      </head>
      <body>
        <AuthProvider>
          <PrismicProvider>
            <ClientHeader settings={settings} navigation={navigation} />
            {children}
            <Footer settings={settings} footer={footer}/>
            <Analytics />
            <SpeedInsights />
          </PrismicProvider>
        </AuthProvider>
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
