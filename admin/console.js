const app = document.querySelector('#app');
let refreshTimer = null;
let payments = [];
let bookings = [];
let activeView = 'payments';

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
          <button class="active" type="button" data-view="payments">Payments</button>
          <button type="button" data-view="bookings">Bookings</button>
          <button type="button" data-view="notify">Notify</button>
        </nav>
        <button class="logout" id="logout">Sign out</button>
      </aside>
      <main class="main">
        <header class="topbar">
          <div>
            <div class="eyebrow">Maharashtra Unlimited</div>
            <h1 id="view-title">Payments</h1>
          </div>
          <div class="user">${escapeHtml(user?.email || 'Admin')}</div>
        </header>
        <section id="payment-content"></section>
      </main>
    </div>
  `;

  app.querySelector('#logout').addEventListener('click', async () => {
    try { await api('/auth/logout', { method: 'POST' }); } finally { showLogin(); }
  });

  app.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));
  await setView('payments');
}

async function setView(view) {
  activeView = view;
  if (refreshTimer) clearInterval(refreshTimer);
  app.querySelectorAll('[data-view]').forEach((button) => button.classList.toggle('active', button.dataset.view === view));
  document.querySelector('#view-title').textContent = view === 'notify' ? 'Notify' : view === 'bookings' ? 'Bookings' : 'Payments';
  if (view === 'notify') {
    await loadNotificationSettings();
    return;
  }
  if (view === 'bookings') {
    await loadBookings();
    refreshTimer = setInterval(() => loadBookings(), 30000);
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

  const rows = [...bookings].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  content.innerHTML = `<div class="panel">
    <div class="panel-head"><h2>Guest bookings</h2><button class="btn secondary" id="refresh-bookings" type="button">Refresh</button></div>
    <div class="table-wrap"><table class="booking-table">
      <thead><tr><th>Booking</th><th>Guest</th><th>Resort / Room</th><th>Stay</th><th>Amount</th><th>WhatsApp</th><th>Actions</th></tr></thead>
      <tbody>${rows.map((booking) => {
        const key = bookingId(booking);
        const phone = bookingPhone(booking);
        return `<tr>
          <td><strong>${escapeHtml(key || 'N/A')}</strong><br><small>${escapeHtml(booking.pnr || '')}</small></td>
          <td>${escapeHtml(booking.guest_name || booking.guestName || booking.customer_name || 'Guest')}<br><small>${escapeHtml(booking.email || '')}</small></td>
          <td>${escapeHtml(booking.hotel_name || booking.hotelName || booking.property_name || 'MTDC Resort')}<br><small>${escapeHtml(booking.room_category || booking.roomCategory || '')}</small></td>
          <td>${escapeHtml(booking.check_in || booking.checkIn || '—')} to ${escapeHtml(booking.check_out || booking.checkOut || '—')}</td>
          <td>${formatMoney(booking.total_payment || booking.amount)}</td>
          <td>${escapeHtml(phone || 'No number')}</td>
          <td><div class="booking-actions"><a class="btn secondary" href="/api/bookings/${encodeURIComponent(key)}/confirmation.pdf" download>Download PDF</a><button class="btn" type="button" data-booking-send="${escapeHtml(key)}">Send WhatsApp</button></div></td>
        </tr>`;
      }).join('')}</tbody>
    </table></div>
    <p class="booking-note">PDFs are generated from the booking record. Sending requires WhatsApp Cloud API credentials; outside the customer-service window, configure an approved document template on the server.</p>
  </div>`;

  content.querySelector('#refresh-bookings').addEventListener('click', loadBookings);
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

async function loadNotificationSettings() {
  const content = document.querySelector('#payment-content');
  if (!content) return;
  content.innerHTML = '<div class="panel empty">Loading notification settings...</div>';
  try {
    const settings = await api('/settings');
    const emails = Array.isArray(settings.payment_notification_emails) ? settings.payment_notification_emails.join('\n') : settings.payment_notification_emails || '';
    const numbers = Array.isArray(settings.payment_notification_whatsapp) ? settings.payment_notification_whatsapp.join('\n') : settings.payment_notification_whatsapp || '';
    const phoneNumber = settings.phone_number || '';
    const contactEmail = settings.contact_email || '';

    content.innerHTML = `<div class="panel">
      <div class="panel-head"><h2>Contact & notification settings</h2></div>
      <form id="notify-form" class="grid-form">
        <div class="field"><label for="site-phone">Contact number</label><input id="site-phone" type="tel" value="${escapeHtml(phoneNumber)}" placeholder="+91 98765 43210"></div>
        <div class="field"><label for="site-email">Contact email</label><input id="site-email" type="email" value="${escapeHtml(contactEmail)}" placeholder="reservations@mtdcresorts.com"></div>
        <div class="field wide"><label for="notify-emails">Email recipients</label><textarea id="notify-emails" rows="4" placeholder="accounts@example.com&#10;manager@example.com">${escapeHtml(emails)}</textarea></div>
        <div class="field wide"><label for="notify-whatsapp">WhatsApp recipients</label><textarea id="notify-whatsapp" rows="4" placeholder="+919876543210&#10;+14155550123">${escapeHtml(numbers)}</textarea></div>
        <p class="user wide">Update the public contact details and payment alert recipients. Add one recipient per line. WhatsApp numbers must include the country code.</p>
        <div class="actions wide"><button class="btn" type="submit">Save settings</button><span id="notify-result" role="status"></span></div>
      </form>
    </div>`;
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
            payment_notification_emails: splitRecipients(content.querySelector('#notify-emails').value),
            payment_notification_whatsapp: splitRecipients(content.querySelector('#notify-whatsapp').value)
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
        <input id="search" type="search" placeholder="Search transaction or booking" aria-label="Search payments">
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