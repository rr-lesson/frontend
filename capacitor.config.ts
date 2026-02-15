import type { CapacitorConfig } from "@capacitor/cli";
import * as dotenv from "dotenv";

dotenv.config();

const isDevelopment = process.env.APP_ENV === "development";

const config: CapacitorConfig = {
  appId: "id.my.rizalanggoro.bisabimbel",
  appName: "BisaBimbel",
  webDir: "dist",
  android: {
    allowMixedContent: true,
  },
  server: {
    androidScheme: isDevelopment ? "http" : "https",
    hostname: isDevelopment ? "rizalanggoro" : "bisabimbel.rizalanggoro.my.id",
  },
  plugins: {
    StatusBar: {
      overlaysWebView: true,
    },
  },
};

export default config;
