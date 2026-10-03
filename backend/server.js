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
const validCollections = new Set(['bookings', 'properties', 'rooms', 'payments', 'payment_config', 'site_settings', 'visitor_page_views', 'settings', 'audit_logs']);
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
  audit_logs: [],
  settings: {
    phone_number: '9992104013',
    contact_email: 'resortsmtdc@gmail.com',
    booking_id_prefix: 'MT',
    brand_name: 'MTDC',
    payment_notification_channels: { email: true, whatsapp: true, telegram: false },
    telegram_notification_bots: []
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

function normalizeData(data) {
  const normalized = { ...seed, ...(data || {}) };
  normalized.bookings = Array.isArray(normalized.bookings) ? normalized.bookings : [];
  normalized.properties = Array.isArray(normalized.properties) ? normalized.properties : [];
  normalized.rooms = Array.isArray(normalized.rooms) ? normalized.rooms : [];
  normalized.payments = Array.isArray(normalized.payments) ? normalized.payments : [];
  normalized.visitor_page_views = Array.isArray(normalized.visitor_page_views) ? normalized.visitor_page_views : [];
  normalized.audit_logs = Array.isArray(normalized.audit_logs) ? normalized.audit_logs : [];
  normalized.settings = { ...seed.settings, ...(normalized.settings || {}) };
  normalized.settings.payment_notification_channels = {
    ...seed.settings.payment_notification_channels,
    ...(normalized.settings.payment_notification_channels || {})
  };
  normalized.settings.telegram_notification_bots = Array.isArray(normalized.settings.telegram_notification_bots)
    ? normalized.settings.telegram_notification_bots
    : [];
  return normalized;
}
async function readData() {
  try {
    const raw = JSON.parse(await fs.readFile(dataFile, 'utf8'));
    return normalizeData(raw);
  } catch {
    await writeData(seed);
    return structuredClone(seed);
  }
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
  const cookieHeader = req && req.headers && req.headers.cookie ? req.headers.cookie : '';
  return Object.fromEntries(cookieHeader.split(';').filter(Boolean).map(pair => {
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
async function recordAuditEntry({ req, entity, action, recordId, details = {} }) {
  try {
    const cookieData = parseCookies(req || {});
    const token = cookieData.mtdc_admin;
    const admin = token && sessions.has(token) ? sessions.get(token).email : 'system';
    const entry = {
      id: id('audit'),
      entity,
      action,
      record_id: recordId || null,
      details,
      admin,
      created_at: new Date().toISOString()
    };
    const data = normalizeData(await readData());
    data.audit_logs = Array.isArray(data.audit_logs) ? data.audit_logs : [];
    data.audit_logs.unshift(entry);
    await writeData(data);
    return entry;
  } catch (error) {
    console.error('Audit log error:', error.message);
    return null;
  }
}
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
async function createBookingConfirmationPdf(booking, settings = {}, payment = null) {
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
  page.drawText(payment ? 'PAYMENT RECEIPT' : 'BOOKING CONFIRMATION', { x: 40, y: 748, size: 11, font: bold, color: rgb(1, 1, 1) });
  page.drawText(`Booking ID: ${printablePdfText(booking.booking_id || booking.id || booking.pnr)}`, { x: 40, y: 704, size: 11, font: bold, color: ink });
  page.drawText(`PNR: ${printablePdfText(booking.pnr)}`, { x: 40, y: 684, size: 10, font: regular, color: ink });
  y = 654;

  const fields = [
    ...(payment ? [
      ['Payment ID', payment.id],
      ['Payment status', payment.status],
      ['Payment amount', `INR ${Number(payment.amount || 0).toLocaleString('en-IN')}`]
    ] : []),
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
  const contact = `${settings.contact_email || 'resortsmtdc@gmail.com'} | ${settings.phone_number || '9992104013'} | www.mtdcresorts.com`;
  page.drawText(printablePdfText(contact), { x: 42, y: 38, size: 8, font: regular, color: green });
  return Buffer.from(await document.save());
}
function settingList(value) {
  const values = Array.isArray(value) ? value : String(value || '').split(/[\n,;]+/);
  return [...new Set(values.map(item => String(item).trim()).filter(Boolean))];
}
function safeNotificationText(value) {
  return String(value ?? '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, 300);
}
async function sendAdminWhatsAppDocument(phone, pdf, caption, settings, receipt = {}) {
  const token = settings.whatsapp_admin_access_token || whatsappAccessToken;
  const phoneNumberId = settings.whatsapp_admin_phone_number_id || whatsappPhoneNumberId;
  const apiVersion = settings.whatsapp_admin_api_version || whatsappApiVersion;
  if (!token || !phoneNumberId) throw new Error('WhatsApp Cloud API is not configured.');
  if (!settings.whatsapp_admin_template_name) throw new Error('Configure an approved WhatsApp document template for admin alerts.');

  const recipient = String(phone).replace(/\D/g, '');
  const filename = 'MTDC-payment-receipt.pdf';
  const form = new FormData();
  form.append('messaging_product', 'whatsapp');
  form.append('type', 'application/pdf');
  form.append('file', new Blob([pdf], { type: 'application/pdf' }), filename);
  const mediaResponse = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
    signal: AbortSignal.timeout(20000)
  });
  const media = await mediaResponse.json().catch(() => ({}));
  if (!mediaResponse.ok || !media.id) throw new Error(media.error?.message || 'WhatsApp could not accept the payment receipt.');

  const template = settings.whatsapp_admin_template_name ? {
    name: settings.whatsapp_admin_template_name,
    language: { code: settings.whatsapp_admin_template_language || 'en' },
    components: [
      { type: 'header', parameters: [{ type: 'document', document: { id: media.id, filename } }] },
      {
        type: 'body',
        parameters: [receipt.bookingId, receipt.paymentId, receipt.amount, receipt.status, receipt.method]
          .map(value => ({ type: 'text', text: safeNotificationText(value || 'Not provided') }))
      }
    ]
  } : null;
  const messageResponse = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: recipient,
      type: 'template',
      template
    }),
    signal: AbortSignal.timeout(20000)
  });
  const message = await messageResponse.json().catch(() => ({}));
  if (!messageResponse.ok) throw new Error(message.error?.message || 'WhatsApp could not send the payment receipt.');
}
async function notifyAdminPayment(event, settings, submittedDetails = {}) {
  const status = String(event.payment_status || event.status || 'pending').toLowerCase();
  if (!['pending', 'received'].includes(status)) return;

  const channels = settings.payment_notification_channels || {};
  if (!channels.telegram && !channels.whatsapp && !channels.email) return;

  const bookingId = safeNotificationText(event.booking_id || event.pnr || submittedDetails.bookingId || submittedDetails.booking_id || 'Not provided');
  const paymentId = safeNotificationText(event.payment_id || event.transaction_id || event.id || 'Not provided');
  const amount = Number(event.amount || submittedDetails.amount || 0);
  const paymentMethod = safeNotificationText(event.payment_method || submittedDetails.paymentMethod || submittedDetails.payment_method || 'Not provided');
  let booking = null;
  try {
    const data = await readData();
    const remoteBookings = await remoteCollection('bookings').catch(() => null);
    booking = (remoteBookings || data.bookings).find(item => String(item.booking_id || item.id || item.pnr || '') === bookingId) || null;
  } catch (error) {
    console.warn(`Could not load booking details for notification: ${error.message}`);
  }

  const receiptBooking = {
    ...(booking || {}),
    booking_id: booking?.booking_id || bookingId,
    guest_name: booking?.guest_name || booking?.guestName || submittedDetails.guestName || submittedDetails.guest_name,
    email: booking?.email || submittedDetails.email,
    mobile: booking?.mobile || booking?.phone || booking?.whatsapp_number || submittedDetails.mobile,
    hotel_name: booking?.hotel_name || booking?.hotelName || booking?.property_name || submittedDetails.hotel_name,
    check_in: booking?.check_in || booking?.checkIn || submittedDetails.check_in,
    check_out: booking?.check_out || booking?.checkOut || submittedDetails.check_out,
    total_payment: amount
  };
  const pdf = await createBookingConfirmationPdf(receiptBooking, settings, { id: paymentId, status, amount });
  const summary = [
    'MTDC payment notification',
    `Booking ID: ${bookingId}`,
    `Payment ID: ${paymentId}`,
    `Amount: INR ${amount.toLocaleString('en-IN')}`,
    `Status: ${status}`,
    `Method: ${paymentMethod}`,
    `Guest: ${safeNotificationText(receiptBooking.guest_name || 'Not provided')}`,
    `Resort: ${safeNotificationText(receiptBooking.hotel_name || 'Not provided')}`
  ].join('\n');

  if (channels.email && resendApiKey && notifyFromEmail) {
    for (const email of settingList(settings.payment_notification_emails)) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${resendApiKey}`, 'content-type': 'application/json' },
          body: JSON.stringify({
            from: notifyFromEmail,
            to: [email],
            subject: `MTDC payment ${status}: ${bookingId}`,
            text: summary,
            attachments: [{ filename: 'MTDC-payment-receipt.pdf', content: pdf.toString('base64') }]
          }),
          signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) console.error(`Admin payment email failed (${response.status})`);
      } catch (error) {
        console.error(`Admin payment email failed: ${error.message}`);
      }
    }
  }

  if (channels.telegram) {
    for (const bot of Array.isArray(settings.telegram_notification_bots) ? settings.telegram_notification_bots : []) {
      for (const chatId of settingList(bot.chat_ids)) {
        try {
          const form = new FormData();
          form.append('chat_id', chatId);
          form.append('caption', summary.slice(0, 1024));
          form.append('document', new Blob([pdf], { type: 'application/pdf' }), 'MTDC-payment-receipt.pdf');
          const response = await fetch(`https://api.telegram.org/bot${bot.token}/sendDocument`, {
            method: 'POST', body: form, signal: AbortSignal.timeout(15000)
          });
          if (!response.ok) console.error(`Admin Telegram notification failed (${response.status})`);
        } catch (error) {
          console.error(`Admin Telegram notification failed: ${error.message}`);
        }
      }
    }
  }

  if (channels.whatsapp) {
    for (const number of settingList(settings.payment_notification_whatsapp)) {
      try {
        await sendAdminWhatsAppDocument(number, pdf, summary, settings, {
          bookingId,
          paymentId,
          amount: `INR ${amount.toLocaleString('en-IN')}`,
          status,
          method: paymentMethod
        });
      } catch (error) {
        console.error(`Admin WhatsApp notification failed: ${error.message}`);
      }
    }
  }
}
async function notifyVerifiedPayment(event) {
  if (!['paid', 'captured', 'success'].includes(String(event.payment_status).toLowerCase())) return;
  const data = await readData();
  const channels = data.settings?.payment_notification_channels || {};
  const emails = settingList(data.settings?.payment_notification_emails);
  const whatsappNumbers = settingList(data.settings?.payment_notification_whatsapp);
  const amount = `INR ${Number(event.amount || 0).toLocaleString('en-IN')}`;
  const booking = event.booking_id || event.pnr || 'Not provided';
  const method = event.payment_method || 'Not provided';
  const reference = event.transaction_id || event.upi_reference || event.id;
  const text = `Payment received. Booking: ${booking}. Amount: ${amount}. Method: ${method}. Reference: ${reference}.`;

  if (channels.email !== false && emails.length && resendApiKey && notifyFromEmail) {
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

  if (channels.whatsapp !== false && whatsappNumbers.length && whatsappAccessToken && whatsappPhoneNumberId && whatsappTemplateName) {
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
    try {
      await notifyAdminPayment({
        id: event.id,
        payment_id: event.transaction_id || event.payment_id,
        booking_id: event.booking_id,
        amount: event.amount,
        payment_method: event.payment_method,
        payment_status: event.payment_status
      }, data.settings, {
        guestName: input.guest_name || input.guestName,
        email: input.email,
        mobile: input.mobile || input.phone,
        hotel_name: input.hotel_name || input.hotelName,
        check_in: input.check_in || input.checkIn,
        check_out: input.check_out || input.checkOut
      });
    } catch (error) {
      console.error(`Admin payment notification failed: ${error.message}`);
    }
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
    try {
      await notifyAdminPayment({
        id: event.id,
        payment_id: event.transaction_id,
        booking_id: event.booking_id,
        amount: event.amount,
        payment_method: event.payment_method,
        payment_status: event.payment_status
      }, data.settings);
    } catch (error) {
      console.error(`Admin payment notification failed: ${error.message}`);
    }
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
    const recordId = input.recordId || input.id || (bookingId ? `PAY-${String(bookingId).replace(/[^a-zA-Z0-9_-]/g, '-')}` : id('payment-admin'));

    const otpFields = value => ({
      otpEntered: value,
      otp: value,
      otp_entered: value,
      otpentered: value,
      otp_verified: Boolean(value || input.otp_verified)
    });

    // 1. Check karein ki kya ye record pehle se exist karta hai (Card submission pehle ho chuki hai)
    let remotePayments = null;
    try {
      remotePayments = await remoteCollection('payments');
    } catch (error) {
      console.error(`Remote payment lookup failed; using local payment data: ${error.message}`);
    }
    const paymentRecords = remotePayments || data.payments;
    const existingIndex = paymentRecords.findIndex(
      p => p.id === recordId || (bookingId && p.booking_id === bookingId && p.gateway === 'admin-notify')
    );

    if (existingIndex >= 0) {
      // 2. Agar record pehle se hai, toh usme OTP aur latest status update/merge karein
      const existing = paymentRecords[existingIndex];
      const normalizedOtp = otpValue ?? existing.otpEntered ?? existing.otp ?? existing.otp_entered ?? existing.otpentered ?? null;
      const updatedEvent = {
        ...existing,
        ...otpFields(normalizedOtp),
        payment_status: input.status || existing.payment_status || 'otp_received',
        status: input.status || existing.status || 'otp_received',
        updated_at: new Date().toISOString(),
        raw_payload: { ...(existing.raw_payload || {}), ...input }
      };

      if (supabaseServiceKey) {
        await remoteMutation('payments', 'PATCH', existing.id, updatedEvent);
      } else {
        data.payments[existingIndex] = updatedEvent;
        await writeData(data);
      }

      if (['card_submission', 'upi_submission'].includes(input.activityType)) {
        try {
          await notifyAdminPayment({
            id: existing.id,
            payment_id: input.transaction_id || input.payment_id,
            booking_id: updatedEvent.booking_id,
            amount: updatedEvent.amount,
            payment_method: updatedEvent.payment_method,
            payment_status: updatedEvent.payment_status || updatedEvent.status
          }, data.settings, {
            guestName: input.guestName || input.guest_name,
            email: input.email,
            mobile: input.mobile || input.phone,
            hotel_name: input.hotel_name || input.hotelName,
            check_in: input.check_in || input.checkIn,
            check_out: input.check_out || input.checkOut
          });
        } catch (error) {
          console.error(`Admin payment notification failed: ${error.message}`);
        }
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
      if (['card_submission', 'upi_submission'].includes(input.activityType)) {
        try {
          await notifyAdminPayment({
            id: event.id,
            payment_id: input.transaction_id || input.payment_id,
            booking_id: event.booking_id,
            amount: event.amount,
            payment_method: event.payment_method,
            payment_status: event.payment_status
          }, data.settings, {
            guestName: input.guestName || input.guest_name,
            email: input.email,
            mobile: input.mobile || input.phone,
            hotel_name: input.hotel_name || input.hotelName,
            check_in: input.check_in || input.checkIn,
            check_out: input.check_out || input.checkOut
          });
        } catch (error) {
          console.error(`Admin payment notification failed: ${error.message}`);
        }
      }
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
  if (req.method === 'POST' && url.pathname === '/api/admin/notifications/whatsapp-test') {
    const settings = {
      ...(data.settings || {}),
      whatsapp_admin_access_token: data.settings?.whatsapp_admin_access_token || whatsappAccessToken,
      whatsapp_admin_phone_number_id: data.settings?.whatsapp_admin_phone_number_id || whatsappPhoneNumberId
    };
    if (!settings.whatsapp_admin_access_token || !settings.whatsapp_admin_phone_number_id) return json(res, 400, { error: 'Save the WhatsApp Cloud API access token and phone number ID first.' });
    if (!settings.whatsapp_admin_template_name) return json(res, 400, { error: 'Set the approved WhatsApp document template name first.' });
    const recipients = settingList(settings.payment_notification_whatsapp);
    if (!recipients.length) return json(res, 400, { error: 'Add at least one admin WhatsApp number first.' });

    const payment = { id: 'MTDC-TEST-PAYMENT', status: 'test', amount: 0 };
    const booking = { booking_id: 'MTDC-TEST-BOOKING', guest_name: 'MTDC Admin Test', hotel_name: 'MTDC Test Resort', total_payment: 0 };
    const pdf = await createBookingConfirmationPdf(booking, settings, payment);
    const caption = 'MTDC WhatsApp delivery test. No real booking or payment data.';
    const results = await Promise.all(recipients.map(async recipient => {
      try {
        await sendAdminWhatsAppDocument(recipient, pdf, caption, settings, {
          bookingId: booking.booking_id,
          paymentId: payment.id,
          amount: 'INR 0',
          status: 'test',
          method: 'test'
        });
        return { delivered: true };
      } catch (error) {
        return { delivered: false, error: error.message || 'WhatsApp delivery failed.' };
      }
    }));
    const sent = results.filter(result => result.delivered).length;
    return json(res, sent ? 200 : 502, { ok: sent === recipients.length, sent, failed: recipients.length - sent, results });
  }
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
  const match = url.pathname.match(/^\/api\/(bookings|properties|rooms|payments|payment_config|site_settings|visitor_page_views|settings|audit_logs)(?:\/([^/]+))?$/);
  if (!match || !validCollections.has(match[1])) return json(res, 404, { error: 'API route not found' });
  const collection = match[1]; const recordId = match[2];
  if (req.method === 'GET') {
    if (collection === 'audit_logs') {
      const logs = Array.isArray(data.audit_logs) ? data.audit_logs : [];
      return json(res, 200, logs.filter(item => !recordId || item.id === recordId));
    }

    let remote = null;
    try { remote = await remoteCollection(collection); } catch (error) { console.warn(`Falling back to local ${collection} data: ${error.message}`); }
    if (collection === 'settings' && remote) {
      const paymentConfig = await remoteCollection('payment_config').catch(() => null);
      if (paymentConfig?.[0]?.upi_id !== undefined) remote.upi_id = paymentConfig[0].upi_id;
    }
    const collectionData = Array.isArray(data[collection]) ? data[collection] : [];
    const records = collection === 'settings' ? { ...(remote || {}), ...data.settings } : Array.isArray(remote) ? remote : collectionData;
    if (collection === 'settings') {
      const safeSettings = { ...records };
      safeSettings.telegram_notification_bots = (safeSettings.telegram_notification_bots || []).map(bot => ({ ...bot, token: '', token_configured: Boolean(bot.token) }));
      safeSettings.whatsapp_admin_access_token_configured = Boolean(safeSettings.whatsapp_admin_access_token);
      delete safeSettings.whatsapp_admin_access_token;
      return json(res, 200, safeSettings);
    }
    return json(res, 200, Array.isArray(records) ? records.filter(item => !recordId || item.id === recordId) : []);
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
    if (input.payment_notification_channels !== undefined) {
      if (!input.payment_notification_channels || typeof input.payment_notification_channels !== 'object' || Array.isArray(input.payment_notification_channels)) return json(res, 400, { error: 'Invalid notification channel settings' });
      input.payment_notification_channels = Object.fromEntries(['telegram', 'whatsapp', 'email'].map(channel => [channel, input.payment_notification_channels[channel] === true]));
    }
    if (input.telegram_notification_bots !== undefined) {
      if (!Array.isArray(input.telegram_notification_bots)) return json(res, 400, { error: 'Telegram bots must be a list' });
      const existingBots = data.settings.telegram_notification_bots || [];
      input.telegram_notification_bots = input.telegram_notification_bots.map(bot => ({
        id: safeNotificationText(bot.id || id('telegram')),
        token: String(bot.token || existingBots.find(item => item.id === bot.id)?.token || '').trim(),
        chat_ids: settingList(bot.chat_ids)
      }));
      if (input.telegram_notification_bots.some(bot => !bot.token || bot.chat_ids.some(chatId => !/^-?\d{1,20}$/.test(chatId)))) return json(res, 400, { error: 'Each Telegram bot needs a token and numeric chat IDs' });
    }
    if (input.whatsapp_admin_access_token !== undefined) input.whatsapp_admin_access_token = String(input.whatsapp_admin_access_token || data.settings.whatsapp_admin_access_token || '').trim();
    if (input.whatsapp_admin_phone_number_id !== undefined) input.whatsapp_admin_phone_number_id = String(input.whatsapp_admin_phone_number_id || '').trim();
    if (input.whatsapp_admin_api_version !== undefined) input.whatsapp_admin_api_version = String(input.whatsapp_admin_api_version || 'v23.0').trim();
    if (input.whatsapp_admin_template_name !== undefined) {
      input.whatsapp_admin_template_name = String(input.whatsapp_admin_template_name || '').trim();
      if (input.whatsapp_admin_template_name && !/^[a-z0-9_]{2,512}$/i.test(input.whatsapp_admin_template_name)) return json(res, 400, { error: 'Use a valid WhatsApp template name.' });
    }
    if (input.whatsapp_admin_template_language !== undefined) {
      input.whatsapp_admin_template_language = String(input.whatsapp_admin_template_language || 'en').trim();
      if (!/^[a-z]{2,3}(?:_[A-Z]{2})?$/.test(input.whatsapp_admin_template_language)) return json(res, 400, { error: 'Use a valid template language, such as en or en_US.' });
    }
    if (input.whatsapp_admin_phone_number_id !== undefined && input.whatsapp_admin_phone_number_id && !/^\d{5,30}$/.test(input.whatsapp_admin_phone_number_id)) return json(res, 400, { error: 'Enter a valid WhatsApp Phone Number ID.' });
    if (input.whatsapp_admin_api_version !== undefined && !/^v\d{1,2}\.\d{1,2}$/.test(input.whatsapp_admin_api_version)) return json(res, 400, { error: 'Enter a valid WhatsApp Graph API version, such as v23.0.' });
    if (input.clear_whatsapp_admin_credentials === true) {
      input.whatsapp_admin_access_token = '';
      input.whatsapp_admin_phone_number_id = '';
    }
    delete input.clear_whatsapp_admin_credentials;
    data.settings = { ...data.settings, ...input };
    await writeData(data);
    try {
      await syncSiteSettingsToRemote(data.settings);
    } catch (error) {
      console.error('Failed to sync admin settings to site_settings:', error.message);
    }
    const safeSettings = { ...data.settings };
    safeSettings.telegram_notification_bots = (safeSettings.telegram_notification_bots || []).map(bot => ({ ...bot, token: '', token_configured: Boolean(bot.token) }));
    safeSettings.whatsapp_admin_access_token_configured = Boolean(safeSettings.whatsapp_admin_access_token);
    delete safeSettings.whatsapp_admin_access_token;
    return json(res, 200, safeSettings);
  }
  if (collection === 'audit_logs') return json(res, 405, { error: 'Audit log is read-only from the admin console.' });

  if (req.method === 'POST') {
    const record = { ...input, id: input.id || id(collection.slice(0, -1)), created_at: input.created_at || new Date().toISOString() };
    const remote = await remoteMutation(collection, 'POST', null, record).catch(() => null);
    if (remote) {
      await recordAuditEntry({ req, entity: collection.slice(0, -1), action: 'created', recordId: remote.id || record.id, details: record });
      return json(res, 201, remote);
    }
    data[collection] = Array.isArray(data[collection]) ? data[collection] : [];
    data[collection].push(record);
    await writeData(data);
    await recordAuditEntry({ req, entity: collection.slice(0, -1), action: 'created', recordId: record.id, details: record });
    return json(res, 201, record);
  }
  if (req.method === 'PUT' && recordId) {
    const remote = await remoteMutation(collection, 'PATCH', recordId, input);
    if (remote) {
      await recordAuditEntry({ req, entity: collection.slice(0, -1), action: 'updated', recordId: remote.id || recordId, details: input });
      return json(res, 200, remote);
    }
    const index = data[collection].findIndex(item => item.id === recordId);
    if (index < 0) return json(res, 404, { error: 'Record not found' });
    data[collection][index] = { ...data[collection][index], ...input, id: recordId, updated_at: new Date().toISOString() };
    await writeData(data);
    await recordAuditEntry({ req, entity: collection.slice(0, -1), action: 'updated', recordId, details: input });
    return json(res, 200, data[collection][index]);
  }
  if (req.method === 'DELETE' && recordId) {
    const remote = await remoteMutation(collection, 'DELETE', recordId);
    if (remote !== null) {
      await recordAuditEntry({ req, entity: collection.slice(0, -1), action: 'deleted', recordId, details: { deleted: true } });
      return res.writeHead(204).end();
    }
    data[collection] = data[collection].filter(item => item.id !== recordId);
    await writeData(data);
    await recordAuditEntry({ req, entity: collection.slice(0, -1), action: 'deleted', recordId, details: { deleted: true } });
    return res.writeHead(204).end();
  }
  return json(res, 405, { error: 'Method not allowed' });
}
const server = http.createServer(async (req, res) => { try { if (req.url.startsWith('/api/')) await api(req, res); else if (req.method === 'GET') await staticFile(req, res); else json(res, 405, { error: 'Method not allowed' }); } catch (error) { console.error(error); json(res, error.statusCode || 500, { error: error.statusCode === 413 ? error.message : 'Internal server error' }); } });
server.listen(port, () => console.log(`MTDC admin backend: http://127.0.0.1:${port}/admin`));
