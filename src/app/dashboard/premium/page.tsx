"use client";
import React from 'react';
import { useAuth } from '@/firebase/auth';
import Pricing from '@/components/DashboardPricing';

export default function Premium(){
    const { user, loading: authLoading } = useAuth();

    return (
        <div>
            <Pricing currentUser={user} />
        </div>
    )
}

