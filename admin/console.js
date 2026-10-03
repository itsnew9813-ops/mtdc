const app = document.querySelector('#app');
let refreshTimer = null;
let payments = [];
let bookings = [];
let properties = [];
let rooms = [];
let activeView = 'payments';
let bookingTableFilter = { search: '', status: 'all' };

function setAdminTheme(theme) {
  const selectedTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = selectedTheme;
  try { localStorage.setItem('mtdc-admin-theme', selectedTheme); } catch {}
}

function getAdminTheme() {
  try { return localStorage.getItem('mtdc-admin-theme') === 'dark' ? 'dark' : 'light'; } catch { return 'light'; }
}

document.documentElement.dataset.theme = getAdminTheme();

// Helper functions
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
}[character]));

const paymentKey = (payment) => String(payment.id || payment.payment_id || payment.transaction_id || '');
const formatMoney = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
const formatDate = (value) => value ? new Date(value).toLocaleString() : 'Not available';
const maskUpi = (value) => String(value || '').replace(/^(.).*(@.*)$/, '$1***$2');

// API Wrapper
async function api(route, options = {}) {
  const response = await fetch(`/api${route}`, {
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json', ...options.headers },
    ...options
  });
  const result = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result?.error || `Request failed (${response.status})`);
  return result;
}

// 1. Initial Console Loader (Prevents initial page freeze)
function showInitialLoading() {
  app.innerHTML = `
    <main class="login-shell" style="display:flex; justify-content:center; align-items:center; min-height:100vh;">
      <div class="panel" style="padding:2rem; text-align:center;">
        <div class="mark" style="margin-bottom:0.5rem; font-weight:bold;">MTDC / OPERATIONS</div>
        <h2>Loading admin console…</h2>
        <p style="color:#6d7971; margin-top:0.5rem;">Authenticating session, please wait.</p>
      </div>
    </main>
  `;
}

// 2. Login Screen
function showLogin(message = '') {
  if (refreshTimer) clearInterval(refreshTimer);
  
  app.innerHTML = `
    <main class="login-shell">
      <form class="login-card">
        <div class="mark">MTDC / OPERATIONS</div>
        <h1>Admin console</h1>
          <p>Manage bookings and review payment records.</p>
        <div class="field">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" autocomplete="username" required>
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required>
        </div>
        ${message ? `<div class="error" role="alert" style="margin-bottom:1rem; color:#e53e3e;">${escapeHtml(message)}</div>` : ''}
        <button class="btn" type="submit" id="login-submit">Sign in</button>
      </form>
    </main>
  `;

  app.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const btn = app.querySelector('#login-submit');
    btn.disabled = true;
    btn.textContent = 'Signing in…';

    const form = new FormData(event.currentTarget);
    try {
      const user = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: form.get('email'), password: form.get('password') })
      });
      await showPayments(user);
    } catch (error) {
      showLogin(error.message || 'Authentication failed. Please try again.');
    }
  });
}

// 3. Main Dashboard Shell
async function showPayments(user) {
  if (refreshTimer) clearInterval(refreshTimer);
  activeView = 'payments';

  app.innerHTML = `
    <div class="console">
      <aside class="sidebar">
        <div class="brand">MTDC <small>ADMIN CONSOLE</small></div>
        <nav class="nav">
          <button class="active" type="button" data-view="dashboard">Dashboard</button>
          <button type="button" data-view="payments">Payments</button>
          <button type="button" data-view="bookings">Bookings</button>
          <button type="button" data-view="properties">Properties</button>
          <button type="button" data-view="rooms">Rooms</button>
          <button type="button" data-view="notify">Notify</button>
          <button type="button" data-view="payment-alerts">Payment Alerts</button>
        </nav>
        <button class="logout" id="logout">Sign out</button>
      </aside>
      <main class="main">
        <header class="topbar">
          <div>
            <div class="eyebrow">Maharashtra Unlimited</div>
            <h1 id="view-title">Payments</h1>
          </div>
          <div class="topbar-actions">
            <label class="theme-switch" for="theme-toggle">
              <input id="theme-toggle" type="checkbox" role="switch" aria-label="Enable dark mode" ${getAdminTheme() === 'dark' ? 'checked' : ''}>
              <span class="theme-track" aria-hidden="true"><span></span></span>
              <span>Dark mode</span>
            </label>
            <div class="user">${escapeHtml(user?.email || 'Admin')}</div>
          </div>
        </header>
        <section id="payment-content"></section>
      </main>
    </div>
  `;

  app.querySelector('#logout').addEventListener('click', async () => {
    try { await api('/auth/logout', { method: 'POST' }); } finally { showLogin(); }
  });

  app.querySelector('#theme-toggle').addEventListener('change', (event) => {
    setAdminTheme(event.currentTarget.checked ? 'dark' : 'light');
  });

  app.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));
  await setView('payments');
}

async function setView(view) {
  activeView = view;
  if (refreshTimer) clearInterval(refreshTimer);
  app.querySelectorAll('[data-view]').forEach((button) => button.classList.toggle('active', button.dataset.view === view));

  const label = view === 'dashboard' ? 'Dashboard' : view === 'payment-alerts' ? 'Payment Alerts' : view === 'notify' ? 'Notify' : view === 'bookings' ? 'Bookings' : view === 'properties' ? 'Properties' : view === 'rooms' ? 'Rooms' : 'Payments';
  document.querySelector('#view-title').textContent = label;

  if (view === 'dashboard') {
    await loadDashboard();
    refreshTimer = setInterval(() => loadDashboard(), 30000);
    return;
  }
  if (view === 'notify') {
    await loadNotificationSettings();
    return;
  }
  if (view === 'payment-alerts') {
    await loadPaymentAlertSettings();
    return;
  }
  if (view === 'bookings') {
    await loadBookings();
    refreshTimer = setInterval(() => loadBookings(), 30000);
    return;
  }
  if (view === 'properties') {
    await loadProperties();
    refreshTimer = setInterval(() => loadProperties(), 30000);
    return;
  }
  if (view === 'rooms') {
    await loadRooms();
    refreshTimer = setInterval(() => loadRooms(), 30000);
    return;
  }

  await loadPayments(true);
  refreshTimer = setInterval(() => loadPayments(false), 10000);
}

function bookingId(booking) {
  return String(booking.booking_id || booking.id || booking.pnr || '');
}

function bookingPhone(booking) {
  return String(booking.mobile || booking.phone || booking.whatsapp_number || '').trim();
}

function getBookingStatus(booking) {
  return String(booking.status || 'pending').toLowerCase();
}

function getFilteredBookings() {
  const rows = [...bookings].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  const query = bookingTableFilter.search.trim().toLowerCase();
  const status = bookingTableFilter.status || 'all';

  return rows.filter((booking) => {
    const text = [
      bookingId(booking),
      booking.pnr,
      booking.guest_name,
      booking.guestName,
      booking.customer_name,
      booking.email,
      booking.hotel_name,
      booking.hotelName,
      booking.property_name,
      booking.room_category,
      booking.roomCategory,
      booking.mobile,
      booking.phone,
      booking.whatsapp_number,
      booking.check_in,
      booking.check_out
    ].filter(Boolean).join(' ').toLowerCase();

    const matchesSearch = !query || text.includes(query);
    const matchesStatus = status === 'all' || getBookingStatus(booking) === status;
    return matchesSearch && matchesStatus;
  });
}

function exportBookingsCsv() {
  const rows = getFilteredBookings();
  const headers = ['Booking ID', 'PNR', 'Guest', 'Email', 'Resort', 'Room', 'Check-in', 'Check-out', 'Status', 'Amount', 'WhatsApp'];
  const csvRows = [headers.join(',')].concat(rows.map((booking) => {
    const values = [
      bookingId(booking),
      booking.pnr || '',
      booking.guest_name || booking.guestName || booking.customer_name || '',
      booking.email || '',
      booking.hotel_name || booking.hotelName || booking.property_name || '',
      booking.room_category || booking.roomCategory || '',
      booking.check_in || booking.checkIn || '',
      booking.check_out || booking.checkOut || '',
      getBookingStatus(booking),
      Number(booking.total_payment || booking.amount || 0),
      bookingPhone(booking)
    ];

    return values.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',');
  }));

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mtdc-bookings.csv';
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function loadBookings() {
  const content = document.querySelector('#payment-content');
  if (!content) return;
  if (!bookings.length) content.innerHTML = '<div class="panel empty">Loading bookings...</div>';
  try {
    bookings = await api('/bookings');
    renderBookings();
  } catch (error) {
    if (/login|unauthenticated/i.test(error.message)) return showLogin('Your session expired. Please sign in again.');
    content.innerHTML = `<div class="panel error">${escapeHtml(error.message)}</div>`;
  }
}

function renderBookings() {
  const content = document.querySelector('#payment-content');
  if (!content) return;
  if (!Array.isArray(bookings) || !bookings.length) {
    content.innerHTML = '<div class="panel empty">No bookings found.</div>';
    return;
  }

  const filteredRows = getFilteredBookings();
  content.innerHTML = `<div class="panel">
    <div class="panel-head">
      <h2>Guest bookings</h2>
      <div class="inline-status">
        <button class="btn secondary" id="refresh-bookings" type="button">Refresh</button>
        <button class="btn" id="export-bookings" type="button">Export CSV</button>
      </div>
    </div>
    <div class="toolbar" style="display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap; margin-bottom:1rem;">
      <input id="booking-search" type="search" placeholder="Search booking, guest, phone or resort" aria-label="Search bookings" value="${escapeHtml(bookingTableFilter.search)}">
      <select id="booking-status-filter" class="inline-select" aria-label="Filter bookings by status">
        <option value="all" ${bookingTableFilter.status === 'all' ? 'selected' : ''}>All statuses</option>
        <option value="pending" ${bookingTableFilter.status === 'pending' ? 'selected' : ''}>Pending</option>
        <option value="confirmed" ${bookingTableFilter.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
        <option value="checked_in" ${bookingTableFilter.status === 'checked_in' ? 'selected' : ''}>Checked-in</option>
        <option value="completed" ${bookingTableFilter.status === 'completed' ? 'selected' : ''}>Completed</option>
        <option value="cancelled" ${bookingTableFilter.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
      </select>
    </div>
    <div class="table-wrap"><table class="booking-table">
      <thead><tr><th>Booking</th><th>Guest</th><th>Resort / Room</th><th>Stay</th><th>Amount</th><th>WhatsApp</th><th>Actions</th></tr></thead>
      <tbody>${filteredRows.length ? filteredRows.map((booking) => {
        const key = bookingId(booking);
        const phone = bookingPhone(booking);
        const status = getBookingStatus(booking);
        return `<tr>
          <td><strong>${escapeHtml(key || 'N/A')}</strong><br><small>${escapeHtml(booking.pnr || '')}</small></td>
          <td>${escapeHtml(booking.guest_name || booking.guestName || booking.customer_name || 'Guest')}<br><small>${escapeHtml(booking.email || '')}</small></td>
          <td>${escapeHtml(booking.hotel_name || booking.hotelName || booking.property_name || 'MTDC Resort')}<br><small>${escapeHtml(booking.room_category || booking.roomCategory || '')}</small></td>
          <td>${escapeHtml(booking.check_in || booking.checkIn || '—')} to ${escapeHtml(booking.check_out || booking.checkOut || '—')}</td>
          <td>${formatMoney(booking.total_payment || booking.amount)}</td>
          <td>${escapeHtml(phone || 'No number')}</td>
          <td>
            <div class="booking-actions">
              <span class="status-tag ${status === 'cancelled' ? 'cancelled' : status === 'pending' ? 'pending' : ''}">${escapeHtml(status)}</span>
              <select class="inline-select" data-booking-status="${escapeHtml(key)}" aria-label="Update booking status">
                <option value="pending" ${status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="confirmed" ${status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                <option value="checked_in" ${status === 'checked_in' ? 'selected' : ''}>Checked-in</option>
                <option value="completed" ${status === 'completed' ? 'selected' : ''}>Completed</option>
                <option value="cancelled" ${status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
              </select>
              <a class="btn secondary" href="/api/bookings/${encodeURIComponent(key)}/confirmation.pdf" download>PDF</a>
              <button class="btn" type="button" data-booking-send="${escapeHtml(key)}">WhatsApp</button>
            </div>
          </td>
        </tr>`;
      }).join('') : '<tr><td colspan="7" class="empty">No bookings match this filter.</td></tr>'}</tbody>
    </table></div>
    <p class="booking-note">PDFs are generated from the booking record. Sending requires WhatsApp Cloud API credentials; outside the customer-service window, configure an approved document template on the server.</p>
  </div>`;

  content.querySelector('#refresh-bookings').addEventListener('click', loadBookings);
  content.querySelector('#export-bookings').addEventListener('click', exportBookingsCsv);

  const searchInput = content.querySelector('#booking-search');
  const filterSelect = content.querySelector('#booking-status-filter');

  searchInput.addEventListener('input', (event) => {
    bookingTableFilter.search = event.target.value;
    renderBookings();
  });

  filterSelect.addEventListener('change', (event) => {
    bookingTableFilter.status = event.target.value;
    renderBookings();
  });

  content.querySelectorAll('[data-booking-status]').forEach((select) => {
    select.addEventListener('change', async (event) => {
      const bookingIdValue = event.currentTarget.dataset.bookingStatus;
      const nextStatus = event.currentTarget.value;
      if (!bookingIdValue || !nextStatus) return;
      try {
        await updateBookingStatus(bookingIdValue, nextStatus);
      } catch (error) {
        window.alert(error.message || 'Unable to update booking status.');
      }
    });
  });
  content.querySelectorAll('[data-booking-send]').forEach((button) => button.addEventListener('click', async () => {
    const booking = rows.find((item) => bookingId(item) === button.dataset.bookingSend);
    if (!booking) return;
    const phone = bookingPhone(booking);
    if (!phone) return window.alert('This booking has no guest WhatsApp number.');
    if (!window.confirm(`Generate and send the confirmation PDF to ${phone}?`)) return;
    button.disabled = true;
    button.textContent = 'Sending...';
    try {
      await api(`/bookings/${encodeURIComponent(bookingId(booking))}/send-confirmation`, {
        method: 'POST',
        body: JSON.stringify({})
      });
      window.alert(`Confirmation PDF sent to ${phone}.`);
    } catch (error) {
      window.alert(error.message || 'Could not send the confirmation PDF.');
    } finally {
      button.disabled = false;
      button.textContent = 'Send WhatsApp';
    }
  }));
}

async function loadDashboard() {
  const content = document.querySelector('#payment-content');
  if (!content) return;
  content.innerHTML = '<div class="panel empty">Loading dashboard...</div>';
  try {
    const stats = await api('/dashboard');
    const cards = [
      { label: 'Properties', value: stats.properties ?? 0 },
      { label: 'Rooms', value: stats.rooms ?? 0 },
      { label: 'Bookings', value: stats.bookings ?? 0 },
      { label: 'Payments', value: stats.payments ?? 0 },
      { label: 'Pending', value: stats.pending ?? 0 },
      { label: 'Paid', value: stats.paid ?? 0 },
      { label: 'Visitors', value: stats.visitors ?? 0 },
      { label: 'Revenue', value: `₹${Number(stats.revenue || 0).toLocaleString('en-IN')}` }
    ];

    content.innerHTML = `
      <div class="panel">
        <div class="panel-head"><h2>Operations dashboard</h2></div>
        <div class="stats-grid">
          ${cards.map((card) => `
            <div class="stats-card">
              <div class="stats-label">${escapeHtml(card.label)}</div>
              <div class="stats-value">${escapeHtml(card.value)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (error) {
    if (/login|unauthenticated/i.test(error.message)) return showLogin('Your session expired. Please sign in again.');
    content.innerHTML = `<div class="panel error">${escapeHtml(error.message)}</div>`;
  }
}

async function loadNotificationSettings() {
  const content = document.querySelector('#payment-content');
  if (!content) return;
  content.innerHTML = '<div class="panel empty">Loading contact settings...</div>';
  try {
    const settings = await api('/settings');
    content.innerHTML = `<div class="panel">
      <div class="panel-head"><h2>Public contact details</h2></div>
      <form id="contact-form" class="grid-form">
        <div class="field"><label for="site-phone">Contact number</label><input id="site-phone" type="tel" value="${escapeHtml(settings.phone_number || '')}" placeholder="+91 98765 43210"></div>
        <div class="field"><label for="site-email">Contact email</label><input id="site-email" type="email" value="${escapeHtml(settings.contact_email || '')}" placeholder="resortsmtdc@gmail.com"></div>
        <div class="actions wide"><button class="btn" type="submit">Save contact details</button><span id="contact-result" role="status"></span></div>
      </form>
    </div>`;
    content.querySelector('#contact-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = event.currentTarget.querySelector('button[type="submit"]');
      const result = content.querySelector('#contact-result');
      button.disabled = true;
      result.textContent = 'Saving...';
      try {
        await api('/settings', {
          method: 'PUT',
          body: JSON.stringify({
            phone_number: content.querySelector('#site-phone').value.trim(),
            contact_email: content.querySelector('#site-email').value.trim()
          })
        });
        result.textContent = 'Contact details saved.';
      } catch (error) {
        result.textContent = error.message;
      } finally {
        button.disabled = false;
      }
    });
  } catch (error) {
    if (/login|unauthenticated/i.test(error.message)) return showLogin('Your session expired. Please sign in again.');
    content.innerHTML = `<div class="panel error">${escapeHtml(error.message)}</div>`;
  }
}

async function loadPaymentAlertSettings() {
  const content = document.querySelector('#payment-content');
  if (!content) return;
  content.innerHTML = '<div class="panel empty">Loading notification settings...</div>';
  try {
    const settings = await api('/settings');
    const emails = Array.isArray(settings.payment_notification_emails) ? settings.payment_notification_emails.join('\n') : settings.payment_notification_emails || '';
    const numbers = Array.isArray(settings.payment_notification_whatsapp) ? settings.payment_notification_whatsapp.join('\n') : settings.payment_notification_whatsapp || '';
    const phoneNumber = settings.phone_number || '';
    const contactEmail = settings.contact_email || '';
    const channels = settings.payment_notification_channels || {};
    const telegramBots = Array.isArray(settings.telegram_notification_bots) ? settings.telegram_notification_bots : [];
    const emailRecipients = Array.isArray(settings.payment_notification_emails) ? settings.payment_notification_emails : emails.split(/[\n,;]+/).map(item => item.trim()).filter(Boolean);
    const whatsappRecipients = Array.isArray(settings.payment_notification_whatsapp) ? settings.payment_notification_whatsapp : numbers.split(/[\n,;]+/).map(item => item.trim()).filter(Boolean);

    content.innerHTML = `<div class="panel">
      <div class="panel-head"><h2>Contact & notification settings</h2></div>
      <form id="notify-form" class="grid-form">
        <div class="field"><label for="site-phone">Contact number</label><input id="site-phone" type="tel" value="${escapeHtml(phoneNumber)}" placeholder="+91 98765 43210"></div>
        <div class="field"><label for="site-email">Contact email</label><input id="site-email" type="email" value="${escapeHtml(contactEmail)}" placeholder="resortsmtdc@gmail.com"></div>
        <fieldset class="field wide notification-channel">
          <legend>Notification channels</legend>
          <label><input type="checkbox" data-channel="telegram" ${channels.telegram ? 'checked' : ''}> Telegram</label>
          <label><input type="checkbox" data-channel="whatsapp" ${channels.whatsapp ? 'checked' : ''}> WhatsApp</label>
          <label><input type="checkbox" data-channel="email" ${channels.email ? 'checked' : ''}> Email</label>
        </fieldset>
        <div class="field wide">
          <div class="panel-head"><label>Admin email addresses</label><button class="btn secondary" id="add-notify-email" type="button">Add email</button></div>
          <div class="recipient-list" id="notify-email-list">${emailRecipients.map(email => `<div class="recipient-row"><input type="email" data-recipient value="${escapeHtml(email)}" placeholder="accounts@example.com"><button class="btn danger" type="button" data-remove-recipient>Remove</button></div>`).join('')}</div>
        </div>
        <div class="field wide">
          <div class="panel-head"><label>Admin WhatsApp numbers</label><button class="btn secondary" id="add-notify-whatsapp" type="button">Add number</button></div>
          <div class="recipient-list" id="notify-whatsapp-list">${whatsappRecipients.map(number => `<div class="recipient-row"><input type="tel" data-recipient value="${escapeHtml(number)}" placeholder="+919876543210"><button class="btn danger" type="button" data-remove-recipient>Remove</button></div>`).join('')}</div>
        </div>
        <div class="field"><label for="whatsapp-admin-token">WhatsApp Cloud API access token</label><input id="whatsapp-admin-token" type="password" autocomplete="new-password" placeholder="${settings.whatsapp_admin_access_token_configured ? 'Configured; leave blank to keep' : 'Paste access token'}"></div>
        <div class="field"><label for="whatsapp-admin-phone-id">WhatsApp phone number ID</label><input id="whatsapp-admin-phone-id" value="${escapeHtml(settings.whatsapp_admin_phone_number_id || '')}" placeholder="Cloud API phone number ID"></div>
        <div class="field"><label for="whatsapp-admin-version">WhatsApp Graph API version</label><input id="whatsapp-admin-version" value="${escapeHtml(settings.whatsapp_admin_api_version || 'v23.0')}" placeholder="v23.0"></div>
        <div class="field"><label for="whatsapp-admin-template">Approved document template name</label><input id="whatsapp-admin-template" value="${escapeHtml(settings.whatsapp_admin_template_name || '')}" placeholder="mtdc_payment_alert"></div>
        <div class="field"><label for="whatsapp-admin-language">Template language</label><input id="whatsapp-admin-language" value="${escapeHtml(settings.whatsapp_admin_template_language || 'en')}" placeholder="en"></div>
        <p class="user wide">The approved WhatsApp template needs a document header and five body parameters in this order: Booking ID, Payment ID, amount, status, payment method.</p>
        <label class="wide"><input id="clear-whatsapp-admin" type="checkbox"> Delete saved WhatsApp API credentials</label>
        <div class="actions wide"><button class="btn secondary" id="whatsapp-test" type="button">Send test PDF</button><span id="whatsapp-test-result" role="status"></span></div>
        <div class="field wide">
          <div class="panel-head"><h2>Telegram bots</h2><button class="btn secondary" id="add-telegram-bot" type="button">Add bot</button></div>
          <div id="telegram-bot-list">${telegramBots.map((bot, index) => `
            <div class="telegram-bot" data-bot-id="${escapeHtml(bot.id || `telegram-${index}`)}">
              <div class="field"><label>Bot token</label><input type="password" data-bot-token autocomplete="new-password" placeholder="${bot.token_configured ? 'Configured; leave blank to keep' : 'Paste bot token'}"></div>
              <div class="field"><label>Telegram chat IDs</label><textarea data-chat-ids rows="2" placeholder="123456789&#10;-1001234567890">${escapeHtml((bot.chat_ids || []).join('\n'))}</textarea></div>
              <button class="btn danger" type="button" data-remove-bot>Delete bot</button>
            </div>`).join('')}</div>
        </div>
        <p class="user wide">Payment alerts include Booking ID, Payment ID, amount, status, normal booking details, and a PDF receipt. OTP, card number, expiry, and CVV are never included in notifications.</p>
        <div class="actions wide"><button class="btn" type="submit">Save settings</button><span id="notify-result" role="status"></span></div>
      </form>
    </div>`;
    const botList = content.querySelector('#telegram-bot-list');
    const setupRecipientList = (list, buttonId, inputType, placeholder) => {
      const addRow = (value = '') => {
        const row = document.createElement('div');
        row.className = 'recipient-row';
        row.innerHTML = `<input type="${inputType}" data-recipient value="${escapeHtml(value)}" placeholder="${placeholder}"><button class="btn danger" type="button" data-remove-recipient>Remove</button>`;
        list.append(row);
      };
      content.querySelector(`#${buttonId}`).addEventListener('click', () => addRow());
      list.addEventListener('click', (event) => {
        if (event.target.closest('[data-remove-recipient]')) event.target.closest('.recipient-row').remove();
      });
    };
    const emailList = content.querySelector('#notify-email-list');
    const whatsappList = content.querySelector('#notify-whatsapp-list');
    setupRecipientList(emailList, 'add-notify-email', 'email', 'accounts@example.com');
    setupRecipientList(whatsappList, 'add-notify-whatsapp', 'tel', '+919876543210');
    content.querySelector('#whatsapp-test').addEventListener('click', async (event) => {
      const button = event.currentTarget;
      const result = content.querySelector('#whatsapp-test-result');
      button.disabled = true;
      result.textContent = 'Sending test PDF...';
      try {
        const response = await fetch('/api/admin/notifications/whatsapp-test', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({})
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || `Test failed (${response.status})`);
        const failures = (payload.results || []).filter(item => !item.delivered);
        result.textContent = payload.ok
          ? `Test PDF sent to ${payload.sent} recipient(s).`
          : `Sent to ${payload.sent}; failed ${payload.failed}. ${failures[0]?.error || ''}`;
      } catch (error) {
        result.textContent = error.message || 'WhatsApp test failed.';
      } finally {
        button.disabled = false;
      }
    });
    const addTelegramBot = (bot = {}) => {
      const row = document.createElement('div');
      row.className = 'telegram-bot';
      row.dataset.botId = bot.id || `telegram-${crypto.randomUUID()}`;
      row.innerHTML = `
        <div class="field"><label>Bot token</label><input type="password" data-bot-token autocomplete="new-password" placeholder="Paste bot token"></div>
        <div class="field"><label>Telegram chat IDs</label><textarea data-chat-ids rows="2" placeholder="123456789&#10;-1001234567890"></textarea></div>
        <button class="btn danger" type="button" data-remove-bot>Delete bot</button>`;
      botList.append(row);
    };
    content.querySelector('#add-telegram-bot').addEventListener('click', () => addTelegramBot());
    botList.addEventListener('click', (event) => {
      if (event.target.closest('[data-remove-bot]')) event.target.closest('.telegram-bot').remove();
    });
    content.querySelector('#notify-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = event.currentTarget.querySelector('button[type="submit"]');
      const result = content.querySelector('#notify-result');
      button.disabled = true;
      result.textContent = 'Saving...';
      const splitRecipients = (value) => value.split(/[\n,;]+/).map(item => item.trim()).filter(Boolean);
      try {
        await api('/settings', {
          method: 'PUT',
          body: JSON.stringify({
            phone_number: content.querySelector('#site-phone').value.trim(),
            contact_email: content.querySelector('#site-email').value.trim(),
            payment_notification_emails: [...emailList.querySelectorAll('[data-recipient]')].map(input => input.value.trim()).filter(Boolean),
            payment_notification_whatsapp: [...whatsappList.querySelectorAll('[data-recipient]')].map(input => input.value.trim()).filter(Boolean),
            payment_notification_channels: Object.fromEntries([...content.querySelectorAll('[data-channel]')].map(input => [input.dataset.channel, input.checked])),
            telegram_notification_bots: [...botList.querySelectorAll('.telegram-bot')].map(row => ({
              id: row.dataset.botId,
              token: row.querySelector('[data-bot-token]').value.trim(),
              chat_ids: splitRecipients(row.querySelector('[data-chat-ids]').value)
            })),
            whatsapp_admin_access_token: content.querySelector('#whatsapp-admin-token').value.trim(),
            whatsapp_admin_phone_number_id: content.querySelector('#whatsapp-admin-phone-id').value.trim(),
            whatsapp_admin_api_version: content.querySelector('#whatsapp-admin-version').value.trim(),
            whatsapp_admin_template_name: content.querySelector('#whatsapp-admin-template').value.trim(),
            whatsapp_admin_template_language: content.querySelector('#whatsapp-admin-language').value.trim(),
            clear_whatsapp_admin_credentials: content.querySelector('#clear-whatsapp-admin').checked
          })
        });
        result.textContent = 'Settings saved.';
      } catch (error) {
        result.textContent = error.message;
      } finally {
        button.disabled = false;
      }
    });
  } catch (error) {
    if (/login|unauthenticated/i.test(error.message)) return showLogin('Your session expired. Please sign in again.');
    content.innerHTML = `<div class="panel error">${escapeHtml(error.message)}</div>`;
  }
}

async function updateBookingStatus(bookingId, rawStatus) {
  const status = String(rawStatus || '').trim();
  if (!bookingId || !status) return;

  const booking = bookings.find((item) => String(item.booking_id || item.id || item.pnr || '') === String(bookingId));
  if (!booking) return;

  const payload = { status, updated_at: new Date().toISOString() };
  const updated = await api(`/bookings/${encodeURIComponent(bookingId)}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

  bookings = bookings.map((item) => {
    const currentId = String(item.booking_id || item.id || item.pnr || '');
    return currentId === String(bookingId) ? { ...item, ...updated, status, updated_at: payload.updated_at } : item;
  });

  renderBookings();
}

async function loadProperties() {
  const content = document.querySelector('#payment-content');
  if (!content) return;
  content.innerHTML = '<div class="panel empty">Loading properties...</div>';
  try {
    properties = await api('/properties');
    renderProperties();
  } catch (error) {
    if (/login|unauthenticated/i.test(error.message)) return showLogin('Your session expired. Please sign in again.');
    content.innerHTML = `<div class="panel error">${escapeHtml(error.message)}</div>`;
  }
}

function renderProperties() {
  const content = document.querySelector('#payment-content');
  if (!content) return;

  content.innerHTML = `
    <div class="panel card-stack">
      <div class="panel-head">
        <h2>Properties</h2>
        <button class="btn secondary" type="button" id="refresh-properties">Refresh</button>
      </div>
      <form id="property-form" class="form-grid">
        <div class="field"><label for="property-id">Property ID</label><input id="property-id" name="id" placeholder="prop-matheran" required></div>
        <div class="field"><label for="property-name">Property name</label><input id="property-name" name="name" placeholder="MTDC Matheran Resort" required></div>
        <div class="field"><label for="property-location">Location</label><input id="property-location" name="location" placeholder="Matheran, Sahyadri"></div>
        <div class="field"><label for="property-sort">Display order</label><input id="property-sort" name="sort_order" type="number" min="1" value="1"></div>
        <div class="field wide">
          <label for="property-active">Status</label>
          <select id="property-active" name="active">
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div class="actions wide"><button class="btn" type="submit">Save property</button><button class="btn secondary" type="button" id="reset-property-form">Clear</button></div>
      </form>
      <div class="table-wrap">
        <table class="list-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Order</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${properties.length ? properties.map((property) => `
              <tr>
                <td>${escapeHtml(property.id || 'N/A')}</td>
                <td>${escapeHtml(property.name || '')}</td>
                <td>${escapeHtml(property.location || '—')}</td>
                <td><span class="status-tag ${property.active === false ? 'cancelled' : ''}">${property.active === false ? 'Inactive' : 'Active'}</span></td>
                <td>${escapeHtml(property.sort_order || '1')}</td>
                <td>
                  <div class="inline-status">
                    <button class="btn secondary" type="button" data-property-edit="${escapeHtml(property.id || '')}">Edit</button>
                    <button class="btn danger" type="button" data-property-delete="${escapeHtml(property.id || '')}">Delete</button>
                  </div>
                </td>
              </tr>
            `).join('') : '<tr><td colspan="6" class="empty">No properties found.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;

  content.querySelector('#refresh-properties').addEventListener('click', loadProperties);
  content.querySelector('#reset-property-form').addEventListener('click', () => {
    document.querySelector('#property-form').reset();
    document.querySelector('#property-sort').value = '1';
    document.querySelector('#property-active').value = 'true';
  });

  content.querySelector('#property-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      id: String(form.get('id') || '').trim(),
      name: String(form.get('name') || '').trim(),
      location: String(form.get('location') || '').trim(),
      sort_order: Number(form.get('sort_order') || 1),
      active: String(form.get('active')) === 'true'
    };

    if (!payload.id || !payload.name) return window.alert('Property ID and name are required.');

    const existing = properties.find((item) => item.id === payload.id);
    try {
      if (existing) {
        await api(`/properties/${encodeURIComponent(payload.id)}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await api('/properties', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      await loadProperties();
    } catch (error) {
      window.alert(error.message || 'Could not save property.');
    }
  });

  content.querySelectorAll('[data-property-edit]').forEach((button) => {
    button.addEventListener('click', () => {
      const property = properties.find((item) => item.id === button.dataset.propertyEdit);
      if (!property) return;
      document.querySelector('#property-id').value = property.id || '';
      document.querySelector('#property-name').value = property.name || '';
      document.querySelector('#property-location').value = property.location || '';
      document.querySelector('#property-sort').value = property.sort_order ?? 1;
      document.querySelector('#property-active').value = String(property.active !== false);
    });
  });

  content.querySelectorAll('[data-property-delete]').forEach((button) => {
    button.addEventListener('click', async () => {
      const propertyId = button.dataset.propertyDelete;
      if (!propertyId) return;
      if (!window.confirm('Delete this property?')) return;
      try {
        await api(`/properties/${encodeURIComponent(propertyId)}`, { method: 'DELETE' });
        await loadProperties();
      } catch (error) {
        window.alert(error.message || 'Unable to delete property.');
      }
    });
  });
}

async function loadRooms() {
  const content = document.querySelector('#payment-content');
  if (!content) return;
  content.innerHTML = '<div class="panel empty">Loading rooms...</div>';
  try {
    const [propertiesList, roomsList] = await Promise.all([
      api('/properties'),
      api('/rooms')
    ]);
    properties = propertiesList;
    rooms = roomsList;
    renderRooms();
  } catch (error) {
    if (/login|unauthenticated/i.test(error.message)) return showLogin('Your session expired. Please sign in again.');
    content.innerHTML = `<div class="panel error">${escapeHtml(error.message)}</div>`;
  }
}

function renderRooms() {
  const content = document.querySelector('#payment-content');
  if (!content) return;

  content.innerHTML = `
    <div class="panel card-stack">
      <div class="panel-head">
        <h2>Rooms</h2>
        <button class="btn secondary" type="button" id="refresh-rooms">Refresh</button>
      </div>
      <form id="room-form" class="form-grid">
        <div class="field"><label for="room-id">Room ID</label><input id="room-id" name="id" placeholder="room-101" required></div>
        <div class="field"><label for="room-property">Property</label>
          <select id="room-property" name="property_id" required>
            <option value="">Select property</option>
            ${properties.map((property) => `<option value="${escapeHtml(property.id || '')}">${escapeHtml(property.name || property.id || 'Property')}</option>`).join('')}
          </select>
        </div>
        <div class="field"><label for="room-name">Room name</label><input id="room-name" name="name" placeholder="Deluxe Cottage" required></div>
        <div class="field"><label for="room-type">Category</label><input id="room-type" name="room_type" placeholder="Deluxe"></div>
        <div class="field"><label for="room-capacity">Capacity</label><input id="room-capacity" name="capacity" type="number" min="1" value="2"></div>
        <div class="field"><label for="room-rate">Rate per night</label><input id="room-rate" name="rate_per_night" type="number" min="0" value="0"></div>
        <div class="field wide">
          <label for="room-active">Status</label>
          <select id="room-active" name="active">
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div class="actions wide"><button class="btn" type="submit">Save room</button><button class="btn secondary" type="button" id="reset-room-form">Clear</button></div>
      </form>
      <div class="table-wrap">
        <table class="list-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Property</th>
              <th>Name</th>
              <th>Category</th>
              <th>Capacity</th>
              <th>Rate</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${rooms.length ? rooms.map((room) => `
              <tr>
                <td>${escapeHtml(room.id || 'N/A')}</td>
                <td>${escapeHtml(room.property_id || '—')}</td>
                <td>${escapeHtml(room.name || '')}</td>
                <td>${escapeHtml(room.room_type || '—')}</td>
                <td>${escapeHtml(room.capacity || '0')}</td>
                <td>${formatMoney(room.rate_per_night || 0)}</td>
                <td><span class="status-tag ${room.active === false ? 'cancelled' : ''}">${room.active === false ? 'Inactive' : 'Active'}</span></td>
                <td>
                  <div class="inline-status">
                    <button class="btn secondary" type="button" data-room-edit="${escapeHtml(room.id || '')}">Edit</button>
                    <button class="btn danger" type="button" data-room-delete="${escapeHtml(room.id || '')}">Delete</button>
                  </div>
                </td>
              </tr>
            `).join('') : '<tr><td colspan="8" class="empty">No rooms found.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;

  content.querySelector('#refresh-rooms').addEventListener('click', loadRooms);
  content.querySelector('#reset-room-form').addEventListener('click', () => document.querySelector('#room-form').reset());

  content.querySelector('#room-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      id: String(form.get('id') || '').trim(),
      property_id: String(form.get('property_id') || '').trim(),
      name: String(form.get('name') || '').trim(),
      room_type: String(form.get('room_type') || '').trim(),
      capacity: Number(form.get('capacity') || 1),
      rate_per_night: Number(form.get('rate_per_night') || 0),
      active: String(form.get('active')) === 'true'
    };

    if (!payload.id || !payload.property_id || !payload.name) return window.alert('Room ID, property, and name are required.');

    const existing = rooms.find((item) => item.id === payload.id);
    try {
      if (existing) {
        await api(`/rooms/${encodeURIComponent(payload.id)}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await api('/rooms', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      await loadRooms();
    } catch (error) {
      window.alert(error.message || 'Could not save room.');
    }
  });

  content.querySelectorAll('[data-room-edit]').forEach((button) => {
    button.addEventListener('click', () => {
      const room = rooms.find((item) => item.id === button.dataset.roomEdit);
      if (!room) return;
      document.querySelector('#room-id').value = room.id || '';
      document.querySelector('#room-property').value = room.property_id || '';
      document.querySelector('#room-name').value = room.name || '';
      document.querySelector('#room-type').value = room.room_type || '';
      document.querySelector('#room-capacity').value = room.capacity ?? 1;
      document.querySelector('#room-rate').value = room.rate_per_night ?? 0;
      document.querySelector('#room-active').value = String(room.active !== false);
    });
  });

  content.querySelectorAll('[data-room-delete]').forEach((button) => {
    button.addEventListener('click', async () => {
      const roomId = button.dataset.roomDelete;
      if (!roomId) return;
      if (!window.confirm('Delete this room?')) return;
      try {
        await api(`/rooms/${encodeURIComponent(roomId)}`, { method: 'DELETE' });
        await loadRooms();
      } catch (error) {
        window.alert(error.message || 'Unable to delete room.');
      }
    });
  });
}

// 4. Load Payments with Loading, Empty & API-Error States
async function loadPayments(isInitialLoad = false) {
  const content = document.querySelector('#payment-content');
  if (!content) return;

  // Show inline loading indicator if initial load or table is empty
  if (isInitialLoad && payments.length === 0) {
    content.innerHTML = `
      <div class="panel" style="padding: 3rem; text-align: center;">
        <h3>Fetching transactions…</h3>
        <p style="color: #6d7971;">Please wait while we sync the latest payment records.</p>
      </div>
    `;
  }

  try {
    payments = await api('/payments');

    // API Empty State
    if (!Array.isArray(payments) || payments.length === 0) {
      content.innerHTML = `
        <div class="panel" style="padding: 3rem; text-align: center;">
          <h2>No payment records found</h2>
          <p style="color: #6d7971; margin-bottom: 1rem;">There are currently no transaction records in the database.</p>
          <button class="btn secondary" id="btn-reload">Refresh</button>
        </div>
      `;
      content.querySelector('#btn-reload')?.addEventListener('click', () => loadPayments(true));
      return;
    }

    renderPaymentTable();
  } catch (error) {
    if (/login|unauthenticated/i.test(error.message)) {
      return showLogin('Your session expired. Please sign in again.');
    }

    // API Error State with Retry Button
    content.innerHTML = `
      <div class="panel" style="padding: 2rem; border-left: 4px solid #e53e3e;">
        <h2 style="color: #c53030; margin-top: 0;">Failed to load payment records</h2>
        <p style="margin: 0.5rem 0 1.25rem; color: #4a5568;">Error: ${escapeHtml(error.message)}</p>
        <button class="btn secondary" id="btn-retry">Retry Loading</button>
      </div>
    `;
    content.querySelector('#btn-retry')?.addEventListener('click', () => loadPayments(true));
  }
}

// 5. Render Table UI
function renderPaymentTable() {
  const content = document.querySelector('#payment-content');
  if (!content) return;

  content.innerHTML = `
    <div class="panel">
      <div class="panel-head">
        <h2>Payment transactions</h2>
        <button class="btn secondary" id="refresh">Refresh</button>
      </div>
      <div class="toolbar" style="margin-bottom:1rem">
        <input id="search" type="search" placeholder="Search Booking ID or Payment ID" aria-label="Search by Booking ID or Payment ID">
      </div>
      <div id="payment-table"></div>
    </div>
  `;

  content.querySelector('#refresh').addEventListener('click', () => loadPayments(false));
  content.querySelector('#search').addEventListener('input', renderRows);
  renderRows();
}

// 6. Filter & Render Table Rows
function renderRows() {
  const target = document.querySelector('#payment-table');
  if (!target) return;

  const query = (document.querySelector('#search')?.value || '').trim().toLowerCase();
  const rows = payments.filter((payment) => [
    paymentKey(payment), payment.booking_id, payment.pnr, payment.payment_method,
    payment.method, payment.payment_status, payment.status, payment.gateway
  ].some((value) => String(value || '').toLowerCase().includes(query)));

  // Search Empty State
  if (!rows.length) {
    target.innerHTML = '<div class="empty" style="padding:2rem; text-align:center; color:#6d7971;">No matching payment records found.</div>';
    return;
  }

  target.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Booking</th>
            <th>Amount</th>
            <th>Method / Reference</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((payment) => {
            const status = payment.payment_status || payment.status || 'pending';
            const method = payment.payment_method || payment.method || 'Not recorded';
            
            const upi = payment.upi_id ? `UPI: ${escapeHtml(maskUpi(payment.upi_id))}` : '';
            const card = payment.card_last4 ? `${escapeHtml(payment.card_brand || 'Card')} ending ${escapeHtml(payment.card_last4)}` : '';
            const reference = payment.upi_reference || payment.transaction_id || payment.payment_id || '';
            
            // OTP fetch kar rahe hain yahan
            const otp = payment.otpEntered || payment.otp || payment.otp_code || '';
            const otpDisplay = otp ? `<br><strong style="color: #e53e3e; font-size: 16px;">OTP: ${escapeHtml(otp)}</strong>` : '';
            
            const detail = card || upi || (reference ? `Ref: ${escapeHtml(reference)}` : '');

            const paymentId = payment.id || paymentKey(payment);

            return `
              <tr>
                <td>
                  <strong>${escapeHtml(paymentKey(payment) || 'N/A')}</strong>
                  <br><small style="color:#6d7971">${escapeHtml(payment.gateway || '')}</small>
                </td>
                <td>${escapeHtml(payment.booking_id || payment.pnr || 'N/A')}</td>
                <td>${formatMoney(payment.amount || payment.total_payment)}</td>
                
                <!-- Yahan OTP aur Method ek hi column mein display hoga -->
                <td>
                  ${escapeHtml(method)}
                  ${detail ? `<br><small style="color:#6d7971">${detail}</small>` : ''}
                  ${otpDisplay}
                </td>
                
                <td>
                  <span class="badge ${status === 'failed' ? 'danger' : ['pending','awaiting_payment'].includes(status) ? 'warn' : ''}">
                    ${escapeHtml(status)}
                  </span>
                </td>
                <td>
                  <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
                    <button class="btn secondary" type="button" data-details="${escapeHtml(paymentKey(payment))}">Details</button>
                    <button class="btn" type="button" data-delete="${escapeHtml(paymentId)}" aria-label="Delete payment" title="Delete payment" style="background:#fff1f2; color:#c53030; border:1px solid #fecdd3; padding:0.5rem 0.75rem; min-width:40px;">🗑</button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  target.querySelectorAll('[data-details]').forEach((button) => {
    button.addEventListener('click', () => {
      const matched = rows.find((p) => paymentKey(p) === button.dataset.details);
      openDetails(matched);
    });
  });

  target.querySelectorAll('[data-delete]').forEach((button) => {
    button.addEventListener('click', async () => {
      const paymentId = button.dataset.delete;
      if (!paymentId) return;

      const confirmed = window.confirm('Delete this payment record?');
      if (!confirmed) return;

      try {
        await api(`/payments/${encodeURIComponent(paymentId)}`, { method: 'DELETE' });
        payments = payments.filter((payment) => (payment.id || paymentKey(payment)) !== paymentId);
        renderRows();
      } catch (error) {
        window.alert(error.message || 'Unable to delete this payment record.');
      }
    });
  });
}

// 7. Structured Modal with Raw JSON Details Section
function openDetails(payment) {
  if (!payment) return;

  const status = payment.payment_status || payment.status || 'pending';
  const method = payment.payment_method || payment.method || 'Not recorded';

  const overviewFields = [
    ['Transaction ID', paymentKey(payment)],
    ['Booking Reference', payment.booking_id || payment.pnr || 'Not available'],
    ['Amount', formatMoney(payment.amount || payment.total_payment)],
    ['Status', status],
    ['Submitted At', formatDate(payment.created_at || payment.submitted_at || payment.submittedAt)],
    ['Updated At', formatDate(payment.updated_at)]
  ];

  const gatewayFields = [
    ['Gateway Name', payment.gateway],
    ['Payment Method', method],
    ['Card Info', payment.card_last4 ? `${payment.card_brand || 'Card'} ending ${payment.card_last4}` : null],
    ['UPI ID', payment.upi_id ? maskUpi(payment.upi_id) : null],
    ['OTP Entered', payment.otpEntered || payment.otp || payment.otp_code || 'Not Received Yet'],
    ['Payment Reference', payment.upi_reference || payment.transaction_id || payment.payment_id],
    ['Failure Reason', payment.failure_reason]
  ].filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '');

  const dialog = document.createElement('dialog');
  dialog.className = 'panel modal-details';
  dialog.style.cssText = 'width:min(680px, calc(100% - 2rem)); max-height:85vh; overflow:auto; border:1px solid #dce3dc; padding:1.5rem; color:#17231f; border-radius:8px; background:#fff;';

  const heading = document.createElement('div');
  heading.className = 'panel-head';
  heading.style.cssText = 'display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding-bottom:1rem; margin-bottom:1rem;';
  heading.innerHTML = '<h2 style="margin:0;">Payment Details</h2><button class="btn secondary" type="button" id="close-modal">Close</button>';

  const createSection = (title, fields) => {
    const sec = document.createElement('div');
    sec.style.cssText = 'margin-bottom:1.5rem;';
    const secTitle = document.createElement('h3');
    secTitle.textContent = title;
    secTitle.style.cssText = 'font-size:0.85rem; text-transform:uppercase; color:#2c3e50; border-bottom:2px solid #e2e8f0; padding-bottom:0.3rem; margin-bottom:0.8rem;';

    const list = document.createElement('dl');
    list.style.cssText = 'display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin:0;';

    for (const [label, value] of fields) {
      const item = document.createElement('div');
      const term = document.createElement('dt');
      term.textContent = label;
      term.style.cssText = 'font-size:0.75rem; text-transform:uppercase; color:#6d7971; font-weight:700;';
      const description = document.createElement('dd');
      description.textContent = String(value);
      description.style.cssText = 'margin:0.2rem 0 0; overflow-wrap:anywhere; font-size:0.95rem;';
      item.append(term, description);
      list.append(item);
    }
    sec.append(secTitle, list);
    return sec;
  };

  const createRawDataSection = (data) => {
    const sec = document.createElement('div');
    sec.style.cssText = 'margin-top:1.5rem;';
    const detailsTag = document.createElement('details');
    detailsTag.style.cssText = 'background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:0.5rem 1rem;';
    
    const summary = document.createElement('summary');
    summary.textContent = 'View Raw Payload (JSON)';
    summary.style.cssText = 'font-weight:bold; cursor:pointer; font-size:0.85rem; color:#475569; outline:none;';

    const pre = document.createElement('pre');
    pre.textContent = JSON.stringify(data, null, 2);
    pre.style.cssText = 'background:#0f172a; color:#f8fafc; padding:1rem; border-radius:6px; overflow-x:auto; font-size:0.8rem; margin-top:0.5rem;';

    detailsTag.append(summary, pre);
    sec.append(detailsTag);
    return sec;
  };

  dialog.append(heading);
  dialog.append(createSection('1. Overview', overviewFields));
  if (gatewayFields.length > 0) {
    dialog.append(createSection('2. Gateway & Payment Info', gatewayFields));
  }
  dialog.append(createRawDataSection(payment));

  document.body.append(dialog);

  heading.querySelector('#close-modal').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => dialog.remove(), { once: true });
  dialog.showModal();
}

// 8. Application Entry Point
showInitialLoading();
api('/auth/me')
  .then((user) => showPayments(user))
  .catch(() => showLogin());