import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jaks.fittracker',
  appName: 'FitTracker',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
