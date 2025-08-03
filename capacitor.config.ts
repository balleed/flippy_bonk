import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.flappybird.app',
  appName: 'flappy-bird',
  webDir: 'out',
  plugins: {
    StatusBar: {
      style: 'light',
      backgroundColor: '#87ceeb',
      overlaysWebView: true,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#87ceeb',
      showSpinner: false,
    },
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#87ceeb',
    webContentsDebuggingEnabled: true,
  },
};

export default config;
