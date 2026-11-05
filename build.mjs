import { cpSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const dist = join(root, 'dist');
const publicDir = join(root, 'public');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const file of ['index.html', 'eventos.html', 'events.js', 'main.js', 'styles.css']) {
  cpSync(join(root, file), join(dist, file));
}

mkdirSync(join(dist, 'eventos'), { recursive: true });
cpSync(join(root, 'eventos.html'), join(dist, 'eventos', 'index.html'));

if (existsSync(publicDir)) {
  cpSync(publicDir, dist, {
    recursive: true,
  });
}

console.log('dist/ criado com sucesso');
