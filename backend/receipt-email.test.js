const test = require('node:test');
const assert = require('node:assert/strict');

const { buildCustomerReceiptEmailPayload, normalizeBookingReceiptDetails, buildPublicBookingReceipt, findPublicBooking } = require('./server.js');

test('findPublicBooking verifies both booking ID and normalized PNR', () => {
  const bookings = [{ booking_id: 'MTDCLIVE-240817', pnr: '679006', hotel_name: 'MTDC Ganpatipule Resort' }];

  assert.equal(findPublicBooking(bookings, 'MTDCLIVE-240817', '679\n0\n06').hotel_name, 'MTDC Ganpatipule Resort');
  assert.equal(findPublicBooking(bookings, 'MTDCLIVE-240817', '').hotel_name, 'MTDC Ganpatipule Resort');
  assert.equal(findPublicBooking(bookings, 'MTDCLIVE-240817', '000000'), null);
  assert.equal(findPublicBooking(bookings, 'OTHER-BOOKING', '679006'), null);
});

test('buildPublicBookingReceipt returns the itinerary stored on the booking only', () => {
  const receipt = buildPublicBookingReceipt({
    booking_id: 'MTDCLIVE-240817',
    pnr: '679006',
    hotel_name: 'MTDC Ganpatipule Resort',
    address: 'Ganpatipule, Konkan',
    room_category: 'Deluxe Room',
    check_in: '2026-10-12',
    check_out: '2026-10-14',
    total_payment: 3200,
    card_number: '4111111111111111'
  });

  assert.equal(receipt.hotel_name, 'MTDC Ganpatipule Resort');
  assert.equal(receipt.address, 'Ganpatipule, Konkan');
  assert.equal(receipt.room_category, 'Deluxe Room');
  assert.equal(receipt.check_in, '2026-10-12');
  assert.equal(receipt.check_out, '2026-10-14');
  assert.equal(receipt.total_payment, 3200);
  assert.equal('card_number' in receipt, false);
});

test('normalizeBookingReceiptDetails preserves the selected resort and booking details', () => {
  const details = normalizeBookingReceiptDetails({
    guestName: 'Asha Patil',
    email: 'asha@example.com',
    mobile: '9876543210',
    bookingId: 'MTDCLIVE-240817',
    hotelName: 'MTDC Ganpatipule Resort',
    roomCategory: 'Deluxe Room',
    checkIn: '2026-10-12',
    checkOut: '2026-10-14',
    guests: '2',
    specialRequest: 'Near pool side',
    amount: '3200'
  });

  assert.equal(details.guest_name, 'Asha Patil');
  assert.equal(details.email, 'asha@example.com');
  assert.equal(details.hotel_name, 'MTDC Ganpatipule Resort');
  assert.equal(details.room_category, 'Deluxe Room');
  assert.equal(details.check_in, '2026-10-12');
  assert.equal(details.check_out, '2026-10-14');
  assert.equal(details.guests, '2');
  assert.equal(details.total_payment, 3200);
  assert.match(details.special_request, /Near pool side/);
});

test('buildCustomerReceiptEmailPayload includes actual booking information from the user', () => {
  const booking = {
    booking_id: 'MTDCLIVE-240817',
    pnr: '679006',
    guest_name: 'Asha Patil',
    mobile: '9876543210',
    email: 'asha@example.com',
    hotel_name: 'MTDC Ganpatipule Resort',
    address: 'Ganpatipule, Konkan',
    room_category: 'Deluxe Room',
    check_in: '2026-10-12',
    check_out: '2026-10-14',
    total_nights: 2,
    num_rooms: 1,
    total_payment: 3200,
    special_request: 'Near pool side'
  };

  const payload = buildCustomerReceiptEmailPayload(booking, {
    contact_email: 'reservations@mtdcresorts.com',
    phone_number: '9232504371'
  });

  assert.equal(payload.to[0], 'asha@example.com');
  assert.match(payload.subject, /MTDC Booking Receipt/i);
  assert.match(payload.text, /Asha Patil/);
  assert.match(payload.text, /9876543210/);
  assert.match(payload.text, /MTDC Ganpatipule Resort/);
  assert.match(payload.text, /Ganpatipule, Konkan/);
  assert.match(payload.text, /Room Category: Deluxe Room/);
  assert.match(payload.text, /Check-in: 2026-10-12/);
  assert.match(payload.text, /Check-out: 2026-10-14/);
  assert.match(payload.text, /Nights: 2/);
  assert.match(payload.text, /₹3,200/);
  assert.match(payload.text, /Near pool side/);
});
