import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
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
});
