import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.apoiohospitalar',
  appName: 'Apoio Hospitalar',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1000,
      splashImmersive:true,
      androidScaleType: 'CENTER_CROP',
      androidSplashResourceName:  'splash_background'

    },
  },
};

export default config;
