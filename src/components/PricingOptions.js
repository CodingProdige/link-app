import { useEffect, useState } from "react";
import {useAuth} from "@/app/lib/auth";
import { useRouter } from "next/navigation";
import { ROUTES, DASHBOARD_ROUTES } from "@/app/lib/constants";
import { createClient } from "@/prismicio";




export default function PricingOptions() {
    const { user } = useAuth();
    const client = createClient();
    const [pricingOptions, setPricingOptions] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPricingOptions = async () => {
            const data = await client.getSingle("pricing_options");
            setPricingOptions(data);
        };

        fetchPricingOptions();
    }, [client]);

    if (!pricingOptions) {
        return <div>Loading...</div>;
    }

    return (
        <section className="py-16 bg-slate-50">
            <div className="container">
                <div className="flex flex-col items-center justify-center gap-8">
                    <div className="grid grid-cols-1 gap-8 mt-8 sm:grid-cols-2 lg:grid-cols-3">
                        {
                            pricingOptions.data?.price_option.map((option, index) => {
                                return (
                                    <div key={index} className="p-8 bg-white rounded shadow-lg">
                                        <p>{option.title}</p>
                                        <p className="mt-4 text-lg text-slate-800">{option.description}</p>
                                        <p>{option.price}</p>
                                        <div className="mt-8">
                                            {
                                                user ? (
                                                    <button className="px-4 py-2 text-white bg-slate-800 rounded" onClick={() => router.push(DASHBOARD_ROUTES.DASHBOARD.ROUTE)}>Join {option.title}</button>
                                                ) : (
                                                    <button className="px-4 py-2 text-white bg-slate-800 rounded" onClick={() => router.push(ROUTES.LOGIN.ROUTE)}>Join {option.title}</button>
                                                )
                                            
                                            }
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </section>
    );
}
