import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.phaser.vue.ionitron',
  appName: 'Ionitron Game',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
