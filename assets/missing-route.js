import { n as reactFactory, t as runtimeFactory } from './jsx-runtime-DE3RlOCf.js';
const runtime = runtimeFactory();
const labels = {
  '/resorts': ['Our Resorts', 'Browse MTDC stays across Maharashtra and continue to the booking form from the home page.'],
  '/destinations': ['Where to Go', 'Explore Maharashtra destinations and choose an official MTDC stay.'],
  '/about': ['About MTDC', 'Maharashtra Tourism Development Corporation official resort information.'],
  '/track-booking': ['Track My Booking', 'Use your booking reference and PNR to request reservation support.'],
  '/sustainability': ['Responsible Travel', 'Learn about responsible stays across Maharashtra.'],
  '/privacy-policy': ['Privacy Policy', 'Information about privacy and reservation data.'],
  '/terms-and-conditions': ['Terms & Conditions', 'Terms governing MTDC reservations and stays.'],
  '/cancellation-policy': ['Cancellation Policy', 'Cancellation and modification information for reservations.'],
  '/refund-policy': ['Refund Policy', 'Refund process and support information.'],
  '/booking-confirmed': ['Booking received', 'Your reservation details have been submitted. Payment status will be updated after gateway verification.'],
  '/secure-payment': ['Secure payment', 'Complete payment through the configured gateway to confirm your reservation.'],
  '/payment-status-check': ['Payment status', 'Check the latest status of your reservation payment.']
};
function PaymentPage() {
  const React = Object.assign(reactFactory(), runtime);
  const [method, setMethod] = React.useState('upi');
  const [step, setStep] = React.useState('details');
  const [upiId, setUpiId] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [resend, setResend] = React.useState(0);
  const [message, setMessage] = React.useState('');
  const bookingId = new URLSearchParams(window.location.search).get('bookingId') || 'DEMO-BOOKING';
  const amount = Number(new URLSearchParams(window.location.search).get('amount') || 0);
  const send = async (payload) => { await fetch('/api/payment-intents', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }); };
  const requestUpi = async (event) => { event.preventDefault(); if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) return setMessage('Enter a valid UPI ID, for example name@bank.'); await send({ booking_id: bookingId, amount, payment_method: 'upi', upi_id: upiId, payment_status: 'pending' }); setMessage('UPI payment request sent. Approve it in your UPI app.'); };
  const requestCardOtp = (event) => { event.preventDefault(); if (cardNumber.replace(/\D/g, '').length !== 16 || !expiry || cvv.length < 3 || !cardName) return setMessage('Complete the card details.'); setStep('otp'); setResend(30); setMessage('OTP sent to your registered mobile number.'); };
  const verifyOtp = async (event) => { event.preventDefault(); if (!/^\d{6}$/.test(otp)) return setMessage('Enter the 6-digit OTP.'); await send({ booking_id: bookingId, amount, payment_method: 'card', card_brand: 'card', card_last4: cardNumber.replace(/\D/g, '').slice(-4), otp_verified: true, payment_status: 'pending' }); setMessage('OTP accepted. Payment is awaiting gateway confirmation.'); setStep('done'); };
  React.useEffect(() => { if (!resend) return; const timer = setTimeout(() => setResend(value => value - 1), 1000); return () => clearTimeout(timer); }, [resend]);
  const input = (label, value, setValue, type = 'text', placeholder = '') => React.jsxs('label', { className: 'field', children: [React.jsx('span', { children: label }), React.jsx('input', { required: true, type, value, placeholder, onChange: event => setValue(event.target.value) })] });
  return React.jsxs('main', { className: 'min-h-screen bg-background px-4 py-28', children: [
    React.jsxs('section', { className: 'mx-auto max-w-lg rounded-2xl border border-border bg-card p-6 shadow-lg', children: [
      React.jsx('p', { className: 'text-xs font-bold uppercase tracking-[.18em] text-primary', children: 'Reservations Desk' }),
      React.jsx('h1', { className: 'mt-2 font-display text-3xl font-bold text-foreground', children: step === 'otp' ? 'Verify OTP' : step === 'done' ? 'Payment submitted' : 'Secure Payment' }),
      React.jsx('p', { className: 'mt-2 text-sm text-muted-foreground', children: `Booking ${bookingId} · Amount ₹${amount.toLocaleString('en-IN')}` }),
      step === 'otp' ? React.jsxs('form', { onSubmit: verifyOtp, className: 'mt-6 space-y-4', children: [input('6-digit OTP', otp, setOtp, 'tel', '123456'), React.jsx('button', { className: 'btn', children: 'Verify OTP' }), React.jsx('button', { type: 'button', className: 'btn secondary', disabled: resend > 0, onClick: () => { setResend(30); setMessage('A new OTP was sent.'); }, children: resend ? `Resend OTP in ${resend}s` : 'Resend OTP' })] }) : step === 'done' ? React.jsx('p', { className: 'mt-6 rounded-lg bg-green-50 p-4 text-green-800', children: 'Payment details submitted securely. Final status will come from the payment gateway.' }) : React.jsxs(React.Fragment, { children: [React.jsxs('div', { className: 'mt-6 grid grid-cols-2 gap-3', children: [React.jsx('button', { type: 'button', className: `btn ${method === 'upi' ? '' : 'secondary'}`, onClick: () => setMethod('upi'), children: 'UPI' }), React.jsx('button', { type: 'button', className: `btn ${method === 'card' ? '' : 'secondary'}`, onClick: () => setMethod('card'), children: 'Credit / Debit Card' })] }), method === 'upi' ? React.jsxs('form', { onSubmit: requestUpi, className: 'mt-5 space-y-4', children: [input('UPI ID', upiId, setUpiId, 'text', 'name@bank'), React.jsx('button', { className: 'btn', children: 'Send UPI Payment Request' })] }) : React.jsxs('form', { onSubmit: requestCardOtp, className: 'mt-5 space-y-4', children: [input('Cardholder name', cardName, setCardName), input('Card number', cardNumber, setCardNumber, 'tel', '1234 5678 9012 3456'), React.jsxs('div', { className: 'grid grid-cols-2 gap-3', children: [input('Expiry', expiry, setExpiry, 'tel', 'MM/YY'), input('CVV', cvv, setCvv, 'password', '***')] }), React.jsx('button', { className: 'btn', children: 'Continue to OTP' }), React.jsx('p', { className: 'text-xs text-muted-foreground', children: 'Card details are used only for gateway validation and are never stored.' })] })] }), message && React.jsx('p', { className: 'mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900', children: message })
    ] })
  ] });
}
export function component() {
  if (window.location.pathname === '/secure-payment') return PaymentPage();
  const [title, description] = labels[window.location.pathname] || ['MTDC Resorts', 'Official Maharashtra Tourism stays and reservations.'];
  return runtime.jsxs('main', {
    className: 'min-h-screen bg-background px-6 py-32 text-center',
    children: [
      runtime.jsx('p', { className: 'mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary', children: 'Maharashtra Unlimited' }),
      runtime.jsx('h1', { className: 'font-display mx-auto max-w-3xl text-4xl font-bold text-foreground', children: title }),
      runtime.jsx('p', { className: 'mx-auto mt-5 max-w-xl text-muted-foreground', children: description }),
      runtime.jsxs('div', { className: 'mt-8 flex justify-center gap-3', children: [
        runtime.jsx('a', { className: 'rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground', href: '/#book', children: 'Book a stay' }),
        runtime.jsx('a', { className: 'rounded-md border border-border px-5 py-3 font-semibold text-foreground', href: '/', children: 'Go home' })
      ]})
    ]
  });
}
