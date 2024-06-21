import axios from 'axios';
import admin from '@/firebase/firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';

const bucket = admin.storage().bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);

export async function POST(request: Request) {
  try {
    const { imageUrl, userId } = await request.json();

    // Download the image from the given URL
    const response = await axios({
      url: imageUrl,
      responseType: 'stream',
    });

    const fileName = `users/${userId}/images/${Date.now()}_${imageUrl.split('/').pop()}`;
    const file = bucket.file(fileName);

    return new Promise<Response>((resolve, reject) => {
      const stream = response.data.pipe(
        file.createWriteStream({
          metadata: {
            contentType: response.headers['content-type'],
          },
        })
      );

      stream.on('error', (error) => {
        reject(new Response(JSON.stringify({ error: error.message }), { status: 500 }));
      });

      stream.on('finish', async () => {
        try {
          // Get the URL of the uploaded image
          const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-09-2491',
          });

          resolve(new Response(JSON.stringify({ imageUrl: url }), { status: 200 }));
        } catch (error) {
          reject(new Response(JSON.stringify({ error: error.message }), { status: 500 }));
        }
      });
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
