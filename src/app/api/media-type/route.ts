import fetch from 'node-fetch';
import cheerio from 'cheerio';

const getMetadata = async (url) => {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const metadata = {};
        $('meta[property^="og:"]').each((_, element) => {
            const property = $(element).attr('property');
            const content = $(element).attr('content');
            if (property && content) {
                metadata[property] = content;
            }
        });

        return metadata;
    } catch (error) {
        console.error('Error fetching metadata:', error);
        return null;
    }
};

const determineMediaType = (metadata) => {
    if (metadata['og:type']) {
        return metadata['og:type'];
    }
    if (metadata['og:video']) {
        return 'video';
    }
    if (metadata['og:audio']) {
        return 'audio';
    }
    return 'unknown';
};

export async function POST(request) {
    const { url } = await request.json();

    if (!url) {
        return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400 });
    }

    const metadata = await getMetadata(url);

    if (!metadata) {
        return new Response(JSON.stringify({ error: 'Error fetching metadata' }), { status: 500 });
    }

    const mediaType = determineMediaType(metadata);

    return new Response(JSON.stringify({ mediaType, metadata }), { status: 200 });
}
