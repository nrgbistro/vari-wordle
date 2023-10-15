import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			"/api": {
				target: "http://localhost:3001",
				changeOrigin: false,
			},
		},
	},
	build: {
		outDir: "dist",
	},
	define: {
		APP_VERSION: JSON.stringify(process.env.npm_package_version),
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./test/setupTest.ts",
	},
});
