import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useUserStore } from '../../store/userStore';
import { profilesApi } from '../../services/profilesApi';
import { useAuthStore } from '../../../auth/store/authStore';

export default function useProfilePF() {
  const { profile, fetchProfile, isLoading } = useUserStore();
  const { logout } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const profilePF = profile?.profilePF;
  const hasProfile = !!profilePF;

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = useCallback(async (data: any) => {
    setIsSaving(true);
    try {
      if (hasProfile) {
        await profilesApi.updateProfilePF(data);
      } else {
        await profilesApi.createProfilePF(data);
      }
      await fetchProfile();
      Alert.alert('Sucesso', 'Perfil salvo com sucesso!');
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Erro desconhecido';
      Alert.alert('Erro', Array.isArray(msg) ? msg.join('\n') : String(msg));
    } finally {
      setIsSaving(false);
    }
  }, [hasProfile]);

  const handleAddExperience = useCallback(async (data: any) => {
    try {
      await profilesApi.addExperience(data);
      await fetchProfile();
      setActiveSection(null);
      Alert.alert('Sucesso', 'Experiencia adicionada!');
    } catch {
      Alert.alert('Erro', 'Nao foi possivel adicionar experiencia');
    }
  }, []);

  const handleRemoveExperience = useCallback(async (id: string) => {
    Alert.alert('Remover', 'Remover esta experiencia?', [
      { text: 'Cancelar' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await profilesApi.removeExperience(id);
            await fetchProfile();
          } catch {
            Alert.alert('Erro', 'Nao foi possivel remover');
          }
        },
      },
    ]);
  }, []);

  const handleAddEducation = useCallback(async (data: any) => {
    try {
      await profilesApi.addEducation(data);
      await fetchProfile();
      setActiveSection(null);
      Alert.alert('Sucesso', 'Formacao adicionada!');
    } catch {
      Alert.alert('Erro', 'Nao foi possivel adicionar formacao');
    }
  }, []);

  const handleRemoveEducation = useCallback(async (id: string) => {
    Alert.alert('Remover', 'Remover esta formacao?', [
      { text: 'Cancelar' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await profilesApi.removeEducation(id);
            await fetchProfile();
          } catch {
            Alert.alert('Erro', 'Nao foi possivel remover');
          }
        },
      },
    ]);
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar' },
      { text: 'Sair', onPress: logout, style: 'destructive' },
    ]);
  }, []);

  return {
    profile: profilePF,
    hasProfile,
    isLoading,
    isSaving,
    activeSection,
    setActiveSection,
    handleSaveProfile,
    handleAddExperience,
    handleRemoveExperience,
    handleAddEducation,
    handleRemoveEducation,
    handleLogout,
  };
}
