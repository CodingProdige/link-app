// lib/constants.ts
export const ROUTES = {
    HOME: {
        NAME:'Home',
        ROUTE:'/'
    },
    LOGIN: {
        NAME:'Signin',
        ROUTE:'/signin'
    },
    REGISTER: {
        NAME:'Signup',
        ROUTE:'/signup'
    },
    DASHBOARD: '/dashboard',
    ACCOUNT: {
        NAME:'Account',
        ROUTE_HANDLE:'account',
        ROUTE:'/dashboard/account'
    }
    // Add other routes as needed
};

export const PAYMENT_ROUTES = {
    SUCCESS: {
        NAME:'Payment Success',
        ROUTE:'/payment/success'
    },
    FAILED: {
        NAME:'Payment Failed',
        ROUTE:'/payment/failed'
    }
}

export const DASHBOARD_ROUTES = {
    DASHBOARD: {
        NAME:'Dashboard',
        ROUTE:'/dashboard'
    },
    LINKS: {
        NAME:'Links',
        ROUTE:'/dashboard/links',
        ICON: '<BsViewList />'
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
    },
    // Add other dashboard routes as needed
};

export const THEMES = [
    {
        NAME: 'Midnight',
        BACKGROUND: {
            backgroundColor: '#000',
        },
        BACKGROUND_VIDEO: {
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/linkapp-a5ccb.appspot.com/o/Platform%20Videos%2F6323827_Tunnel_Arch_1280x720.mp4?alt=media&token=5c1433b2-918d-4966-97bc-e4448ea12fc0',
        },
        PILLS: {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            borderRadius: '25px',
        },
        HEADER_TEXT: {
            color: '#FFFFFF',
        },
        TEXT: {
            color: '#000000',
        },
    },
    {
        NAME: 'Sunrise',
        BACKGROUND: {
            backgroundImage: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
        },
        PILLS: {
            backgroundColor: '#FFFFFF',
            color: '#FFA500',
            borderRadius: '25px',
            boxShadow: '3px 3px 0px 0px #000',
        },
        HEADER_TEXT: {
            color: '#FFFFFF',
        },
        TEXT: {
            color: '#000000',
        },
    },
    {
        NAME: 'Ocean',
        BACKGROUND: {
            backgroundImage: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
        },
        PILLS: {
            backgroundColor: '#FFFFFF',
            color: '#1E90FF',
            borderRadius: '20px',
        },
        HEADER_TEXT: {
            color: '#FFFFFF',
        },
        TEXT: {
            color: '#000000',
        },
    },
    {
        NAME: 'Forest',
        BACKGROUND: {
            backgroundColor: '#228B22',
        },
        PILLS: {
            backgroundColor: '#FFFFFF',
            color: '#228B22',
            borderRadius: '10px',
        },
        HEADER_TEXT: {
            color: '#FFFFFF',
        },
        TEXT: {
            color: '#000000',
        },
    },
    {
        NAME: 'Desert',
        BACKGROUND: {
            backgroundColor: '#EDC9AF',
        },
        PILLS: {
            backgroundColor: '#FFFFFF',
            color: '#EDC9AF',
            borderRadius: '25px',
        },
        HEADER_TEXT: {
            color: '#000000',
        },
        TEXT: {
            color: '#000000',
        },
    },
    {
        NAME: 'Lavender',
        BACKGROUND: {
            backgroundColor: '#E6E6FA',
        },
        PILLS: {
            backgroundColor: '#FFFFFF',
            color: '#E6E6FA',
            borderRadius: '25px',
        },
        HEADER_TEXT: {
            color: '#000000',
        },
        TEXT: {
            color: '#000000',
        },
    },
    {
        NAME: 'Ruby',
        BACKGROUND: {
            backgroundColor: '#9B111E',
        },
        PILLS: {
            backgroundColor: '#FFFFFF',
            color: '#9B111E',
            borderRadius: '25px',
        },
        HEADER_TEXT: {
            color: '#FFFFFF',
        },
        TEXT: {
            color: '#000000',
        },
    },
    {
        NAME: 'Mint',
        BACKGROUND: {
            backgroundColor: '#98FF98',
        },
        PILLS: {
            backgroundColor: '#FFFFFF',
            color: '#98FF98',
            borderRadius: '15px',
        },
        HEADER_TEXT: {
            color: '#000000',
        },
        TEXT: {
            color: '#000000',
        },
    },
    {
        NAME: 'Sunset',
        BACKGROUND: {
            backgroundColor: '#FF4500',
        },
        PILLS: {
            backgroundColor: '#FFFFFF',
            color: '#FF4500',
            borderRadius: '0px',
        },
        HEADER_TEXT: {
            color: '#FFFFFF',
        },
        TEXT: {
            color: '#000000',
        },
    },
    {
        NAME: 'Coral',
        BACKGROUND: {
            backgroundColor: '#FF7F50',
        },
        PILLS: {
            backgroundColor: '#FFFFFF',
            color: '#FF7F50',
            borderRadius: '25px',
        },
        HEADER_TEXT: {
            color: '#FFFFFF',
        },
        TEXT: {
            color: '#000000',
        },
    },
    {
        NAME: 'Ivory',
        BACKGROUND: {
            backgroundColor: '#FFFFF0',
        },
        BACKGROUND_VIDEO: {
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/linkapp-a5ccb.appspot.com/o/Platform%20Videos%2F5255452_2018_Background_1280x720.mp4?alt=media&token=4a37041e-3515-4bf6-90c3-794dbd520a20',
        },
        PILLS: {
            backgroundColor: '#000000',
            color: '#FFFFF0',
            borderRadius: '45px',
            outline: '1px solid #000',
            outlineOffset: '1px',
        },
        HEADER_TEXT: {
            color: '#000000',
        },
        TEXT: {
            color: '#000000',
        },
    },
    {
        NAME: 'Slate',
        BACKGROUND: {
            backgroundColor: '#708090',
        },
        PILLS: {
            backgroundColor: '#FFFFFF',
            color: '#708090',
            borderRadius: '25px',
        },
        HEADER_TEXT: {
            color: '#FFFFFF',
        },
        TEXT: {
            color: '#000000',
        },
    },
];




