import { build } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../..');
const isWatch = process.argv.includes('--watch');

async function buildContentScripts() {
  console.log('Building content scripts...');

  // Build the content script (data scraper)
  await build({
    root: rootDir,
    configFile: false,
    plugins: [],
    build: {
      emptyOutDir: false,
      outDir: 'dist/assets',
      watch: isWatch ? {} : null,
      lib: {
        entry: 'src/assets/scripts/hn.ts',
        name: 'hn',
        fileName: () => 'hn.js',
        formats: ['iife'],
      },
      rollupOptions: {
        output: {
          extend: true,
          name: 'EnhancerAI_hn',
        },
      },
    },
    define: {
      'process.env.NODE_ENV': isWatch ? '"development"' : '"production"',
    },
  });

  console.log('Content script built successfully');
}

async function buildUIScripts() {
  console.log('Building UI scripts...');

  // Build the React UI
  await build({
    root: rootDir,
    configFile: false,
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, 'src'),
      },
    },
    build: {
      emptyOutDir: false,
      outDir: 'dist/assets',
      watch: isWatch ? {} : null,
      cssCodeSplit: false,
      lib: {
        entry: 'src/features/hacker-news/index.tsx',
        name: 'hn_ui',
        fileName: () => 'hn-ui.js',
        formats: ['iife'],
      },
      rollupOptions: {
        output: {
          extend: true,
          name: 'EnhancerAI_hn_ui',
          assetFileNames: 'hn-ui.css',
        },
      },
    },
    define: {
      'process.env.NODE_ENV': isWatch ? '"development"' : '"production"',
    },
  });

  console.log('UI script built successfully');
}

async function buildAll() {
  try {
    await buildContentScripts();
    await buildUIScripts();
    console.log('All builds completed successfully!');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

buildAll();
