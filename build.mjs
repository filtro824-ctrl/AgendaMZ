import { cpSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const dist = join(root, 'dist');
const publicDir = join(root, 'public');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const file of ['index.html', 'main.js', 'styles.css']) {
  cpSync(join(root, file), join(dist, file));
}

if (existsSync(publicDir)) {
  cpSync(publicDir, dist, {
    recursive: true,
    filter: (src) => !src.endsWith('manus-routes.json'),
  });
}

console.log('dist/ criado com sucesso');
