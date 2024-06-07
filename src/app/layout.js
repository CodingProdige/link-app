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

  const pageTitle = page?.data?.page_title || "Default Title";
  const metaDescription = page?.data?.meta_description || "Default Description";
  const faviconUrl = settings?.data?.favicon?.url || "/favicon.ico";
  const metaImageUrl = settings?.data?.meta_image?.url || "/default-image.png";
  const googleAnalyticsTag = settings?.data?.googleAnalyticsTag || "";

  return (
    <html lang="en">
      <head>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={metaDescription} />
        {settings?.data?.noIndex && <meta name="robots" content="noindex" />}
        {settings?.data?.noFollow && <meta name="robots" content="nofollow" />}
        <meta name="favicon" content={faviconUrl} />
        <link rel="icon" href={faviconUrl} type="image/png" />
        {settings?.data?.openGraphImage && (
          <>
            <meta property="og:type" content="website" />
            <meta property="og:url" content={"https://fansl.ink/"} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImageUrl} />
          </>
        )}
        <GoogleAnalytics trackingId={googleAnalyticsTag} />
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
