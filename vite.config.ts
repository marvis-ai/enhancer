import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { glob } from 'glob';
import { readFileSync, writeFileSync } from 'fs';

interface AssetInfo {
  name?: string;
}

interface ContentScript {
  js: string[];
  css: string[];
  matches: string[];
  run_at: string;
}

// Plugin to process manifest.json with hashed filenames
function manifestPlugin() {
  return {
    name: 'manifest-plugin',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    writeBundle(_options: unknown, bundle: Record<string, any>) {
      const manifest = JSON.parse(readFileSync('src/manifest.json', 'utf-8'));

      // Map original filenames to hashed filenames
      const fileMap: Record<string, string> = {};

      Object.keys(bundle).forEach((fileName) => {
        if (fileName.includes('scripts/') && fileName.endsWith('.js')) {
          const originalName = fileName
            .replace(/-[^-]*\.js$/, '.js')
            .replace('assets/', '');
          fileMap[originalName] = fileName;
        } else if (fileName.includes('styles/') && fileName.endsWith('.css')) {
          const originalName = fileName
            .replace(/-[^-]*\.css$/, '.css')
            .replace('assets/', '');
          fileMap[originalName] = fileName;
        }
      });

      // Update manifest with hashed filenames
      manifest.content_scripts.forEach((script: ContentScript) => {
        script.js = script.js.map((file: string) => fileMap[file] || file);
        if (script.css) {
          script.css = script.css.map((file: string) => fileMap[file] || file);
        }
      });

      // Write processed manifest to dist
      writeFileSync('dist/manifest.json', JSON.stringify(manifest, null, 2));
    },
  };
}

// https://vite.dev/config/
export default defineConfig(async () => {
  const entries: Record<string, string> = {
    popup: 'popup.html',
  };

  // Add all CSS files from src/assets/styles
  const styleFiles = await glob('src/assets/styles/**/*.css');
  styleFiles.forEach((file: string) => {
    const name = file.replace('src/assets/', '').replace('.css', '');
    entries[name] = file;
  });

  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      tailwindcss(),
      manifestPlugin(),
    ],
    build: {
      rollupOptions: {
        input: entries,
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: (assetInfo: AssetInfo) => {
            if (assetInfo?.name?.endsWith('.css')) {
              return 'assets/styles/[name]-[hash].[ext]';
            }
            return 'assets/[name]-[hash].[ext]';
          },
        },
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
});
