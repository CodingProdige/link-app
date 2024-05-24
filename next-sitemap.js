import { createClient } from './src/prismicio';

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://fansl.ink',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      // { userAgent: '*', disallow: '/some-path' } // Disallow specific paths if needed
    ],
  },
  additionalPaths: async (config) => {
    const client = createClient();
    let allPages = [];

    try {
      allPages = await client.getAllByType('page');
    } catch (error) {
      console.error('Error fetching pages from Prismic:', error);
    }

    const dynamicPaths = allPages.map(page => ({
      loc: `/${page.uid}`, // Adjust this to match your dynamic route structure
      changefreq: 'daily',
      priority: 0.7,
    }));

    return [
      ...dynamicPaths,
      // Add any other static paths if necessary
    ];
  },
};
