import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const port = Number(process.env.PORT || 80);

const clients = new Set();

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function sendEvent(client, eventName, payload) {
  client.res.write(`event: ${eventName}\n`);
  client.res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function broadcast(eventName, payload) {
  for (const client of clients) {
    sendEvent(client, eventName, payload);
  }
}

async function readRequestBody(req) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1024 * 1024) {
      throw new Error('Request body too large');
    }
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString('utf8');
}

async function handleCommand(req, res) {
  try {
    const rawBody = await readRequestBody(req);
    const body = rawBody ? JSON.parse(rawBody) : {};
    const command = {
      id: body.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      intent: body.intent || 'custom',
      label: body.label || 'Comando Hugin',
      message: body.message || body.phrase || 'HUGIN ONLINE',
      phrase: body.phrase || '',
      theme: body.theme || 'cyan',
      source: body.source || 'control',
      createdAt: new Date().toISOString()
    };

    broadcast('command', command);
    sendJson(res, 202, { ok: true, command });
  } catch (error) {
    sendJson(res, 400, { ok: false, error: error.message });
  }
}

function handleEvents(req, res) {
  res.writeHead(200, {
    'content-type': 'text/event-stream; charset=utf-8',
    'cache-control': 'no-cache, no-transform',
    connection: 'keep-alive',
    'x-accel-buffering': 'no'
  });
  res.write('\n');

  const client = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    res
  };
  clients.add(client);
  sendEvent(client, 'ready', { ok: true, connectedClients: clients.size });
  broadcast('presence', { connectedClients: clients.size });

  req.on('close', () => {
    clients.delete(client);
    broadcast('presence', { connectedClients: clients.size });
  });
}

async function proxyTus(req, res, url) {
  const upstreamPath = url.pathname.replace(/^\/api-tus\/?/, '');
  const upstreamUrl = new URL(`https://datos.santander.es/${upstreamPath}`);
  upstreamUrl.search = url.search;

  try {
    const response = await fetch(upstreamUrl, {
      headers: {
        accept: req.headers.accept || 'application/json'
      }
    });
    const body = Buffer.from(await response.arrayBuffer());
    res.writeHead(response.status, {
      'content-type': response.headers.get('content-type') || 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    });
    res.end(body);
  } catch (error) {
    sendJson(res, 502, { ok: false, error: error.message });
  }
}

async function serveStatic(req, res, url) {
  const requestedPath = decodeURIComponent(url.pathname);
  const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(distDir, safePath);

  if (!filePath.startsWith(distDir)) {
    sendJson(res, 403, { ok: false, error: 'Forbidden' });
    return;
  }

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html');
  }

  if (!existsSync(filePath)) {
    sendJson(res, 503, { ok: false, error: 'Build not found. Run npm run build first.' });
    return;
  }

  const extension = path.extname(filePath);
  res.writeHead(200, {
    'content-type': mimeTypes[extension] || 'application/octet-stream',
    'cache-control': extension === '.html' ? 'no-store' : 'public, max-age=31536000, immutable'
  });
  createReadStream(filePath).pipe(res);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, 200, { ok: true, clients: clients.size });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/events') {
    handleEvents(req, res);
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/command') {
    await handleCommand(req, res);
    return;
  }

  if (url.pathname.startsWith('/api-tus/')) {
    await proxyTus(req, res, url);
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendJson(res, 405, { ok: false, error: 'Method not allowed' });
    return;
  }

  await serveStatic(req, res, url);
});

setInterval(() => {
  for (const client of clients) {
    sendEvent(client, 'ping', { now: Date.now() });
  }
}, 25000).unref();

server.listen(port, '0.0.0.0', () => {
  console.log(`Hugin server listening on http://0.0.0.0:${port}`);
});
