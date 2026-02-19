import { LiveUpdate } from "@capawesome/capacitor-live-update";

const VERSION_URL =
  "https://tools-minio.snake-caiman.ts.net/ota/bisabimbel/version.json";

export const checkForOtaUpdates = async () => {
  try {
    // Ambil info bundle saat ini
    const currentBundle = await LiveUpdate.getCurrentBundle();

    const response = await fetch(VERSION_URL);
    const data: { url: string; bundleId: string } = await response.json();

    if (currentBundle) {
      if (currentBundle.bundleId === data.bundleId) {
        console.log("App sudah versi terbaru");
        return;
      }

      // Download bundle zip
      console.log("Downloading update...");
      await LiveUpdate.downloadBundle({
        url: data.url,
        bundleId: data.bundleId,
        artifactType: "zip",
      });

      console.log("Extracting...");
      await LiveUpdate.setNextBundle({
        bundleId: data.bundleId,
      });

      console.log("Update akan diterapkan setelah restart app");

      // await LiveUpdate.reload();
    }

    throw new Error("Gagal mendapatkan info bundle saat ini");
  } catch (error) {
    console.error("Update gagal:", error);
  }
};
