// app/[username]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/userlinkPage.module.scss';
import { fetchUserDataByUsername, generateStaticParams } from '@/utils/firebaseUtils'

interface UserPageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata({ params }: UserPageProps) {
  const userData = await fetchUserDataByUsername(params.username).catch(() => notFound());

  return {
    openGraph: {
      title: userData.username,
      description: `Profile of ${userData.username}`,
      images: [
        {
          url: userData.photoUrl,
        },
      ],
    },
  };
}

export default async function Page({ params }: UserPageProps) {
  const userData = await fetchUserDataByUsername(params.username).catch(() => notFound());

  return (
    <div className={styles.containerPublicProfile}>
      <div className={styles.background}></div>
      <div className={styles.innerContainer}>
        <div className={styles.profileContainer}>
          {userData?.photoUrl && (
            <Image
              src={userData.photoUrl}
              alt={userData.username}
              width={150}
              height={150}
            />
          )}
          <p className={styles.username}>@{userData.username}</p>
        </div>
        {userData?.links && (
          <div className={styles.linksContainer}>
            <ul>
              {userData?.links.map((link: any) => (
                <Link href={link.link} key={link.id} target="_blank" rel="noopener noreferrer">
                  <li key={link.id}>
                    {link.title}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export { generateStaticParams };
