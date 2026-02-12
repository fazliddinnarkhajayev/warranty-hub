// React Query hooks with API-first, fallback to test data

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  authApi,
  usersApi,
  productsApi,
  warrantiesApi,
  servicesApi,
  statsApi,
  regionsApi,
} from '@/lib/api';
import type {
  TelegramAuthRequest,
  RegisterRequest,
  UserUpdateRequest,
  CreateWarrantyRequest,
  CreateServiceRequest,
} from '@/lib/api';
import {
  fallbackWarranties,
  fallbackServices,
  fallbackProducts,
  fallbackSellerStats,
  fallbackCustomerStats,
  fallbackTechnicianStats,
  fallbackRegions,
  fallbackDistricts,
} from '@/lib/fallbackData';

// Helper: try API, fallback to mock
async function withFallback<T>(apiFn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await apiFn();
  } catch (error) {
    console.warn('[API Fallback] Using test data:', error);
    return fallback;
  }
}

// Auth hooks
export const useTelegramAuth = () => {
  return useMutation({
    mutationFn: (data: TelegramAuthRequest) => authApi.telegramAuth(data),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  });
};

// User hooks
export const useUser = (id: string | undefined) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getUser(id!),
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserUpdateRequest }) =>
      usersApi.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
};

// Product hooks
export const useProductByCode = (code: string | undefined) => {
  return useQuery({
    queryKey: ['product', code],
    queryFn: () => withFallback(
      () => productsApi.getByCode(code!),
      fallbackProducts[code!.toUpperCase()] || (() => { throw new Error('Not found'); })()
    ),
    enabled: !!code && code.length >= 3,
    retry: false,
  });
};

export const useWarrantyBySerial = (serial: string | undefined) => {
  return useQuery({
    queryKey: ['warranty-check', serial],
    queryFn: () => {
      const fb = fallbackWarranties.find(w => w.serial_number.toUpperCase() === serial!.toUpperCase());
      const fallback = fb ? {
        product: fallbackProducts[fb.product_code] || { id: fb.product_id, code: fb.product_code, name: fb.product_name, warranty_months: fb.warranty_period },
        warranty: fb,
        warranty_status: fb.status === 'active' ? 'active' as const : 'expired' as const,
      } : undefined;
      return withFallback(
        () => productsApi.checkWarrantyBySerial(serial!),
        fallback || (() => { throw new Error('Not found'); })()
      );
    },
    enabled: !!serial && serial.length >= 5,
    retry: false,
  });
};

// Warranty hooks
export const useWarranties = (params?: {
  seller_id?: string;
  customer_id?: string;
  status?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['warranties', params],
    queryFn: () => {
      let fb = [...fallbackWarranties];
      if (params?.status) fb = fb.filter(w => w.status === params.status);
      if (params?.search) {
        const q = params.search.toLowerCase();
        fb = fb.filter(w =>
          w.product_name.toLowerCase().includes(q) ||
          w.customer_name.toLowerCase().includes(q) ||
          w.serial_number.toLowerCase().includes(q)
        );
      }
      return withFallback(() => warrantiesApi.getAll(params), fb);
    },
  });
};

export const useWarranty = (id: string | undefined) => {
  return useQuery({
    queryKey: ['warranty', id],
    queryFn: () => withFallback(
      () => warrantiesApi.getById(id!),
      fallbackWarranties.find(w => w.id === id)!
    ),
    enabled: !!id,
  });
};

export const useCreateWarranty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateWarrantyRequest) => {
      try {
        return await warrantiesApi.create(data);
      } catch {
        console.warn('[API Fallback] Simulating warranty creation');
        const product = fallbackProducts[data.product_code.toUpperCase()];
        const now = new Date().toISOString();
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + data.warranty_period);
        return {
          id: String(Date.now()),
          product_id: product?.id || '0',
          product_code: data.product_code,
          product_name: product?.name || data.product_code,
          serial_number: data.serial_number,
          seller_id: '1', seller_name: 'Test',
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          warranty_period: data.warranty_period,
          status: 'active' as const,
          start_date: now.split('T')[0],
          expiry_date: expiry.toISOString().split('T')[0],
          created_at: now, updated_at: now,
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warranties'] });
    },
  });
};

// Service hooks
export const useServices = (params?: {
  technician_id?: string;
  customer_id?: string;
  status?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['services', params],
    queryFn: () => {
      let fb = [...fallbackServices];
      if (params?.status) fb = fb.filter(s => s.status === params.status);
      if (params?.search) {
        const q = params.search.toLowerCase();
        fb = fb.filter(s =>
          s.product_name.toLowerCase().includes(q) ||
          s.customer_name.toLowerCase().includes(q) ||
          s.problem.toLowerCase().includes(q)
        );
      }
      return withFallback(() => servicesApi.getAll(params), fb);
    },
  });
};

export const useService = (id: string | undefined) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => withFallback(
      () => servicesApi.getById(id!),
      fallbackServices.find(s => s.id === id)!
    ),
    enabled: !!id,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateServiceRequest) => {
      try {
        return await servicesApi.create(data);
      } catch {
        console.warn('[API Fallback] Simulating service creation');
        const warranty = fallbackWarranties.find(w => w.serial_number.toUpperCase() === data.serial_number.toUpperCase());
        const now = new Date().toISOString();
        return {
          id: String(Date.now()),
          warranty_id: warranty?.id,
          product_code: warranty?.product_code || '',
          product_name: warranty?.product_name || 'Unknown',
          serial_number: data.serial_number,
          technician_id: '1', technician_name: 'Test',
          customer_name: warranty?.customer_name || '',
          customer_phone: warranty?.customer_phone || '',
          problem: data.problem,
          solution: data.solution,
          is_warranty: data.is_warranty,
          price: data.price,
          status: 'pending' as const,
          warranty_status: warranty?.status === 'active' ? 'active' as const : 'expired' as const,
          created_at: now, updated_at: now,
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

// Stats hooks
export const useSellerStats = (id: string | undefined) => {
  return useQuery({
    queryKey: ['stats', 'seller', id],
    queryFn: () => withFallback(() => statsApi.getSeller(id!), fallbackSellerStats),
    enabled: !!id,
  });
};

export const useCustomerStats = (id: string | undefined) => {
  return useQuery({
    queryKey: ['stats', 'customer', id],
    queryFn: () => withFallback(() => statsApi.getCustomer(id!), fallbackCustomerStats),
    enabled: !!id,
  });
};

export const useTechnicianStats = (id: string | undefined) => {
  return useQuery({
    queryKey: ['stats', 'technician', id],
    queryFn: () => withFallback(() => statsApi.getTechnician(id!), fallbackTechnicianStats),
    enabled: !!id,
  });
};

// Region hooks
export const useRegions = () => {
  return useQuery({
    queryKey: ['regions'],
    queryFn: () => withFallback(() => regionsApi.getAll(), fallbackRegions),
  });
};

export const useDistricts = (regionId: string | undefined) => {
  return useQuery({
    queryKey: ['districts', regionId],
    queryFn: () => withFallback(
      () => regionsApi.getDistricts(regionId!),
      fallbackDistricts[regionId!] || []
    ),
    enabled: !!regionId,
  });
};
