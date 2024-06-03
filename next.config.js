const prismic = require("@prismicio/client");
const path = require('path');

const sm = require("./slicemachine.config.json");

/** @type {import('next').NextConfig} */
const nextConfig = async () => {
  const client = prismic.createClient(sm.repositoryName);

  const repository = await client.getRepository();
  const locales = repository.languages.map((lang) => lang.id);

  return {
    reactStrictMode: false,
    i18n: {
      // These are all the locales you want to support in
      // your application
      locales,
      // This is the default locale you want to be used when visiting
      // a non-locale prefixed path e.g. `/hello`
      defaultLocale: locales[0],
    },
    images: {
      domains: [
        'firebasestorage.googleapis.com',
        'lh3.googleusercontent.com',
      ],
    },
    sassOptions: {
      includePaths: [path.join(__dirname, 'src', 'styles')],
    },
  };
};

module.exports = nextConfig;
