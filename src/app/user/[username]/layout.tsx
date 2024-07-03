import { fetchUserDataByUsername } from '@/utils/firebaseUtils';
import { fetchSettingsAndNavigation } from '@/lib/prismicClient';
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const userData = await fetchUserDataByUsername(params.username);
  const { settings } = await fetchSettingsAndNavigation();

  if (!userData) {
    return {
      title: 'User Not Found',
      description: 'This user does not exist.',
    };
  }

  return {
    title: userData?.metaData?.title || 'Fanslink User Profile',
    description: userData?.metaData?.description,
    openGraph: {
      title: userData?.openGraph?.title || userData?.username,
      description: userData?.openGraph?.description || userData?.bio,
      url: `https://fansl.ink/user/${userData?.username}`,
      siteName: 'Fanslink',
      images: [
        {
          url: userData?.openGraph?.image,
          width: 800,
          height: 600,
        },
        {
          url: userData.openGraph?.image,
          width: 1800,
          height: 1600,
          alt: userData.openGraph?.title,
        },
      ],
      type: 'website',
    },
    icons: {
      icon: settings?.data?.favicon?.url || '/default-favicon.png',
    },
  };
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
