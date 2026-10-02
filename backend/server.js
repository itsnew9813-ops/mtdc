const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

const root = path.resolve(__dirname, '..');
const dataFile = process.env.MTDC_DATA_FILE || path.join(__dirname, 'data.json');
const port = Number(process.env.PORT || 4174);
const adminEmail = process.env.MTDC_ADMIN_EMAIL || 'admin@gmail.com';
const adminPassword = process.env.MTDC_ADMIN_PASSWORD || 'admin123';
const sessions = new Map();
const validCollections = new Set(['bookings', 'properties', 'rooms', 'payments', 'payment_config', 'site_settings', 'visitor_page_views', 'settings']);
const supabaseUrl = (process.env.SUPABASE_URL || 'https://bpqnwqdxvrsaamckwcng.supabase.co').replace(/\/$/, '');
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const paymentEventsSecret = process.env.MTDC_PAYMENT_EVENTS_SECRET || '';
const resendApiKey = process.env.RESEND_API_KEY || '';
const notifyFromEmail = process.env.MTDC_NOTIFY_FROM_EMAIL || '';
const whatsappAccessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const whatsappApiVersion = process.env.WHATSAPP_GRAPH_API_VERSION || 'v23.0';
const whatsappTemplateName = process.env.MTDC_WHATSAPP_TEMPLATE_NAME || '';
const whatsappTemplateLanguage = process.env.MTDC_WHATSAPP_TEMPLATE_LANGUAGE || 'en';
const bookingWhatsAppTemplateName = process.env.MTDC_BOOKING_WHATSAPP_TEMPLATE_NAME || '';
const bookingWhatsAppTemplateLanguage = process.env.MTDC_BOOKING_WHATSAPP_TEMPLATE_LANGUAGE || 'en';

const seed = {
  bookings: [],
  properties: [
    { id: 'prop-ganpatipule', name: 'MTDC Ganpatipule Resort', location: 'Ganpatipule, Konkan', active: true, sort_order: 1 },
    { id: 'prop-matheran', name: 'MTDC Matheran Resort', location: 'Matheran, Sahyadri', active: true, sort_order: 2 },
    { id: 'prop-tadoba', name: 'MTDC Tadoba Resort', location: 'Tadoba, Vidarbha', active: true, sort_order: 3 }
  ],
  rooms: [],
  payments: [],
  visitor_page_views: [],
  settings: {
    phone_number: '9232504371',
    contact_email: 'reservations@mtdcresorts.com',
    booking_id_prefix: 'MT',
    brand_name: 'MTDC'
  }
};

async function syncSiteSettingsToRemote(settings) {
  if (!supabaseServiceKey || !settings) return null;

  const payload = [
    { key: 'phone_number', value: settings.phone_number ?? '' },
    { key: 'contact_email', value: settings.contact_email ?? '' },
    { key: 'booking_id_prefix', value: settings.booking_id_prefix ?? '' },
    { key: 'brand_name', value: settings.brand_name ?? '' },
    { key: 'payment_notification_emails', value: settings.payment_notification_emails ?? [] },
    { key: 'payment_notification_whatsapp', value: settings.payment_notification_whatsapp ?? [] }
  ].filter(item => item.value !== undefined && item.value !== null && item.value !== '');

  if (!payload.length) return null;

  const response = await fetch(`${supabaseUrl}/rest/v1/site_settings?on_conflict=key`, {
    method: 'POST',
    headers: {
      apikey: supabaseServiceKey,
      Authorization: `Bearer ${supabaseServiceKey}`,
      'content-type': 'application/json',
      Prefer: 'resolution=merge-duplicates'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Supabase site_settings update failed: ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}

async function readData() {
  try { return JSON.parse(await fs.readFile(dataFile, 'utf8')); }
  catch { await writeData(seed); return structuredClone(seed); }
}
async function writeData(data) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}
async function remoteCollection(collection) {
  if (!supabaseServiceKey) return null;
  const table = collection === 'settings' ? 'site_settings' : collection;
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*`, { headers: { apikey: supabaseServiceKey, Authorization: `Bearer ${supabaseServiceKey}` } });
  if (!response.ok) throw new Error(`Supabase ${collection} request failed: ${response.status}`);
  const records = await response.json();
  if (collection === 'settings') return Object.fromEntries(records.map(item => [item.key, item.value]));
  return records;
}
async function remoteMutation(collection, method, recordId, input) {
  if (!supabaseServiceKey || collection === 'settings' || collection === 'site_settings') return null;
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
async function body(req, maxBytes = Infinity) {
  let raw = ''; let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) {
      const error = new Error('Request body is too large');
      error.statusCode = 413;
      throw error;
    }
    raw += chunk;
  }
  return raw ? JSON.parse(raw) : {};
}
function safeName(name) { return path.basename(name).replace(/[^a-zA-Z0-9._-]/g, ''); }
function printablePdfText(value) {
  return String(value ?? '').normalize('NFKD').replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim() || 'Not provided';
}
function wrapPdfText(value, font, size, width) {
  const words = printablePdfText(value).split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && font.widthOfTextAtSize(candidate, size) > width) {
      lines.push(line);
      line = word;
    } else line = candidate;
  }
  if (line) lines.push(line);
  return lines;
}
async function createBookingConfirmationPdf(booking, settings = {}) {
  const document = await PDFDocument.create();
  const regular = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  const pageSize = [595.28, 841.89];
  const ink = rgb(0.09, 0.15, 0.13);
  const green = rgb(0.07, 0.28, 0.22);
  const gold = rgb(0.84, 0.68, 0.36);
  let page = document.addPage(pageSize);
  let y = 770;

  page.drawRectangle({ x: 0, y: 730, width: pageSize[0], height: 112, color: green });
  page.drawRectangle({ x: 0, y: 727, width: pageSize[0], height: 3, color: gold });
  page.drawText('MAHARASHTRA TOURISM DEVELOPMENT CORPORATION', { x: 40, y: 800, size: 11, font: bold, color: gold });
  page.drawText('RESORTS & HOTELS', { x: 40, y: 778, size: 18, font: bold, color: rgb(1, 1, 1) });
  page.drawText('BOOKING CONFIRMATION', { x: 40, y: 748, size: 11, font: bold, color: rgb(1, 1, 1) });
  page.drawText(`Booking ID: ${printablePdfText(booking.booking_id || booking.id || booking.pnr)}`, { x: 40, y: 704, size: 11, font: bold, color: ink });
  page.drawText(`PNR: ${printablePdfText(booking.pnr)}`, { x: 40, y: 684, size: 10, font: regular, color: ink });
  y = 654;

  const fields = [
    ['Guest', booking.guest_name || booking.guestName || booking.customer_name],
    ['Mobile', booking.mobile || booking.phone || booking.whatsapp_number],
    ['Email', booking.email],
    ['Resort / Hotel', booking.hotel_name || booking.hotelName || booking.property_name],
    ['Address', booking.address || booking.hotel_address],
    ['Room category', booking.room_category || booking.roomCategory || booking.room_type],
    ['Check-in', booking.check_in || booking.checkIn],
    ['Check-out', booking.check_out || booking.checkOut],
    ['Nights', booking.total_nights || booking.totalNights],
    ['Rooms', booking.num_rooms || booking.numRooms],
    ['Guests', booking.guests || booking.guest_count],
    ['Booking amount', `INR ${Number(booking.total_payment || booking.amount || 0).toLocaleString('en-IN')}`],
    ['Special request', booking.special_request || booking.specialRequest]
  ].filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '');

  for (const [label, value] of fields) {
    const lines = wrapPdfText(value, regular, 9.5, 390);
    const rowHeight = Math.max(24, lines.length * 13 + 8);
    if (y - rowHeight < 78) {
      page = document.addPage(pageSize);
      y = 790;
    }
    page.drawText(printablePdfText(label), { x: 42, y: y - 12, size: 9, font: bold, color: green });
    lines.forEach((line, index) => page.drawText(line, { x: 165, y: y - 12 - index * 13, size: 9.5, font: regular, color: ink }));
    y -= rowHeight;
    page.drawLine({ start: { x: 42, y }, end: { x: 553, y }, thickness: 0.5, color: rgb(0.87, 0.9, 0.88) });
  }

  if (y < 72) {
    page = document.addPage(pageSize);
    y = 790;
  }
  page.drawText('Please present this confirmation and valid photo ID at check-in.', { x: 42, y: y - 8, size: 9, font: regular, color: ink });
  const contact = `${settings.contact_email || 'reservations@mtdcresorts.com'} | ${settings.phone_number || '9232504371'} | www.mtdcresorts.com`;
  page.drawText(printablePdfText(contact), { x: 42, y: 38, size: 8, font: regular, color: green });
  return Buffer.from(await document.save());
}
function settingList(value) {
  const values = Array.isArray(value) ? value : String(value || '').split(/[\n,;]+/);
  return [...new Set(values.map(item => String(item).trim()).filter(Boolean))];
}
async function notifyVerifiedPayment(event) {
  if (!['paid', 'captured', 'success'].includes(String(event.payment_status).toLowerCase())) return;
  const data = await readData();
  const emails = settingList(data.settings?.payment_notification_emails);
  const whatsappNumbers = settingList(data.settings?.payment_notification_whatsapp);
  const amount = `INR ${Number(event.amount || 0).toLocaleString('en-IN')}`;
  const booking = event.booking_id || event.pnr || 'Not provided';
  const method = event.payment_method || 'Not provided';
  const reference = event.transaction_id || event.upi_reference || event.id;
  const text = `Payment received. Booking: ${booking}. Amount: ${amount}. Method: ${method}. Reference: ${reference}.`;

  if (emails.length && resendApiKey && notifyFromEmail) {
    for (const email of emails) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${resendApiKey}`, 'content-type': 'application/json' },
          body: JSON.stringify({ from: notifyFromEmail, to: [email], subject: 'MTDC payment received', text }),
          signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) console.error(`Payment email notification failed (${response.status})`);
      } catch (error) {
        console.error(`Payment email notification failed: ${error.message}`);
      }
    }
  }

  if (whatsappNumbers.length && whatsappAccessToken && whatsappPhoneNumberId && whatsappTemplateName) {
    for (const number of whatsappNumbers) {
      try {
        const response = await fetch(`https://graph.facebook.com/${whatsappApiVersion}/${whatsappPhoneNumberId}/messages`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${whatsappAccessToken}`, 'content-type': 'application/json' },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: number.replace(/\D/g, ''),
            type: 'template',
            template: {
              name: whatsappTemplateName,
              language: { code: whatsappTemplateLanguage },
              components: [{
                type: 'body',
                parameters: [booking, amount, method, String(reference)].map(value => ({ type: 'text', text: String(value) }))
              }]
            }
          }),
          signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) console.error(`Payment WhatsApp notification failed (${response.status})`);
      } catch (error) {
        console.error(`Payment WhatsApp notification failed: ${error.message}`);
      }
    }
  }
}
async function sendWhatsAppDocument(phone, pdf, bookingReference, booking) {
  if (!whatsappAccessToken || !whatsappPhoneNumberId) {
    const error = new Error('WhatsApp Cloud API is not configured on the server.');
    error.statusCode = 503;
    throw error;
  }

  let recipient = String(phone).replace(/\D/g, '');
  if (recipient.length === 10) recipient = `91${recipient}`;
  if (!/^[1-9]\d{7,14}$/.test(recipient)) {
    const error = new Error('The booking has an invalid WhatsApp number.');
    error.statusCode = 400;
    throw error;
  }

  const filename = `MTDC-${String(bookingReference).replace(/[^a-zA-Z0-9_-]/g, '-')}-confirmation.pdf`;
  const form = new FormData();
  form.append('messaging_product', 'whatsapp');
  form.append('type', 'application/pdf');
  form.append('file', new Blob([pdf], { type: 'application/pdf' }), filename);

  const mediaResponse = await fetch(`https://graph.facebook.com/${whatsappApiVersion}/${whatsappPhoneNumberId}/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${whatsappAccessToken}` },
    body: form,
    signal: AbortSignal.timeout(20000)
  });
  const media = await mediaResponse.json().catch(() => ({}));
  if (!mediaResponse.ok || !media.id) throw new Error(media.error?.message || 'WhatsApp could not accept the confirmation PDF.');

  const template = bookingWhatsAppTemplateName ? {
    name: bookingWhatsAppTemplateName,
    language: { code: bookingWhatsAppTemplateLanguage },
    components: [
      { type: 'header', parameters: [{ type: 'document', document: { id: media.id, filename } }] },
      {
        type: 'body',
        parameters: [
          bookingReference,
          booking.guest_name || booking.guestName || booking.customer_name || 'Guest',
          booking.hotel_name || booking.hotelName || booking.property_name || 'MTDC Resort'
        ].map(value => ({ type: 'text', text: printablePdfText(value) }))
      }
    ]
  } : null;
  const messagePayload = template ? {
    messaging_product: 'whatsapp',
    to: recipient,
    type: 'template',
    template
  } : {
    messaging_product: 'whatsapp',
    to: recipient,
    type: 'document',
    document: {
      id: media.id,
      filename,
      caption: `MTDC booking confirmation: ${bookingReference}`
    }
  };
  const messageResponse = await fetch(`https://graph.facebook.com/${whatsappApiVersion}/${whatsappPhoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${whatsappAccessToken}`, 'content-type': 'application/json' },
    body: JSON.stringify(messagePayload),
    signal: AbortSignal.timeout(20000)
  });
  const message = await messageResponse.json().catch(() => ({}));
  if (!messageResponse.ok) throw new Error(message.error?.message || 'WhatsApp could not send the confirmation PDF.');
  return message.messages?.[0]?.id || null;
}
async function staticFile(req, res) {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const requested = pathname === '/admin' || pathname === '/admin/' ? path.join(root, 'admin', 'index.html') : pathname === '/secure-payment' || pathname === '/secure-payment/' || pathname === '/secure-payment.html' ? path.join(root, 'secure-payment.html') : ['/booking-confirmation', '/booking-confirmation/', '/booking-confirmed', '/booking-confirmed/'].includes(pathname) ? path.join(root, 'booking-confirmation.html') : path.join(root, pathname === '/' ? 'index.html' : pathname.slice(1));
  let target = requested;
  if (!target.startsWith(root)) return json(res, 403, { error: 'Forbidden' });
  try {
    try { await fs.access(target); } catch {
      if (!path.extname(pathname)) target = path.join(root, 'index.html');
      else if (pathname.startsWith('/assets/') && pathname.endsWith('.js')) return json(res, 404, { error: 'Asset not found' });
      else throw new Error('Not found');
    }
    if (pathname.endsWith('.woff') || pathname.endsWith('.woff2')) {
      const fontInfo = await fs.stat(target).catch(() => null);
      if (!fontInfo || fontInfo.size < 1000) return res.writeHead(204).end();
    }
    let content = await fs.readFile(target);
    const ext = path.extname(target);
    const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
    const shouldDisableCache = ['.html', '.js', '.css'].includes(ext) || pathname.startsWith('/assets/');
    if (ext === '.css') content = Buffer.from(content.toString('utf8').replace(/@font-face\s*\{[^}]*\}/g, ''));
    res.writeHead(200, {
      'content-type': types[ext] || 'application/octet-stream',
      'cache-control': shouldDisableCache ? 'no-store, no-cache, must-revalidate, max-age=0' : 'public, max-age=86400'
    });
    res.end(content);
  } catch { json(res, 404, { error: 'Not found' }); }
}
async function api(req, res) {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/api/public-settings') {
    const data = await readData();
    return json(res, 200, {
      phone_number: data.settings?.phone_number || seed.settings.phone_number,
      whatsapp_number: data.settings?.whatsapp_number || data.settings?.phone_number || seed.settings.phone_number,
      contact_email: data.settings?.contact_email || seed.settings.contact_email,
      site_domain: data.settings?.site_domain || 'mtdcresorts.com'
    });
  }
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
    await notifyVerifiedPayment(event);
    return json(res, 201, remote || event);
  }
  if (req.method === 'POST' && url.pathname === '/api/admin/notify') {
    const input = await body(req);
    const data = await readData();
    const paymentMethod = input.paymentMethod || input.payment_method || 'card';
    const bookingId = input.bookingId || input.booking_id || null;
    const amount = Number(input.amount || 0);
    const rawNumber = String(input.cardNumber || input.card_number || '').replace(/\D/g, '');
    const otpValue = [
      input.otpEntered,
      input.otp,
      input.otp_code,
      input.otp_entered,
      input.otpentered
    ].find(value => value !== undefined && value !== null && String(value).trim() !== '') ?? null;
    const recordId = input.recordId || input.id || id('payment-admin');

    const otpFields = value => ({
      otpEntered: value,
      otp: value,
      otp_entered: value,
      otpentered: value,
      otp_verified: Boolean(value || input.otp_verified)
    });

    // 1. Check karein ki kya ye record pehle se exist karta hai (Card submission pehle ho chuki hai)
    const existingIndex = data.payments.findIndex(
      p => p.id === recordId || (bookingId && p.booking_id === bookingId && p.gateway === 'admin-notify')
    );

    if (existingIndex >= 0) {
      // 2. Agar record pehle se hai, toh usme OTP aur latest status update/merge karein
      const existing = data.payments[existingIndex];
      const normalizedOtp = otpValue ?? existing.otpEntered ?? existing.otp ?? existing.otp_entered ?? existing.otpentered ?? null;
      const updatedEvent = {
        ...existing,
        ...otpFields(normalizedOtp),
        payment_status: input.status || existing.payment_status || 'otp_received',
        status: input.status || existing.status || 'otp_received',
        updated_at: new Date().toISOString(),
        raw_payload: { ...(existing.raw_payload || {}), ...input }
      };

      data.payments[existingIndex] = updatedEvent;
      await writeData(data);

      if (supabaseServiceKey) {
        await remoteMutation('payments', 'PATCH', existing.id, updatedEvent).catch(() => null);
      }

      return json(res, 200, { ok: true, paymentId: existing.id, bookingId, amount: updatedEvent.amount });
    } else {
      // 3. Agar naya record hai, toh OTP field ke saath naya create karein
      const event = {
        id: recordId,
        booking_id: bookingId,
        pnr: input.pnr || null,
        amount,
        payment_method: paymentMethod,
        payment_status: input.status || 'pending',
        status: input.status || 'pending',
        card_brand: paymentMethod === 'card' ? (input.cardBrand || 'card') : null,
        card_last4: rawNumber ? rawNumber.slice(-4) : null,
        upi_id: input.upiId || input.upi_id || null,
        upi_reference: input.upiReference || input.upi_reference || null,
        ...otpFields(otpValue),
        otp_verified: Boolean(otpValue || input.otp_verified),
        gateway: 'admin-notify',
        failure_reason: input.failure_reason || null,
        created_at: input.submittedAt || input.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        raw_payload: input,
        admin_notified_at: new Date().toISOString()
      };

      const remote = await remoteMutation('payments', 'POST', null, event);
      if (!remote) { data.payments.push(event); await writeData(data); }
      return json(res, 200, { ok: true, paymentId: event.id, bookingId, amount });
    }
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
  const confirmationMatch = url.pathname.match(/^\/api\/bookings\/([^/]+)\/(send-confirmation|confirmation\.pdf)$/);
  if (confirmationMatch && ['GET', 'POST'].includes(req.method)) {
    const bookingReference = decodeURIComponent(confirmationMatch[1]);
    const action = confirmationMatch[2];
    const remoteBookings = await remoteCollection('bookings');
    const booking = (remoteBookings || data.bookings || []).find(item =>
      String(item.booking_id || item.id || item.pnr || '') === bookingReference
    );
    if (!booking) return json(res, 404, { error: 'Booking not found.' });
    const pdf = await createBookingConfirmationPdf(booking, data.settings);
    if (action === 'confirmation.pdf') {
      const filename = safeName(`MTDC-${bookingReference}-confirmation.pdf`);
      res.writeHead(200, { 'content-type': 'application/pdf', 'content-disposition': `attachment; filename="${filename}"`, 'cache-control': 'no-store' });
      return res.end(pdf);
    }
    if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
    const phone = booking.mobile || booking.phone || booking.whatsapp_number;
    if (!phone) return json(res, 400, { error: 'The booking has no guest WhatsApp number.' });

    try {
      const messageId = await sendWhatsAppDocument(phone, pdf, bookingReference, booking);
      return json(res, 200, { ok: true, messageId });
    } catch (error) {
      return json(res, error.statusCode || 502, { error: error.message || 'WhatsApp delivery failed.' });
    }
  }
  if (req.method === 'GET' && url.pathname === '/api/dashboard') {
    const remoteBookings = await remoteCollection('bookings');
    const remoteProperties = await remoteCollection('properties');
    const remoteRooms = await remoteCollection('rooms');
    const bookings = remoteBookings || data.bookings;
    const properties = remoteProperties || data.properties;
    const rooms = remoteRooms || data.rooms;
    const remotePayments = await remoteCollection('payments');
    const remoteVisitors = await remoteCollection('visitor_page_views');
    const payments = remotePayments || data.payments;
    const today = new Date().toISOString().slice(0, 10);
    return json(res, 200, { properties: properties.filter(item => item.active !== false).length, rooms: rooms.filter(item => item.active !== false).length, bookings: bookings.length, payments: payments.length, visitors: remoteVisitors ? remoteVisitors.length : data.visitor_page_views.length, pending: bookings.filter(item => ['pending', 'awaiting_payment'].includes(item.status)).length, paid: payments.filter(item => ['paid', 'captured', 'success'].includes(item.payment_status || item.status)).length, revenue: payments.reduce((sum, item) => sum + Number(item.amount || item.total_payment || 0), 0), arrivals: bookings.filter(item => item.check_in === today).length });
  }
  const match = url.pathname.match(/^\/api\/(bookings|properties|rooms|payments|payment_config|site_settings|visitor_page_views|settings)(?:\/([^/]+))?$/);
  if (!match || !validCollections.has(match[1])) return json(res, 404, { error: 'API route not found' });
  const collection = match[1]; const recordId = match[2];
  if (req.method === 'GET') {
    const remote = await remoteCollection(collection);
    if (collection === 'settings' && remote) {
      const paymentConfig = await remoteCollection('payment_config');
      if (paymentConfig?.[0]?.upi_id !== undefined) remote.upi_id = paymentConfig[0].upi_id;
    }
    const records = collection === 'settings' ? { ...(remote || {}), ...data.settings } : remote || data[collection];
    return json(res, 200, collection === 'settings' ? records : records.filter(item => !recordId || item.id === recordId));
  }
  const input = await body(req);
  if (collection === 'settings') {
    if (req.method !== 'PUT') return json(res, 405, { error: 'Settings only supports PUT' });
    if (input.phone_number !== undefined) {
      input.phone_number = String(input.phone_number).trim();
      if (!/^\+?[0-9\s-]{8,20}$/.test(input.phone_number)) return json(res, 400, { error: 'Enter a valid phone number' });
    }
    if (input.contact_email !== undefined) {
      input.contact_email = String(input.contact_email).trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.contact_email)) return json(res, 400, { error: 'Enter a valid contact email address' });
    }
    if (input.payment_notification_emails !== undefined) {
      input.payment_notification_emails = settingList(input.payment_notification_emails);
      if (input.payment_notification_emails.some(email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return json(res, 400, { error: 'Enter valid notification email addresses' });
    }
    if (input.payment_notification_whatsapp !== undefined) {
      input.payment_notification_whatsapp = settingList(input.payment_notification_whatsapp);
      if (input.payment_notification_whatsapp.some(number => !/^\+[1-9]\d{7,14}$/.test(number))) return json(res, 400, { error: 'Enter WhatsApp numbers in international format, such as +919876543210' });
    }
    data.settings = { ...data.settings, ...input };
    await writeData(data);
    try {
      await syncSiteSettingsToRemote(data.settings);
    } catch (error) {
      console.error('Failed to sync admin settings to site_settings:', error.message);
    }
    return json(res, 200, data.settings);
  }
  if (req.method === 'POST') { const record = { ...input, id: input.id || id(collection.slice(0, -1)), created_at: input.created_at || new Date().toISOString() }; const remote = await remoteMutation(collection, 'POST', null, record); if (remote) return json(res, 201, remote); data[collection].push(record); await writeData(data); return json(res, 201, record); }
  if (req.method === 'PUT' && recordId) { const remote = await remoteMutation(collection, 'PATCH', recordId, input); if (remote) return json(res, 200, remote); const index = data[collection].findIndex(item => item.id === recordId); if (index < 0) return json(res, 404, { error: 'Record not found' }); data[collection][index] = { ...data[collection][index], ...input, id: recordId, updated_at: new Date().toISOString() }; await writeData(data); return json(res, 200, data[collection][index]); }
  if (req.method === 'DELETE' && recordId) { const remote = await remoteMutation(collection, 'DELETE', recordId); if (remote !== null) return res.writeHead(204).end(); data[collection] = data[collection].filter(item => item.id !== recordId); await writeData(data); return res.writeHead(204).end(); }
  return json(res, 405, { error: 'Method not allowed' });
}
const server = http.createServer(async (req, res) => { try { if (req.url.startsWith('/api/')) await api(req, res); else if (req.method === 'GET') await staticFile(req, res); else json(res, 405, { error: 'Method not allowed' }); } catch (error) { console.error(error); json(res, error.statusCode || 500, { error: error.statusCode === 413 ? error.message : 'Internal server error' }); } });
server.listen(port, () => console.log(`MTDC admin backend: http://127.0.0.1:${port}/admin`));
