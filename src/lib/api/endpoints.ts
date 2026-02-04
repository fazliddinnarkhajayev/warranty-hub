// API Endpoints

import api from './client';
import type {
  TelegramAuthRequest,
  AuthResponse,
  RegisterRequest,
  User,
  UserUpdateRequest,
  Product,
  Warranty,
  CreateWarrantyRequest,
  Service,
  CreateServiceRequest,
  SellerStats,
  CustomerStats,
  TechnicianStats,
  Region,
  District,
} from './types';

// Auth endpoints
export const authApi = {
  telegramAuth: (data: TelegramAuthRequest) =>
    api.post<AuthResponse>('/auth/telegram', data),
  
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/auth/register', data),
};

// Users endpoints
export const usersApi = {
  getUser: (id: string) =>
    api.get<User>(`/users/${id}`),
  
  updateUser: (id: string, data: UserUpdateRequest) =>
    api.put<User>(`/users/${id}`, data),
};

// Products endpoints
export const productsApi = {
  getByCode: (code: string) =>
    api.get<Product>(`/products/${code}`),
  
  checkWarrantyBySerial: (serial: string) =>
    api.get<{ product: Product; warranty?: Warranty; warranty_status: 'active' | 'expired' | 'none' }>(
      `/products/serial/${serial}`
    ),
};

// Warranties endpoints
export const warrantiesApi = {
  getAll: (params?: { seller_id?: string; customer_id?: string; status?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.seller_id) searchParams.append('seller_id', params.seller_id);
    if (params?.customer_id) searchParams.append('customer_id', params.customer_id);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    const query = searchParams.toString();
    return api.get<Warranty[]>(`/warranties${query ? `?${query}` : ''}`);
  },
  
  getById: (id: string) =>
    api.get<Warranty>(`/warranties/${id}`),
  
  create: (data: CreateWarrantyRequest) =>
    api.post<Warranty>('/warranties', data),
};

// Services endpoints
export const servicesApi = {
  getAll: (params?: { technician_id?: string; customer_id?: string; status?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.technician_id) searchParams.append('technician_id', params.technician_id);
    if (params?.customer_id) searchParams.append('customer_id', params.customer_id);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    const query = searchParams.toString();
    return api.get<Service[]>(`/services${query ? `?${query}` : ''}`);
  },
  
  getById: (id: string) =>
    api.get<Service>(`/services/${id}`),
  
  create: (data: CreateServiceRequest) =>
    api.post<Service>('/services', data),
};

// Stats endpoints
export const statsApi = {
  getSeller: (id: string) =>
    api.get<SellerStats>(`/stats/seller/${id}`),
  
  getCustomer: (id: string) =>
    api.get<CustomerStats>(`/stats/customer/${id}`),
  
  getTechnician: (id: string) =>
    api.get<TechnicianStats>(`/stats/technician/${id}`),
};

// Regions endpoints
export const regionsApi = {
  getAll: () =>
    api.get<Region[]>('/regions'),
  
  getDistricts: (regionId: string) =>
    api.get<District[]>(`/regions/${regionId}/districts`),
};
