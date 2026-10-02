const receiptUrl = new URL('/booking-confirmation.html', window.location.origin);
receiptUrl.search = window.location.search;
receiptUrl.hash = window.location.hash;
window.location.replace(receiptUrl.toString());

export function component() {
  return null;
}

export default component;
