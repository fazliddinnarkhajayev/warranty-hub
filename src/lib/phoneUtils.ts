// Uzbekistan phone number formatting (+998 XX XXX-XX-XX)

export const formatUzbekPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  
  if (digits.length === 0) return '';
  
  // Handle +998 prefix
  let normalized = digits;
  if (digits.startsWith('998')) {
    normalized = digits;
  } else if (digits.startsWith('8') && digits.length > 1) {
    // If starts with 8, assume it's meant to be 998
    normalized = '998' + digits.slice(1);
  } else if (!digits.startsWith('9')) {
    normalized = '998' + digits;
  } else {
    normalized = '998' + digits;
  }
  
  // Format: +998 XX XXX-XX-XX
  if (normalized.length <= 3) return `+${normalized}`;
  if (normalized.length <= 5) return `+${normalized.slice(0, 3)} ${normalized.slice(3)}`;
  if (normalized.length <= 8) return `+${normalized.slice(0, 3)} ${normalized.slice(3, 5)} ${normalized.slice(5)}`;
  if (normalized.length <= 10) return `+${normalized.slice(0, 3)} ${normalized.slice(3, 5)} ${normalized.slice(5, 8)}-${normalized.slice(8)}`;
  return `+${normalized.slice(0, 3)} ${normalized.slice(3, 5)} ${normalized.slice(5, 8)}-${normalized.slice(8, 10)}-${normalized.slice(10, 12)}`;
};

export const isValidUzbekPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 12 && digits.startsWith('998');
};

export const UZBEK_PHONE_PLACEHOLDER = '+998 XX XXX-XX-XX';
