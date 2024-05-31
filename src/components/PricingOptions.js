import { useEffect, useState } from "react";
import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import { ROUTES, DASHBOARD_ROUTES } from "@/app/lib/constants";
import { createClient } from "@/prismicio";
import styles from "@/styles/pricingOptions.module.scss";
import { CiCircleCheck } from "react-icons/ci";
import clsx from "clsx";

export default function PricingOptions({slice}) {
    const { user } = useAuth();
    const client = createClient();
    const [pricingOptions, setPricingOptions] = useState(null);
    const router = useRouter();
    const renderFeatures = (price_id) => {
        switch (price_id) {
            case 'free':
                return (
                    <>
                        <li><CiCircleCheck style={{color: slice.primary.features_icon_color}}/> Unlimited links</li>
                    </>
                );
            case 'premium_monthly':
                return (
                    <>
                        <li><CiCircleCheck style={{color: slice.primary.features_icon_color}}/> Advanced customization options</li>
                        <li><CiCircleCheck style={{color: slice.primary.features_icon_color}}/> Conversion tracking</li>
                        <li><CiCircleCheck style={{color: slice.primary.features_icon_color}}/> Priority support</li>
                        <li><CiCircleCheck style={{color: slice.primary.features_icon_color}}/> Advanced analytics</li>
                    </>
                );
            case 'premium_yearly':
                return (
                    <>
                        <li><CiCircleCheck style={{color: slice.primary.features_icon_color}}/> Advanced customization options</li>
                        <li><CiCircleCheck style={{color: slice.primary.features_icon_color}}/> Conversion tracking</li>
                        <li><CiCircleCheck style={{color: slice.primary.features_icon_color}}/> Priority support</li>
                        <li><CiCircleCheck style={{color: slice.primary.features_icon_color}}/> Advanced analytics</li>
                        <li><CiCircleCheck style={{color: slice.primary.features_icon_color}}/> Option to hide Linktree logo</li>
                    </>
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        const fetchPricingOptions = async () => {
            const data = await client.getSingle("pricing_options");
            setPricingOptions(data);
        };

        fetchPricingOptions();
    }, [client]);

    if (!pricingOptions) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <section className={styles.pricingOptionsSection} style={{backgroundColor: slice.primary.background_color}}>
            <div className={styles.pricingContainer}>
                {
                    pricingOptions.data?.price_option.map((option, index) => {
                        return (
                            <div key={index} className={styles.pricingOption}>
                                <div className={styles.pricingOptionHeader} style={{ 
                                    backgroundColor: option.price_id === "premium_yearly" ? slice.primary.popular_header_color : slice.primary.basic_header_color 
                                }}>
                                    <h2 className={styles.pricingOptionTitle}>{option.title}</h2>
                                </div>
                                <ul className={styles.pricingOptionFeatures}>
                                    {renderFeatures(option.price_id)}
                                </ul>
                                <div className={styles.pricingOptionSummary}>
                                    <p className={styles.pricingOptionPrice}>{option.price}</p>
                                    <p className={styles.pricingOptionDescription}>{option.description}</p>
                                </div>
                                <div className={styles.buttonContainer}>
                                    {
                                        user ? (
                                            <button
                                                className={styles.joinButton}
                                                onClick={() => router.push(DASHBOARD_ROUTES.DASHBOARD.ROUTE)}
                                            >
                                                Join {option.title}
                                            </button>
                                        ) : (
                                            <button
                                                className={styles.joinButton}
                                                onClick={() => router.push(ROUTES.LOGIN.ROUTE)}
                                            >
                                                Join {option.title}
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </section>
    );
}
