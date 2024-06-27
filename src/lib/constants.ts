

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
        NAME: 'Simple',
        BACKGROUND_MEDIA: 'color',// 'image' or 'video' or 'color'
        BACKGROUND: {
            backgroundColor: '#2f4858',
        },
        PILLS: {
            borderRadius: '10px',
        },
        OPACITY_LAYER: {
            opacity: '1',
            backgroundColor: '#FFFFFF',
        },
        HEADER_TEXT: {
            color: '#FFFFFF',
        },
        TEXT: {
            color: '#000000',
        },
    },
    {
        NAME: 'Midnight',
        BACKGROUND_MEDIA: 'video',// 'image' or 'video' or 'color'
        BACKGROUND: {
            backgroundColor: '#000',
        },
        BACKGROUND_VIDEO: {
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/linkapp-a5ccb.appspot.com/o/Platform%20Videos%2F6323827_Tunnel_Arch_1280x720.mp4?alt=media&token=5c1433b2-918d-4966-97bc-e4448ea12fc0',
        },
        PILLS: {
            borderRadius: '25px',
        },
        OPACITY_LAYER: {
            opacity: '0.5',
            backgroundColor: '#fff',
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
        BACKGROUND_MEDIA: 'gradient',// 'image' or 'video' or 'color'
        GRADIENT_ONE: '#f6d365',
        GRADIENT_TWO: '#fda085',
        GRADIENT_ANGLE: '45',
        PILLS: {
            borderRadius: '25px',
            boxShadow: '3px 3px 0px 0px #000',
        },
        OPACITY_LAYER: {
            opacity: '1',
            backgroundColor: '#fff',
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
        BACKGROUND_MEDIA: 'gradient',// 'image' or 'video' or 'color'
        GRADIENT_ONE: 'blue',
        GRADIENT_TWO: 'red',
        GRADIENT_ANGLE: '45',
        PILLS: {
            borderRadius: '20px',
        },
        OPACITY_LAYER: {
            opacity: '1',
            backgroundColor: '#fff',
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
        BACKGROUND_MEDIA: 'color',// 'image' or 'video' or 'color'
        BACKGROUND: {
            backgroundColor: '#228B22',
        },
        PILLS: {
            borderRadius: '10px',
        },
        OPACITY_LAYER: {
            opacity: '1',
            backgroundColor: '#fff',
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
        BACKGROUND_MEDIA: 'color',// 'image' or 'video' or 'color'
        BACKGROUND: {
            backgroundColor: '#EDC9AF',
        },
        PILLS: {
            borderRadius: '25px',
        },
        OPACITY_LAYER: {
            opacity: '1',
            backgroundColor: '#fff',
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
        BACKGROUND_MEDIA: 'image',// 'image' or 'video' or 'color'
        BACKGROUND: {
            backgroundColor: '#E6E6FA',
        },
        BACKGROUND_IMAGE: {
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/linkapp-a5ccb.appspot.com/o/Platform%20Images%2F501.jpg?alt=media&token=866ee213-cdfc-4413-96fd-f4f3b32b2118',
        },
        PILLS: {
            borderRadius: '25px',
        },
        OPACITY_LAYER: {
            opacity: '1',
            backgroundColor: '#53528e',
        },
        HEADER_TEXT: {
            color: '#000000',
        },
        TEXT: {
            color: '#fff',
        },
    },
    {
        NAME: 'Ruby',
        BACKGROUND_MEDIA: 'color',// 'image' or 'video' or 'color'
        BACKGROUND: {
            backgroundColor: '#9B111E',
        },
        PILLS: {
            borderRadius: '25px',
        },
        OPACITY_LAYER: {
            opacity: '1',
            backgroundColor: '#FFFFFF',
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
        BACKGROUND_MEDIA: 'color',// 'image' or 'video' or 'color'
        BACKGROUND: {
            backgroundColor: '#98FF98',
        },
        PILLS: {
            borderRadius: '15px',
        },
        OPACITY_LAYER: {
            opacity: '1',
            backgroundColor: '#FFFFFF',
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
        BACKGROUND_MEDIA: 'color',// 'image' or 'video' or 'color'
        BACKGROUND: {
            backgroundColor: '#FF4500',
        },
        PILLS: {
            color: '#FF4500',
            borderRadius: '0px',
        },
        OPACITY_LAYER: {
            opacity: '0.5',
            backgroundColor: '#fff',
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
        BACKGROUND_MEDIA: 'image',// 'image' or 'video' or 'color'
        BACKGROUND: {
            backgroundColor: '#FF7F50',
        },
        BACKGROUND_IMAGE: {
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/linkapp-a5ccb.appspot.com/o/Platform%20Images%2Fsmiling-young-woman-using-mobile-phone-against-sky.jpg?alt=media&token=fda1f0b3-61ee-4ca8-a374-0cdcf7fcc3ad',
        },
        PILLS: {
            borderRadius: '25px',
        },
        OPACITY_LAYER: {
            opacity: '1',
            backgroundColor: '#FFFFFF',
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
        BACKGROUND_MEDIA: 'video',// 'image' or 'video' or 'color'
        BACKGROUND: {
            backgroundColor: '#FFFFF0',
        },
        BACKGROUND_VIDEO: {
            videoUrl: 'https://firebasestorage.googleapis.com/v0/b/linkapp-a5ccb.appspot.com/o/Platform%20Videos%2F5255452_2018_Background_1280x720.mp4?alt=media&token=4a37041e-3515-4bf6-90c3-794dbd520a20',
        },
        BACKGROUND_VIDEO_STYLING: {
            filter: 'blur(2px)',
        },
        PILLS: {
            borderRadius: '25px',
        },
        OPACITY_LAYER: {
            opacity: '1',
            backgroundColor: '#FFFFFF',
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
        BACKGROUND_MEDIA: 'image',// 'image' or 'video' or 'color'
        BACKGROUND: {
            backgroundColor: '#708090',
        },
        BACKGROUND_IMAGE: {
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/linkapp-a5ccb.appspot.com/o/Platform%20Images%2Fblack-prism-concept-ai-generated.jpg?alt=media&token=5386da92-7696-46e1-8147-5d838fa35164',
        },
        BACKGROUND_IMAGE_STYLING: {
            filter: 'blur(2px)',
        },
        PILLS: {
            borderRadius: '25px',
        },
        OPACITY_LAYER: {
            opacity: '1',
            backgroundColor: '#FFFFFF',
        },
        HEADER_TEXT: {
            color: '#FFFFFF',
        },
        TEXT: {
            color: '#000000',
        },
    },
];




