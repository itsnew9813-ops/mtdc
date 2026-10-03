# MTDC backend

Run from the website directory:

```powershell
node backend/server.js
```

The public site remains at `/`; the admin console is at `/admin`. Default local credentials are `admin@mtdcresorts.com` and `MTDC-Admin-2026!`.

Set `MTDC_ADMIN_EMAIL`, `MTDC_ADMIN_PASSWORD`, `PORT`, `MTDC_DATA_FILE`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` in the environment before deployment. When the service key is present, the admin console reads and updates `bookings`, `payments`, `properties`, and `rooms` through Supabase; otherwise it uses the local JSON repository.

The payment metadata intake endpoint is `POST /api/payment-events`. Protect it with `MTDC_PAYMENT_EVENTS_SECRET` and send the `x-mtdc-payment-secret` header. Accepted safe fields include `booking_id`, `pnr`, `amount`, `payment_method`, `payment_status`, `upi_reference`, `transaction_id`, `gateway`, and `failure_reason`. Never send card number, expiry, CVV, or OTP to this endpoint.

Payment alerts are configured in **Admin > Payment Alerts**. Add admin email addresses and WhatsApp numbers with the add/remove controls. Email delivery uses Resend and requires `RESEND_API_KEY` plus a verified `MTDC_NOTIFY_FROM_EMAIL`. WhatsApp admin alerts require a WhatsApp Cloud API access token, Phone Number ID, and an approved document-header template configured in Payment Alerts. The template must have five body variables, in order: Booking ID, Payment ID, amount, status, and payment method. Set its language to the exact approved locale (for example, `en` or `en_US`). Use **Send test PDF** in the admin console to verify delivery with synthetic data. The test is sent to every configured WhatsApp admin recipient. Admin alerts are sent for pending/received submissions; the existing signed webhook notification continues to handle verified paid/captured/success events. Provider secrets are kept server-side and masked in the admin settings response.

In **Admin > Bookings**, an administrator can download a booking confirmation PDF or send that PDF to the guest's booking WhatsApp number. Document sending requires `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID`. Direct document messages are subject to WhatsApp's customer-service window and recipient opt-in requirements. For out-of-window sending, set `MTDC_BOOKING_WHATSAPP_TEMPLATE_NAME` and optionally `MTDC_BOOKING_WHATSAPP_TEMPLATE_LANGUAGE`; the approved template must have a document header and three body parameters in this order: booking reference, guest name, and resort name.

The current public bundle displays UPI/card as a payment choice but does not create or verify a gateway transaction. To activate real payments, configure a payment provider before launch: `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (or equivalent Stripe keys), add server-side order creation and webhook signature verification, and only set `payment_status=paid` after verification. Never put a service key or gateway secret in the frontend bundle.

## Deployment

1. Push this folder to a private Git repository.
2. Create a Node service on Render, Railway, Fly.io, or a VPS.
3. Use build command `npm install` and start command `node backend/server.js`.
4. Set `PORT` from the host, strong `MTDC_ADMIN_EMAIL` and `MTDC_ADMIN_PASSWORD`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.
5. Use persistent storage for `MTDC_DATA_FILE` if Supabase is not configured; otherwise the JSON file is only a fallback.
6. Point `www.mtdcresorts.com` DNS to the service and enable HTTPS.
7. Test `/`, `/admin`, login, a real Supabase booking read, and payment webhook verification before announcing bookings.