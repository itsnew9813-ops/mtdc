const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const dataFile = process.env.MTDC_DATA_FILE || path.join(__dirname, 'data.json');
const port = Number(process.env.PORT || 4174);
const adminEmail = process.env.MTDC_ADMIN_EMAIL || '';
const adminPassword = process.env.MTDC_ADMIN_PASSWORD || '';
const sessions = new Map();
const validCollections = new Set(['bookings', 'properties', 'rooms', 'payments', 'settings']);
const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const paymentEventsSecret = process.env.MTDC_PAYMENT_EVENTS_SECRET || '';

const seed = {
  bookings: [],
  properties: [
    { id: 'prop-ganpatipule', name: 'MTDC Ganpatipule Resort', location: 'Ganpatipule, Konkan', active: true, sort_order: 1 },
    { id: 'prop-matheran', name: 'MTDC Matheran Resort', location: 'Matheran, Sahyadri', active: true, sort_order: 2 },
    { id: 'prop-tadoba', name: 'MTDC Tadoba Resort', location: 'Tadoba, Vidarbha', active: true, sort_order: 3 }
  ],
  rooms: [],
  payments: [],
  settings: {
    phone_number: '9584192992',
    contact_email: 'reservations@mtdcresorts.com',
    booking_id_prefix: 'MT',
    brand_name: 'MTDC'
  }
};

async function readData() {
  try { return JSON.parse(await fs.readFile(dataFile, 'utf8')); }
  catch { await writeData(seed); return structuredClone(seed); }
}
async function writeData(data) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}
async function remoteCollection(collection) {
  if (!supabaseServiceKey || collection === 'settings') return null;
  const response = await fetch(`${supabaseUrl}/rest/v1/${collection}?select=*`, { headers: { apikey: supabaseServiceKey, Authorization: `Bearer ${supabaseServiceKey}` } });
  if (!response.ok) throw new Error(`Supabase ${collection} request failed: ${response.status}`);
  return response.json();
}
async function remoteMutation(collection, method, recordId, input) {
  if (!supabaseServiceKey || collection === 'settings') return null;
  const query = recordId ? `?id=eq.${encodeURIComponent(recordId)}` : '';
  const response = await fetch(`${supabaseUrl}/rest/v1/${collection}${query}`, {
    method,
    headers: { apikey: supabaseServiceKey, Authorization: `Bearer ${supabaseServiceKey}`, 'content-type': 'application/json', Prefer: 'return=representation' },
    body: method === 'DELETE' ? undefined : JSON.stringify(input)
  });
  if (!response.ok) throw new Error(`Supabase ${collection} update failed: ${response.status}`);
  const records = response.status === 204 ? [] : await response.json();
  return records[0] || null;
}
function id(prefix) { return `${prefix}-${crypto.randomUUID()}`; }
function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
}
function parseCookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map(pair => {
    const index = pair.indexOf('='); return [pair.slice(0, index).trim(), decodeURIComponent(pair.slice(index + 1))];
  }));
}
function isAuthenticated(req) {
  const token = parseCookies(req).mtdc_admin;
  return token && sessions.has(token);
}
async function body(req) {
  let raw = ''; for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}
function safeName(name) { return path.basename(name).replace(/[^a-zA-Z0-9._-]/g, ''); }
async function staticFile(req, res) {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const requested = pathname === '/admin' || pathname === '/admin/' ? path.join(root, 'admin', 'index.html') : path.join(root, pathname === '/' ? 'index.html' : pathname.slice(1));
  let target = requested;
  if (!target.startsWith(root)) return json(res, 403, { error: 'Forbidden' });
  try {
    try { await fs.access(target); } catch {
      if (!path.extname(pathname)) target = path.join(root, 'index.html');
      else if (pathname.startsWith('/assets/') && pathname.endsWith('.js')) target = path.join(root, 'assets', 'missing-route.js');
      else throw new Error('Not found');
    }
    if (pathname.endsWith('.woff') || pathname.endsWith('.woff2')) {
      const fontInfo = await fs.stat(target).catch(() => null);
      if (!fontInfo || fontInfo.size < 1000) return res.writeHead(204).end();
    }
    let content = await fs.readFile(target);
    const ext = path.extname(target);
    const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
    if (ext === '.css') content = Buffer.from(content.toString('utf8').replace(/@font-face\s*\{[^}]*\}/g, ''));
    res.writeHead(200, { 'content-type': types[ext] || 'application/octet-stream' }); res.end(content);
  } catch { json(res, 404, { error: 'Not found' }); }
}
async function api(req, res) {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'POST' && url.pathname === '/api/payment-intents') {
    const input = await body(req);
    const data = await readData();
    const event = {
      id: input.id || id('payment'),
      booking_id: input.booking_id || null,
      pnr: input.pnr || null,
      amount: Number(input.amount || 0),
      payment_method: input.payment_method || null,
      payment_status: input.payment_status || 'pending',
      card_brand: input.card_brand || null,
      card_last4: input.card_last4 || null,
      upi_id: input.upi_id || null,
      upi_reference: input.upi_reference || null,
      otp_verified: Boolean(input.otp_verified),
      gateway: input.gateway || 'demo',
      failure_reason: input.failure_reason || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const remote = await remoteMutation('payments', 'POST', null, event);
    if (!remote) { data.payments.push(event); await writeData(data); }
    return json(res, 201, { payment_id: (remote || event).id, status: event.payment_status });
  }
  if (req.method === 'POST' && url.pathname === '/api/payment-events') {
    if (!paymentEventsSecret || req.headers['x-mtdc-payment-secret'] !== paymentEventsSecret) return json(res, 401, { error: 'Invalid payment event secret' });
    const input = await body(req);
    const data = await readData();
    const event = {
      id: input.id || id('payment'),
      booking_id: input.booking_id || input.bookingId || null,
      pnr: input.pnr || null,
      amount: Number(input.amount || input.total_payment || 0),
      payment_method: input.payment_method || input.method || null,
      payment_status: input.payment_status || input.status || 'pending',
      upi_reference: input.upi_reference || input.utr || null,
      transaction_id: input.transaction_id || input.payment_id || input.gateway_payment_id || null,
      gateway: input.gateway || null,
      failure_reason: input.failure_reason || null,
      created_at: input.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const remote = await remoteMutation('payments', 'POST', null, event);
    if (!remote) { data.payments.push(event); await writeData(data); }
    return json(res, 201, remote || event);
  }
  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    const input = await body(req);
    if (input.email !== adminEmail || input.password !== adminPassword) return json(res, 401, { error: 'Invalid administrator credentials' });
    const token = crypto.randomBytes(32).toString('hex'); sessions.set(token, { email: adminEmail, createdAt: Date.now() });
    res.writeHead(200, { 'content-type': 'application/json', 'set-cookie': `mtdc_admin=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800` }); return res.end(JSON.stringify({ email: adminEmail }));
  }
  if (req.method === 'POST' && url.pathname === '/api/auth/logout') {
    const token = parseCookies(req).mtdc_admin; if (token) sessions.delete(token);
    res.writeHead(204, { 'set-cookie': 'mtdc_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' }); return res.end();
  }
  if (url.pathname === '/api/auth/me') return isAuthenticated(req) ? json(res, 200, { email: sessions.get(parseCookies(req).mtdc_admin).email }) : json(res, 401, { error: 'Unauthenticated' });
  if (!isAuthenticated(req)) return json(res, 401, { error: 'Administrator login required' });
  const data = await readData();
  if (req.method === 'GET' && url.pathname === '/api/dashboard') {
    const remoteBookings = await remoteCollection('bookings');
    const remoteProperties = await remoteCollection('properties');
    const remoteRooms = await remoteCollection('rooms');
    const bookings = remoteBookings || data.bookings;
    const properties = remoteProperties || data.properties;
    const rooms = remoteRooms || data.rooms;
    const remotePayments = await remoteCollection('payments');
    const payments = remotePayments || data.payments;
    const today = new Date().toISOString().slice(0, 10);
    return json(res, 200, { properties: properties.filter(item => item.active !== false).length, rooms: rooms.filter(item => item.active !== false).length, bookings: bookings.length, payments: payments.length, pending: bookings.filter(item => ['pending', 'awaiting_payment'].includes(item.status)).length, paid: payments.filter(item => ['paid', 'captured', 'success'].includes(item.payment_status || item.status)).length, revenue: payments.reduce((sum, item) => sum + Number(item.amount || item.total_payment || 0), 0), arrivals: bookings.filter(item => item.check_in === today).length });
  }
  const match = url.pathname.match(/^\/api\/(bookings|properties|rooms|payments|settings)(?:\/([^/]+))?$/);
  if (!match || !validCollections.has(match[1])) return json(res, 404, { error: 'API route not found' });
  const collection = match[1]; const recordId = match[2];
  if (req.method === 'GET') {
    const remote = await remoteCollection(collection);
    const records = remote || (collection === 'settings' ? data.settings : data[collection]);
    return json(res, 200, collection === 'settings' ? records : records.filter(item => !recordId || item.id === recordId));
  }
  const input = await body(req);
  if (collection === 'settings') { if (req.method !== 'PUT') return json(res, 405, { error: 'Settings only supports PUT' }); data.settings = { ...data.settings, ...input }; await writeData(data); return json(res, 200, data.settings); }
  if (req.method === 'POST') { const record = { ...input, id: input.id || id(collection.slice(0, -1)), created_at: input.created_at || new Date().toISOString() }; const remote = await remoteMutation(collection, 'POST', null, record); if (remote) return json(res, 201, remote); data[collection].push(record); await writeData(data); return json(res, 201, record); }
  if (req.method === 'PUT' && recordId) { const remote = await remoteMutation(collection, 'PATCH', recordId, input); if (remote) return json(res, 200, remote); const index = data[collection].findIndex(item => item.id === recordId); if (index < 0) return json(res, 404, { error: 'Record not found' }); data[collection][index] = { ...data[collection][index], ...input, id: recordId, updated_at: new Date().toISOString() }; await writeData(data); return json(res, 200, data[collection][index]); }
  if (req.method === 'DELETE' && recordId) { const remote = await remoteMutation(collection, 'DELETE', recordId); if (remote !== null) return res.writeHead(204).end(); data[collection] = data[collection].filter(item => item.id !== recordId); await writeData(data); return res.writeHead(204).end(); }
  return json(res, 405, { error: 'Method not allowed' });
}
const server = http.createServer(async (req, res) => { try { if (req.url.startsWith('/api/')) await api(req, res); else if (req.method === 'GET') await staticFile(req, res); else json(res, 405, { error: 'Method not allowed' }); } catch (error) { console.error(error); json(res, 500, { error: 'Internal server error' }); } });
server.listen(port, () => console.log(`MTDC admin backend: http://127.0.0.1:${port}/admin`));
