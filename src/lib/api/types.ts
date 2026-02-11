// API Types for warranty_bot

export type UserRole = 'seller' | 'customer' | 'technician';
export type AuthStatus = 'CREATED' | 'REQUESTED' | 'NOT_FOUND';
export type WarrantyStatus = 'active' | 'expired' | 'pending';
export type ServiceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// Auth
export interface TelegramAuthRequest {
  phone: string;
}

export interface AuthResponse {
  status: AuthStatus;
  user?: User;
  token?: string;
}

export interface RegisterRequest {
  telegram_id: number;
  phone: string;
  first_name: string;
  last_name?: string;
  role: UserRole;
  company?: string;
  region_id?: number;
  district_id?: number;
}

// User
export interface User {
  id: number;
  telegram_id: string;
  phone: string;
  first_name: string;
  last_name?: string;
  role: UserRole;
  company?: string;
  region_id?: number;
  district_id?: number;
  created_by?: number | null;
  status: AuthStatus;
  created_at: string;
}

export interface UserUpdateRequest {
  first_name?: string;
  last_name?: string;
}

// Product
export interface Product {
  id: string;
  code: string;
  name: string;
  category?: string;
  brand?: string;
  warranty_months: number;
}

// Warranty
export interface Warranty {
  id: string;
  product_id: string;
  product_code: string;
  product_name: string;
  serial_number: string;
  seller_id: string;
  seller_name?: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  warranty_period: number;
  status: WarrantyStatus;
  start_date: string;
  expiry_date: string;
  created_at: string;
  updated_at: string;
  services?: Service[];
}

export interface CreateWarrantyRequest {
  product_code: string;
  serial_number: string;
  customer_name: string;
  customer_phone: string;
  warranty_period: number;
}

// Service
export interface Service {
  id: string;
  warranty_id?: string;
  product_code: string;
  product_name: string;
  serial_number: string;
  technician_id: string;
  technician_name?: string;
  customer_name: string;
  customer_phone: string;
  problem: string;
  solution?: string;
  is_warranty: boolean;
  price: number;
  status: ServiceStatus;
  warranty_status?: 'active' | 'expired' | 'none';
  created_at: string;
  updated_at: string;
}

export interface CreateServiceRequest {
  serial_number: string;
  problem: string;
  solution?: string;
  is_warranty: boolean;
  price: number;
}

// Stats
export interface SellerStats {
  total_warranties: number;
  active_warranties: number;
  expired_warranties: number;
  this_month: number;
  this_week: number;
  by_status: {
    active: number;
    expired: number;
    pending: number;
  };
  monthly_trend: {
    month: string;
    count: number;
  }[];
}

export interface CustomerStats {
  total_warranties: number;
  active_warranties: number;
  expired_warranties: number;
  total_services: number;
  warranty_services: number;
  paid_services: number;
}

export interface TechnicianStats {
  total_services: number;
  pending_services: number;
  in_progress_services: number;
  completed_services: number;
  warranty_repairs: number;
  paid_repairs: number;
  total_earnings: number;
  this_month_earnings: number;
  monthly_trend: {
    month: string;
    count: number;
    earnings: number;
  }[];
}

// Regions for registration
export interface Region {
  id: string;
  name: string;
  name_uz?: string;
  name_ru?: string;
  name_en?: string;
}

export interface District {
  id: string;
  region_id: string;
  name: string;
  name_uz?: string;
  name_ru?: string;
  name_en?: string;
}
