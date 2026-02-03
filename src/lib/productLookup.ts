import { mockWarranties, type Warranty } from './mockData';

export interface ProductLookupResult {
  found: boolean;
  product?: {
    name: string;
    serial_number: string;
    customer_name: string;
    customer_phone: string;
    warranty_status: 'active' | 'expired' | 'not_found';
    expiry_date?: string;
    purchase_date?: string;
  };
  error?: string;
}

// Product database - simulates product codes with their info
export const productDatabase: Record<string, { name: string; category: string }> = {
  'IP15PRO': { name: 'iPhone 15 Pro', category: 'Смартфон' },
  'IP15PM': { name: 'iPhone 15 Pro Max', category: 'Смартфон' },
  'IP14PRO': { name: 'iPhone 14 Pro', category: 'Смартфон' },
  'SGS24U': { name: 'Samsung Galaxy S24 Ultra', category: 'Смартфон' },
  'SGS24': { name: 'Samsung Galaxy S24', category: 'Смартфон' },
  'MBA-M2': { name: 'MacBook Air M2', category: 'Ноутбук' },
  'MBP-M3': { name: 'MacBook Pro M3', category: 'Ноутбук' },
  'AIRPODS2': { name: 'AirPods Pro 2', category: 'Наушники' },
  'SONYXM5': { name: 'Sony WH-1000XM5', category: 'Наушники' },
  'IPADPRO': { name: 'iPad Pro 12.9"', category: 'Планшет' },
};

export const lookupProductByCode = (code: string): { found: boolean; name?: string; category?: string; error?: string } => {
  const upperCode = code.trim().toUpperCase();
  
  if (!upperCode) {
    return { found: false, error: 'Введите код товара' };
  }
  
  const product = productDatabase[upperCode];
  
  if (product) {
    return { found: true, name: product.name, category: product.category };
  }
  
  return { found: false, error: 'Товар не найден' };
};

export const lookupWarrantyBySerialOrCode = (serialOrCode: string): ProductLookupResult => {
  const query = serialOrCode.trim().toUpperCase();
  
  if (!query) {
    return { found: false, error: 'Введите серийный номер' };
  }
  
  // First, try to find by serial number in existing warranties
  const warranty = mockWarranties.find(
    w => w.serial_number.toUpperCase() === query
  );
  
  if (warranty) {
    const now = new Date();
    const expiryDate = new Date(warranty.expiry_date);
    const isActive = expiryDate > now;
    
    return {
      found: true,
      product: {
        name: warranty.product_name,
        serial_number: warranty.serial_number,
        customer_name: warranty.customer_name,
        customer_phone: warranty.customer_phone,
        warranty_status: isActive ? 'active' : 'expired',
        expiry_date: warranty.expiry_date,
        purchase_date: warranty.purchase_date,
      },
    };
  }
  
  return { found: false, error: 'Гарантия не найдена' };
};

// Get available product codes for display
export const getProductCodes = (): string[] => {
  return Object.keys(productDatabase);
};
