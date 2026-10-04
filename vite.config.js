import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Inlines HTML partials: <!-- @include src/sections/hero.html -->
// Keeps the original markup byte-for-byte without a runtime templating step.
const htmlInclude = () => ({
  name: 'html-include',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) =>
      html.replace(/<!--\s*@include\s+(\S+)\s*-->/g, (_, file) =>
        readFileSync(resolve(__dirname, file), 'utf-8').trimEnd()
      ),
  },
  configureServer(server) {
    server.watcher.on('change', (f) => {
      if (f.endsWith('.html')) server.ws.send({ type: 'full-reload' });
    });
  },
});

export default defineConfig({
  base: './',
  plugins: [htmlInclude()],
});
