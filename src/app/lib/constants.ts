// lib/constants.ts
export const ROUTES = {
    HOME: {
        NAME:'Home',
        ROUTE:'/'
    },
    LOGIN: {
        NAME:'Login',
        ROUTE:'/auth/login'
    },
    REGISTER: {
        NAME:'Register',
        ROUTE:'/auth/register'
    },
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    // Add other routes as needed
};

export const DASHBOARD_ROUTES = {
    DASHBOARD: {
        NAME:'Dashboard',
        ROUTE:'/dashboard'
    },
    LINKS: {
        NAME:'Links',
        ROUTE:'/dashboard/links'
    },
    SETTINGS: {
        NAME:'Settings',
        ROUTE:'/dashboard/settings'
    },
    APPEARANCE: {
        NAME:'Appearance',
        ROUTE:'/dashboard/appearance'
    },
    ANALYTICS: {
        NAME:'Analytics',
        ROUTE:'/dashboard/analytics'
    }
    // Add other dashboard routes as needed
};