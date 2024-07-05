import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { fetchSettingsAndNavigation } from "@/lib/prismicClient";
import { Metadata } from 'next'

/**
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata() {
  const { settings, navigation, page, footer, faqs } = await fetchSettingsAndNavigation();
  const client = createClient();
  const pageMetaData = await client.getByUID("page", "home").catch(() => notFound());

  return {
    title: {
      template: pageMetaData.data.meta_title || '%s | Fanslink',
      default: pageMetaData.data.meta_title, // a default is required when creating a template
    },
    description: pageMetaData.data.meta_description,
    openGraph: {
      title: pageMetaData.data.meta_title,
      images: [
        {
          url: pageMetaData.data.meta_image.url,
        },
      ],
    },
    icons: {
      icon: settings?.data?.favicon?.url || "/default-favicon.png",
    },
  };
}


export default async function Page() {
  const client = createClient();
  const page = await client.getByUID("page", "home").catch(() => notFound());

  return <SliceZone slices={page.data.slices} components={components} />;
}
