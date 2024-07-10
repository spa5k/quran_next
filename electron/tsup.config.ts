import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/main.ts", "./src/preload.ts"],
  clean: true,
  cjsInterop: true,
  // skipNodeModulesBundle: false,
  // treeshake: true,
  outDir: "build",
  external: ["electron"],
  format: ["cjs"], // Can't use esm, as electron doesn't support it
  bundle: true,
  noExternal: ["electron-settings", "get-port-please"],
});
