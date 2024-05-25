// Usage: Generate a sitemap.xml file for a Next.js site using Prismic as a headless CMS
import { MetadataRoute } from 'next';
import { createClient } from '@prismicio/client';

const client = createClient('https://link-app.cdn.prismic.io/api/v2');
const baseUrl = 'https://fansl.ink/';

async function fetchPrismicPages() {
  const documents = await client.getAllByType('page');
  return documents.map(doc => ({
    url: `${baseUrl}${doc.uid}`,
    lastModified: new Date(doc.last_publication_date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const prismicPages = await fetchPrismicPages();
  
  // Manually added pages
  const manualPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Combine prismic pages with manual pages
  const allPages = [...prismicPages, ...manualPages];

  // Update the changeFrequency property of each page object to be one of the allowed values
  const updatedPages = allPages.map(page => ({
    ...page,
    changeFrequency: 'monthly' as const, // Replace 'monthly' with the desired value
  }));

  return updatedPages;
}
