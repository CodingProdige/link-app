/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://fansl.ink',
  generateRobotsTxt: true, // Generate robots.txt file
  additionalPaths: async (config) => [
    { loc: '/', changefreq: 'daily', priority: 0.7 },
    { loc: '/about', changefreq: 'daily', priority: 0.7 },
    { loc: '/auth/login', changefreq: 'daily', priority: 0.7 },
    { loc: '/auth/register', changefreq: 'daily', priority: 0.7 },
  ],
  exclude: ['/secret-page', '/admin/*'], // Exclude specific routes
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://fansl.ink/sitemap.xml',
    ],
  },
  sitemapSize: 7000, // Maximum number of entries per sitemap file
  changefreq: 'daily', // Default change frequency
  priority: 0.7, // Default priority
};

module.exports = config;
