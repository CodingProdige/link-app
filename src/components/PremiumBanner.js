import React from 'react'
import styles from '@/styles/premiumBanner.module.scss'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const PremiumBanner = () => {
    const router = useRouter()
    const handleGoPremiumClick = () => router.push('/dashboard/premium');

  return (
    <div className={styles.premiumBanner}>
        <div className={styles.banner}>
            <div className={styles.bannerInfo}>
                <h2>Go Premium</h2>
                <p>
                Unlock all the features you need to make your Fanslink page stand out and uniquely tailored to your brand and audience. 
                </p>
                <ul>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightning-charge" viewBox="0 0 16 16">
                            <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41z"/>
                        </svg>
                        Unlimited links: Connect all your important content in one place.
                    </li>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightning-charge" viewBox="0 0 16 16">
                            <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41z"/>
                        </svg>
                        Track visitor analytics: Gain insights into who is visiting your page and what they are engaging with.
                    </li>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightning-charge" viewBox="0 0 16 16">
                            <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41z"/>
                        </svg>
                        Priority support: Get help when you need it with our dedicated support team.
                    </li>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightning-charge" viewBox="0 0 16 16">
                            <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41z"/>
                        </svg>
                        Remove the Fanslink branding
                    </li>
                </ul>
                <button onClick={() => handleGoPremiumClick } >
                    Go Premium Now
                </button>
            </div>

            <div className={styles.bannerImage}>
                <Image 
                    src="https://firebasestorage.googleapis.com/v0/b/linkapp-a5ccb.appspot.com/o/Platform%20Images%2FCustomize%20.png?alt=media&token=3619f6dc-75f2-4948-8d19-417ac33b69b6" 
                    alt="Premium" 
                    width={500} 
                    height={500} 
                />
            </div>
        </div>
    </div>
  )
}

export default PremiumBanner