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
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";

export default async function RootLayout({ children }) {
  const { settings, navigation, page, footer, faqs } = await fetchSettingsAndNavigation();

  if (!settings || !navigation || !page || !footer || !faqs) {
    return <Loading/>
  }

  return (
    <html lang="en">
      <head>
        <title>{page?.data?.page_title || "Default Title"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="title" content={page?.data?.page_title || "Default Title"} />
        <meta name="description" content={page?.data?.meta_description || "Default Description"} />
        {settings?.data?.noIndex && <meta name="robots" content="noindex" />}
        {settings?.data?.noFollow && <meta name="robots" content="nofollow" />}
        <meta name="favicon" content={settings?.data?.favicon?.url || "/default-favicon.png"} />
        <link rel="icon" href={settings?.data?.favicon?.url || "/default-favicon.png"} type="image/png" />
        {settings?.data?.openGraphImage && (
          <>
            <meta property="og:type" content="website" />
            <meta property="og:url" content={"https://fansl.ink/"} />
            <meta property="og:title" content={page?.data?.meta_title || "Default OG Title"} />
            <meta property="og:description" content={page?.data?.meta_description || "Default OG Description"} />
            <meta property="og:image" content={settings?.data?.meta_image?.url || "/default-og-image.png"} />
          </>
        )}
        <GoogleAnalytics trackingId={settings?.data?.googleAnalyticsTag} />
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
