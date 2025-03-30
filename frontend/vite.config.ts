import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
export default defineConfig({
    server: {
        port: 3000, // Set your desired port here
    },
    plugins: [
        checker({
            typescript: true /** or an object config */,
            overlay: true,
        }),
    ],
});
