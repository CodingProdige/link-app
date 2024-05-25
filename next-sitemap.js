const fs = require('fs');
const path = require('path');

const generateSitemap = async () => {
  const baseUrl = 'https://fansl.ink';

  const staticPages = [
    `${baseUrl}`,
    `${baseUrl}/auth/login`,
    `${baseUrl}/auth/register`,
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages
      .map((url) => {
        return `<url>
          <loc>${url}</loc>
        </url>`;
      })
      .join('')}
  </urlset>`;

  const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`Sitemap generated and saved to ${sitemapPath}`);
};

generateSitemap().catch((err) => {
  console.error('Error generating sitemap:', err);
});
