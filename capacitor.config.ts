import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ordersapp.app',
  appName: 'Orders App',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SQLite: {
      iosMode: 'memory', // or 'production'
      androidDatabaseLocation: 'default'
    }
  }
};

export default config;

