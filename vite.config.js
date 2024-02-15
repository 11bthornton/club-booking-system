import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        https: {
            // key: readFileSync('path/to/localhost-key.pem'),
            cert: readFileSync('DigiCertGlobalRootG2.crt.pem'),
        },
    },
});
