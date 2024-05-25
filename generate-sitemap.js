// Usage: node generate-sitemap.js
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://fansl.ink';

const staticPaths = [
  '',
  'auth/login',
  'auth/register',
  // Add all your static paths here
];

const dynamicPaths = [
  // Example dynamic paths
  // You can dynamically fetch these from your CMS or API
];

const allPaths = [...staticPaths, ...dynamicPaths];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPaths.map(path => {
    return `
      <url>
        <loc>${baseUrl}/${path}</loc>
      </url>
    `;
  }).join('')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);

console.log('sitemap.xml has been generated');
