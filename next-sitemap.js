// next-sitemap.js

import { createClient } from './src/prismicio';

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://fansl.ink',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      // { userAgent: '*', disallow: '/some-path' } // Disallow specific paths if needed
    ],
  },
  additionalPaths: async (config) => {
    const client = createClient();
    const allPages = await client.getAllByType('page');

    const dynamicPaths = allPages.map(page => ({
      loc: `/${page.uid}`, // Adjust this to match your dynamic route structure
      changefreq: 'daily',
      priority: 0.7,
    }));

    return [
      ...dynamicPaths,
    //   {
    //     loc: '/custom-page',
    //     changefreq: 'daily',
    //     priority: 0.7,
    //   },
    //   {
    //     loc: '/another-custom-page',
    //     changefreq: 'weekly',
    //     priority: 0.5,
    //   },
    ];
  },
};
