import { notFound } from "next/navigation";
import { asText } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { fetchSettingsAndNavigation } from "@/lib/prismicClient";



/**
 * @typedef {{ uid: string }} Params
 */

/**
 * @param {{ params: Params }}
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata({ params }) {
  const { settings } = await fetchSettingsAndNavigation();
  const client = createClient();
  const page = await client
    .getByUID("page", params.uid)
    .catch(() => notFound());

    return {
      title: {
        template: page.data.meta_title || '%s | Fanslink',
        default: page.data.meta_title, // a default is required when creating a template
      },
      description: page.data.meta_description,
      openGraph: {
        title: page.data.meta_title,
        images: [
          {
            url: page.data.meta_image.url,
          },
        ],
      },
      icons: {
        icon: settings?.data?.favicon?.url || "/default-favicon.png",
      },
    };
}

/**
 * @param {{ params: Params }}
 */
export default async function Page({ params }) {
  const client = createClient();
  const page = await client
    .getByUID("page", params.uid)
    .catch(() => notFound());

  return (
    <>
      <SliceZone slices={page.data.slices} components={components} />
    </>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType("page");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
