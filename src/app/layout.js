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
import { fetchSettingsAndNavigation } from "@/lib/prismicClient";

export default async function RootLayout({ children }) {
  const { settings, navigation, page } = await fetchSettingsAndNavigation();

  if (!settings || !navigation || !page) {
    return (
      <html lang="en">
        <head>
          <title>Error</title>
        </head>
        <body>
          <div>Error loading site settings. Please try again later.</div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <title>{page.data.page_title}</title>
        <meta name="title" content={page.data.page_title} />
        <meta name="description" content={page.data.meta_description} />
        {settings.data.noIndex && <meta name="robots" content="noindex" />}
        {settings.data.noFollow && <meta name="robots" content="nofollow" />}
        <meta name="favicon" content={settings.data.favicon.url} />
        <link rel="icon" href={settings.data.favicon.url} type="image/png" />
        {settings.data.openGraphImage && (
          <>
            <meta property="og:type" content="website" />
            <meta property="og:url" content={"https://fansl.ink/"} />
            <meta property="og:title" content={page.data.meta_title} />
            <meta property="og:description" content={page.data.meta_description} />
            <meta property="og:image" content={settings.data.meta_image.url} />
          </>
        )}
        <GoogleAnalytics trackingId={settings.data.googleAnalyticsTag} />
      </head>
      <body>
        <AuthProvider>
          <PrismicProvider>
            <ClientHeader settings={settings} navigation={navigation} />
            {children}
            <Analytics />
            <SpeedInsights />
          </PrismicProvider>
        </AuthProvider>
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
