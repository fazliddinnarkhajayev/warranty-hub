// API Endpoints

import api from './client';
import type {
  LoginRequest,
  LoginResponse,
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
  PaginatedResponse,
} from './types';

// Auth endpoints
export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/mobile/phone', data),

  getMe: () =>
    api.get<User>('/auth/me'),

  register: (data: RegisterRequest) =>
    api.post<{ success: boolean }>('/auth/telegram/register', data),
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
  getAll: (params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    const query = searchParams.toString();
    return api.get<PaginatedResponse<Product>>(`/products${query ? `?${query}` : ''}`);
  },

  getById: (id: string) =>
    api.get<Product>(`/products/${id}`),

  getByCode: (code: string) =>
    api.get<Product>(`/products/${code}`),

  getByType: (productTypeId: string, params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    const query = searchParams.toString();
    return api.get<PaginatedResponse<Product>>(`/products/product-type/${productTypeId}${query ? `?${query}` : ''}`);
  },

  checkWarrantyBySerial: (serial: string) =>
    api.get<{ product: Product; warranty?: Warranty; warranty_status: 'active' | 'expired' | 'none' }>(
      `/products/serial/${serial}`
    ),
};

// Warranties endpoints
export const warrantiesApi = {
  getAll: (params?: { page?: number; limit?: number; seller_id?: string; customer_id?: string; status?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.seller_id) searchParams.append('seller_id', params.seller_id);
    if (params?.customer_id) searchParams.append('customer_id', params.customer_id);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    const query = searchParams.toString();
    return api.get<PaginatedResponse<Warranty>>(`/warranties${query ? `?${query}` : ''}`);
  },

  getById: (id: string) =>
    api.get<Warranty>(`/warranties/${id}`),

  create: (data: CreateWarrantyRequest) =>
    api.post<Warranty>('/warranties', data),

  activate: (id: string) =>
    api.put<Warranty>(`/warranties/${id}/activate`, {}),

  getMyWarranties: (params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    const query = searchParams.toString();
    return api.get<PaginatedResponse<Warranty>>(`/warranties/my-warranties/customer${query ? `?${query}` : ''}`);
  },

  getByProduct: (productId: string) =>
    api.get<Warranty[]>(`/warranties/product/${productId}`),
};

// Services endpoints
export const servicesApi = {
  getAll: (params?: { page?: number; limit?: number; technician_id?: string; customer_id?: string; status?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.technician_id) searchParams.append('technician_id', params.technician_id);
    if (params?.customer_id) searchParams.append('customer_id', params.customer_id);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    const query = searchParams.toString();
    return api.get<PaginatedResponse<Service>>(`/services${query ? `?${query}` : ''}`);
  },

  getById: (id: string) =>
    api.get<Service>(`/services/${id}`),

  create: (data: CreateServiceRequest) =>
    api.post<Service>('/services', data),

  getByProduct: (productId: string, params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    const query = searchParams.toString();
    return api.get<PaginatedResponse<Service>>(`/services/product/${productId}${query ? `?${query}` : ''}`);
  },

  getWarrantyServices: (productId: string, params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    const query = searchParams.toString();
    return api.get<PaginatedResponse<Service>>(`/services/product/${productId}/warranty${query ? `?${query}` : ''}`);
  },

  getPaidServices: (productId: string, params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    const query = searchParams.toString();
    return api.get<PaginatedResponse<Service>>(`/services/product/${productId}/paid${query ? `?${query}` : ''}`);
  },
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
