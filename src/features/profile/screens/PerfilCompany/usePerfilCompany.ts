import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuthStore } from '../../../auth/store/authStore';
import { profilesApi } from '../../services/profilesApi';
import { ProfileCompany } from '../../../../types';

export default function usePerfilCompany() {
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState<ProfileCompany | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cnpjVisible, setCnpjVisible] = useState(false);

  const fetchProfile = useCallback(() => {
    return profilesApi
      .getMyProfileCompany()
      .then(setProfile)
      .catch(() => setProfile(null));
  }, []);

  useEffect(() => {
    fetchProfile().finally(() => setIsLoading(false));
  }, [fetchProfile]);

  const handleSaveProfile = useCallback(
    async (data: any) => {
      setIsSaving(true);
      try {
        await profilesApi.updateProfileCompany(data);
        await fetchProfile();
        Alert.alert('Sucesso', 'Perfil salvo com sucesso!');
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? err?.message ?? 'Erro desconhecido';
        Alert.alert('Erro', Array.isArray(msg) ? msg.join('\n') : String(msg));
      } finally {
        setIsSaving(false);
      }
    },
    [fetchProfile],
  );

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  const maskedCnpj = profile?.cnpj
    ? profile.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '••.•••.•••/$1$2-••')
    : '••.•••.•••/••••-••';

  return {
    user,
    profile,
    isLoading,
    isSaving,
    cnpjVisible,
    setCnpjVisible,
    maskedCnpj,
    handleSaveProfile,
    handleLogout,
  };
}
