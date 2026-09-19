export function formatPrice(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  const val = Number(amount);
  
  if (val >= 10000000) {
    const cr = val / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  } else if (val >= 100000) {
    const lakhs = val / 100000;
    return `₹${lakhs.toFixed(2)} L`;
  } else {
    return `₹${val.toLocaleString('en-IN')}`;
  }
}

export function formatPriceFull(amount) {
  if (!amount && amount !== 0) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

export function formatNumber(num) {
  if (!num && num !== 0) return '0';
  return Number(num).toLocaleString('en-IN');
}

export function formatDate(dateString) {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
