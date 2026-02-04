import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Store, User, Wrench, Building2, MapPin, Loader2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useRegister, useRegions, useDistricts } from '@/hooks/useApi';
import { hapticFeedback } from '@/lib/telegram';
import { getTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/api/types';

const roles: { id: UserRole; icon: React.ReactNode; labelKey: 'seller' | 'customer' | 'technician' }[] = [
  { id: 'seller', icon: <Store className="w-6 h-6" />, labelKey: 'seller' },
  { id: 'customer', icon: <User className="w-6 h-6" />, labelKey: 'customer' },
  { id: 'technician', icon: <Wrench className="w-6 h-6" />, labelKey: 'technician' },
];

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { telegramUser, language, setUser, setAuthStatus } = useApp();
  const registerMutation = useRegister();
  const { data: regions, isLoading: regionsLoading } = useRegions();
  
  const phone = (location.state as any)?.phone || '';
  
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    firstname: telegramUser?.first_name || '',
    lastname: telegramUser?.last_name || '',
    company: '',
    region: '',
    district: '',
  });
  const [error, setError] = useState('');

  const { data: districts, isLoading: districtsLoading } = useDistricts(formData.region || undefined);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const needsCompanyInfo = selectedRole === 'seller' || selectedRole === 'technician';

  const handleRoleSelect = (role: UserRole) => {
    hapticFeedback.selection();
    setSelectedRole(role);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset district when region changes
    if (name === 'region') {
      setFormData(prev => ({ ...prev, district: '' }));
    }
  };

  const isValid = () => {
    if (!selectedRole || !formData.firstname) return false;
    if (needsCompanyInfo && (!formData.company || !formData.region || !formData.district)) {
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!isValid() || !telegramUser || !selectedRole) return;

    hapticFeedback.medium();
    setError('');

    try {
      const response = await registerMutation.mutateAsync({
        telegram_id: telegramUser.id,
        phone,
        firstname: formData.firstname,
        lastname: formData.lastname,
        language,
        role: selectedRole,
        ...(needsCompanyInfo && {
          company: formData.company,
          region: formData.region,
          district: formData.district,
        }),
      });

      if (response.status === 'pending') {
        setAuthStatus('pending');
        hapticFeedback.success();
        navigate('/pending');
      } else if (response.status === 'approved' && response.user) {
        setUser(response.user);
        setAuthStatus('approved');
        hapticFeedback.success();
        localStorage.setItem("warranty_bot_user", JSON.stringify(response.user));
      }
    } catch (err: any) {
      setError(err.message || t('network_error'));
      hapticFeedback.error();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-32">
      <div className="max-w-sm mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{t('register')}</h1>
          <p className="text-muted-foreground">{t('select_role')}</p>
        </div>

        {/* Role selection */}
        <div className="grid grid-cols-3 gap-3">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={cn(
                'tg-card flex flex-col items-center gap-2 py-4 transition-all',
                selectedRole === role.id
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:bg-secondary/50'
              )}
            >
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                selectedRole === role.id ? 'bg-primary/10 text-primary' : 'bg-secondary'
              )}>
                {role.icon}
              </div>
              <span className={cn(
                'text-sm',
                selectedRole === role.id && 'font-medium'
              )}>
                {t(role.labelKey)}
              </span>
            </button>
          ))}
        </div>

        {/* Form fields */}
        {selectedRole && (
          <div className="space-y-4 animate-slide-up">
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Имя
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="tg-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Фамилия
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="tg-input w-full"
                />
              </div>
            </div>

            {/* Company info for seller/technician */}
            {needsCompanyInfo && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    {t('company')}
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="ООО Компания"
                    className="tg-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {t('region')}
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    disabled={regionsLoading}
                    className="tg-input w-full appearance-none"
                  >
                    <option value="">Выберите регион</option>
                    {regions?.map(region => (
                      <option key={region.id} value={region.id}>
                        {language === 'uz' ? region.name_uz : language === 'ru' ? region.name_ru : region.name_en || region.name}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.region && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">
                      {t('district')}
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      disabled={districtsLoading}
                      className="tg-input w-full appearance-none"
                    >
                      <option value="">Выберите район</option>
                      {districts?.map(district => (
                        <option key={district.id} value={district.id}>
                          {language === 'uz' ? district.name_uz : language === 'ru' ? district.name_ru : district.name_en || district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Error */}
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
          </div>
        )}

        {/* Submit button */}
        {selectedRole && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent pt-8">
            <button
              onClick={handleSubmit}
              disabled={!isValid() || registerMutation.isPending}
              className={cn(
                'tg-button-primary w-full max-w-sm mx-auto flex items-center justify-center gap-2',
                (!isValid() || registerMutation.isPending) && 'opacity-50 cursor-not-allowed'
              )}
            >
              {registerMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                t('register')
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
