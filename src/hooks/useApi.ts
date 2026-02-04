// React Query hooks for API calls

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
    queryFn: () => productsApi.getByCode(code!),
    enabled: !!code && code.length >= 3,
    retry: false,
  });
};

export const useWarrantyBySerial = (serial: string | undefined) => {
  return useQuery({
    queryKey: ['warranty-check', serial],
    queryFn: () => productsApi.checkWarrantyBySerial(serial!),
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
    queryFn: () => warrantiesApi.getAll(params),
  });
};

export const useWarranty = (id: string | undefined) => {
  return useQuery({
    queryKey: ['warranty', id],
    queryFn: () => warrantiesApi.getById(id!),
    enabled: !!id,
  });
};

export const useCreateWarranty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWarrantyRequest) => warrantiesApi.create(data),
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
    queryFn: () => servicesApi.getAll(params),
  });
};

export const useService = (id: string | undefined) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => servicesApi.getById(id!),
    enabled: !!id,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateServiceRequest) => servicesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

// Stats hooks
export const useSellerStats = (id: string | undefined) => {
  return useQuery({
    queryKey: ['stats', 'seller', id],
    queryFn: () => statsApi.getSeller(id!),
    enabled: !!id,
  });
};

export const useCustomerStats = (id: string | undefined) => {
  return useQuery({
    queryKey: ['stats', 'customer', id],
    queryFn: () => statsApi.getCustomer(id!),
    enabled: !!id,
  });
};

export const useTechnicianStats = (id: string | undefined) => {
  return useQuery({
    queryKey: ['stats', 'technician', id],
    queryFn: () => statsApi.getTechnician(id!),
    enabled: !!id,
  });
};

// Region hooks
export const useRegions = () => {
  return useQuery({
    queryKey: ['regions'],
    queryFn: () => regionsApi.getAll(),
  });
};

export const useDistricts = (regionId: string | undefined) => {
  return useQuery({
    queryKey: ['districts', regionId],
    queryFn: () => regionsApi.getDistricts(regionId!),
    enabled: !!regionId,
  });
};
