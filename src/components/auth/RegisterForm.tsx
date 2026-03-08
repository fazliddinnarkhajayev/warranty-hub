import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Store, User, Wrench, Building2, MapPin, Loader2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useRegister, useRegions, useDistricts } from '@/hooks/useApi';
import { hapticFeedback } from '@/lib/telegram';
import { getTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { UserType } from '@/lib/api/types';

const types: { id: UserType; icon: React.ReactNode; labelKey: 'seller' | 'customer' | 'technician' }[] = [
  { id: 'SELLER', icon: <Store className="w-6 h-6" />, labelKey: 'seller' },
  { id: 'CUSTOMER', icon: <User className="w-6 h-6" />, labelKey: 'customer' },
  { id: 'TECHNICIAN', icon: <Wrench className="w-6 h-6" />, labelKey: 'technician' },
];

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { telegramUser, language } = useApp();
  const registerMutation = useRegister();
  const { data: regions, isLoading: regionsLoading } = useRegions();
  
  const phone = (location.state as any)?.phone || '';
  
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    first_name: telegramUser?.first_name || '',
    last_name: telegramUser?.last_name || '',
    company: '',
    region_id: '',
    district_id: '',
  });
  const [error, setError] = useState('');

  const { data: districts, isLoading: districtsLoading } = useDistricts(formData.region_id || undefined);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const needsCompanyInfo = selectedType === 'SELLER' || selectedType === 'TECHNICIAN';

  const handleTypeSelect = (type: UserType) => {
    hapticFeedback.selection();
    setSelectedType(type);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'region_id') {
      setFormData(prev => ({ ...prev, district_id: '' }));
    }
  };

  const isValid = () => {
    if (!selectedType || !formData.first_name) return false;
    if (needsCompanyInfo && (!formData.company || !formData.region_id || !formData.district_id)) {
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!isValid() || !telegramUser || !selectedType) return;

    hapticFeedback.medium();
    setError('');

    try {
      await registerMutation.mutateAsync({
        telegram_id: telegramUser.id,
        phone,
        first_name: formData.first_name,
        last_name: formData.last_name || undefined,
        type: selectedType,
        ...(needsCompanyInfo && {
          company: formData.company,
          region_id: Number(formData.region_id),
          district_id: Number(formData.district_id),
        }),
      });

      hapticFeedback.success();
      navigate('/pending');
    } catch (err: any) {
      setError(err.message || t('network_error'));
      hapticFeedback.error();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-32">
      <div className="max-w-sm mx-auto space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{t('register')}</h1>
          <p className="text-muted-foreground">{t('select_role')}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {types.map(item => (
            <button
              key={item.id}
              onClick={() => handleTypeSelect(item.id)}
              className={cn(
                'tg-card flex flex-col items-center gap-2 py-4 transition-all',
                selectedType === item.id
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:bg-secondary/50'
              )}
            >
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                selectedType === item.id ? 'bg-primary/10 text-primary' : 'bg-secondary'
              )}>
                {item.icon}
              </div>
              <span className={cn(
                'text-sm',
                selectedType === item.id && 'font-medium'
              )}>
                {t(item.labelKey)}
              </span>
            </button>
          ))}
        </div>

        {selectedType && (
          <div className="space-y-4 animate-slide-up">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Имя</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="tg-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Фамилия</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="tg-input w-full"
                />
              </div>
            </div>

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
                    name="region_id"
                    value={formData.region_id}
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

                {formData.region_id && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">
                      {t('district')}
                    </label>
                    <select
                      name="district_id"
                      value={formData.district_id}
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

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
          </div>
        )}

        {selectedType && (
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
