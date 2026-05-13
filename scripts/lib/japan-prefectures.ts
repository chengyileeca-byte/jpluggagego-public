// Re-export from the canonical location under src/lib so both the Next app
// (RSC/UI) and scripts share one definition. The scripts here still import
// from "./lib/japan-prefectures" so this shim keeps existing paths working.
export * from "../../src/lib/japan";
