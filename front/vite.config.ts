import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svgr(), react()],
    server: {
        host: '0.0.0.0',
        port: 3000,
    },
    preview: {
        host: 'localhost',
        port: 3000,
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, './src'),
        },
    },
    optimizeDeps: {
        //workaround for the problem https://github.com/vitejs/vite/issues/7719
        extensions: ['.css'],
        esbuildOptions: {
            plugins: [
                (await import('esbuild-sass-plugin')).sassPlugin({
                    type: 'style',
                }),
            ],
        },
    },
});
