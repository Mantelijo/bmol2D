const path = require("path");

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		watch: {
			// https://vitejs.dev/config/#server-watch
			usePolling: true,
		},
	},
	build: {
		outDir: "build",
	},
	plugins: [react()],
	envDir: "./",
});
