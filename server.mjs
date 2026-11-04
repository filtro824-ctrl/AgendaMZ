import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const publicRoot = join(root, 'public');
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
  const relativePath = normalize(pathname).replace(/^([/\\])+/, '');
  const appFile = join(root, relativePath);
  const publicFile = join(publicRoot, relativePath);
  let filePath = pathname === '/manus-routes.json'
    ? join(publicRoot, 'manus-routes.json')
    : existsSync(appFile) && statSync(appFile).isFile()
      ? appFile
      : publicFile;

  if ((!filePath.startsWith(root) && !filePath.startsWith(publicRoot)) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    if (!extname(pathname) || pathname === '/') filePath = join(root, 'index.html');
    else {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }
  }

  response.writeHead(200, {
    'content-type': mimeTypes[extname(filePath)] || 'application/octet-stream',
    'cache-control': 'no-cache',
  });
  createReadStream(filePath).pipe(response);
});

const port = Number(process.env.PORT || 3000);
server.listen(port, '0.0.0.0', () => console.log(`Agenda MZ ready at http://0.0.0.0:${port}`));
