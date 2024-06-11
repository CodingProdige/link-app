import { CSSProperties } from 'react';

// Define SCSS variables in TypeScript
const colorPrimary = '#00a6fb';
const colorSecondary = '#0582ca';
const colorAccent = '#006494';
const colorAccentDark = '#003554';
const colorText = '#333333';
const colorTextLight = '#7a7a7a';
const colorTextBrand = '#051923';
const colorWhite = '#ffffff';
const colorOffWhite = '#f3f3f3';
const colorOffBlack = '#333333';
const colorOffBlackLight = '#4b4b4b';
const colorBlack = '#000000';
const colorError = '#ff0000';
const colorSuccess = '#00ff00';

// Screen sizes
const screenXs = '380px';
const screenSm = '576px';
const screenMd = '768px';
const screenLg = '992px';
const screenXl = '1200px';
const screenXxl = '1400px';

// Define the theme object
interface Theme {
  containerPublicProfile: CSSProperties;
  background: CSSProperties;
  innerContainer: CSSProperties;
  profileContainer: CSSProperties;
  profileImage: CSSProperties;
  nameContainer: CSSProperties;
  username: CSSProperties;
  name: CSSProperties;
  linksContainer: CSSProperties;
  linksList: CSSProperties;
  linkPill: CSSProperties;
  linkItem: CSSProperties;
  linkTitle: CSSProperties;
  linkItemMobile: CSSProperties;
  fanslinkLogo: CSSProperties;
  fanslinkLogoImage: CSSProperties;
  error: CSSProperties;
}

export const THEMES: { [key: string]: Theme } = {
  default: {
    containerPublicProfile: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      padding: '1rem',
    },
    background: {
      position: 'fixed',
      top: '0',
      left: '0',
      bottom: '0',
      right: '0',
      zIndex: -1,
      backgroundColor: colorOffBlack,
    },
    innerContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem',
      width: '100%',
      maxWidth: screenSm,
      height: 'auto',
      marginBottom: '5rem',
    },
    profileContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      marginTop: '5rem',
    },
    profileImage: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'cover',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    nameContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    username: {
      fontSize: '1.2rem',
      fontWeight: 700,
      color: colorWhite,
    },
    name: {
      fontSize: '1rem',
      color: colorTextLight,
    },
    linksContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
    },
    linksList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
    },
    linkPill: {
      width: '100%',
    },
    linkItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      backgroundColor: colorWhite,
      color: colorText,
      borderRadius: '50px',
      cursor: 'pointer',
      width: '100%',
      height: '4rem',
      padding: '0.5rem 1rem',
    },
    linkTitle: {
      color: colorText,
      width: '100%',
      textAlign: 'center',
    },
    linkItemMobile: {
      height: '3rem',
      padding: '0.5rem 1rem',
    },
    fanslinkLogo: {
      position: 'fixed',
      bottom: '1rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fanslinkLogoImage: {
      width: 'auto',
      height: '2rem',
      objectFit: 'contain',
    },
    error: {
      color: colorError,
      textAlign: 'center',
    },
  },
};
