# MTDC backend

Run from the website directory:

```powershell
node backend/server.js
```

The public site remains at `/`; the admin console is at `/admin`. Default local credentials are `admin@mtdcresorts.com` and `MTDC-Admin-2026!`.

Set `MTDC_ADMIN_EMAIL`, `MTDC_ADMIN_PASSWORD`, `PORT`, `MTDC_DATA_FILE`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` in the environment before deployment. When the service key is present, the admin console reads and updates `bookings`, `payments`, `properties`, and `rooms` through Supabase; otherwise it uses the local JSON repository.

The payment metadata intake endpoint is `POST /api/payment-events`. Protect it with `MTDC_PAYMENT_EVENTS_SECRET` and send the `x-mtdc-payment-secret` header. Accepted safe fields include `booking_id`, `pnr`, `amount`, `payment_method`, `payment_status`, `upi_reference`, `transaction_id`, `gateway`, and `failure_reason`. Never send card number, expiry, CVV, or OTP to this endpoint.

The current public bundle displays UPI/card as a payment choice but does not create or verify a gateway transaction. To activate real payments, configure a payment provider before launch: `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (or equivalent Stripe keys), add server-side order creation and webhook signature verification, and only set `payment_status=paid` after verification. Never put a service key or gateway secret in the frontend bundle.

## Deployment

1. Push this folder to a private Git repository.
2. Create a Node service on Render, Railway, Fly.io, or a VPS.
3. Use build command `npm install` and start command `node backend/server.js`.
4. Set `PORT` from the host, strong `MTDC_ADMIN_EMAIL` and `MTDC_ADMIN_PASSWORD`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.
5. Use persistent storage for `MTDC_DATA_FILE` if Supabase is not configured; otherwise the JSON file is only a fallback.
6. Point `www.mtdcresorts.com` DNS to the service and enable HTTPS.
7. Test `/`, `/admin`, login, a real Supabase booking read, and payment webhook verification before announcing bookings.