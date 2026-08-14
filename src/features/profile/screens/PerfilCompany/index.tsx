import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
} from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Loading from '../../../../components/common/Loading';
import FormInput from '../../../../components/forms/FormInput';
import { AREAS_ATUACAO } from '../../../jobs/types/areas';
import usePerfilCompany from './usePerfilCompany';
import styles from './styles';

const schema = z.object({
  phone: z.string().min(8, 'Telefone obrigatório'),
  address: z.string().min(3, 'Endereço obrigatório'),
  description: z.string().optional(),
  website: z.string().optional(),
});

type PerfilCompanyForm = z.infer<typeof schema>;

export default function PerfilCompany() {
  const insets = useSafeAreaInsets();
  const {
    user,
    profile,
    isLoading,
    isSaving,
    cnpjVisible,
    setCnpjVisible,
    maskedCnpj,
    handleSaveProfile,
    handleLogout,
  } = usePerfilCompany();

  const [areaAtuacao, setAreaAtuacao] = useState(profile?.areaAtuacao ?? '');

  const { control, handleSubmit, reset } = useForm<PerfilCompanyForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: profile?.phone ?? '',
      address: profile?.address ?? '',
      description: profile?.description ?? '',
      website: profile?.website ?? '',
    },
  });

  // `profile` arrives after an async fetch, so re-sync the form once it's
  // available (and again after saving, since handleSaveProfile refetches).
  useEffect(() => {
    if (!profile) return;
    reset({
      phone: profile.phone ?? '',
      address: profile.address ?? '',
      description: profile.description ?? '',
      website: profile.website ?? '',
    });
    setAreaAtuacao(profile.areaAtuacao ?? '');
  }, [profile, reset]);

  if (isLoading) {
    return <Loading message="Carregando perfil..." />;
  }

  const initials = profile?.companyName
    ? profile.companyName
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : 'EMP';

  const planLabel: Record<string, string> = {
    BRONZE: 'Plano Bronze',
    PRATA: 'Plano Prata',
    OURO: 'Plano Ouro',
    PLATINA: 'Plano Platina',
    AVULSO: 'Plano Avulso',
  };

  const onSubmit = (data: PerfilCompanyForm) => {
    handleSaveProfile({
      phone: data.phone,
      address: data.address,
      description: data.description || undefined,
      website: data.website || undefined,
      areaAtuacao: areaAtuacao || undefined,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <Text style={styles.headerSubtitle}>Gerencie as informações da empresa</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO */}
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.companyName}>
            {profile?.companyName ?? 'Empresa'}
          </Text>
          <Text style={styles.companyEmail}>{user?.email}</Text>
          {profile?.subscriptionPlan && (
            <View style={styles.planBadge}>
              <Text style={styles.planText}>
                {planLabel[profile.subscriptionPlan] ?? profile.subscriptionPlan}
              </Text>
            </View>
          )}
        </View>

        {/* INFORMAÇÕES DA EMPRESA */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Informações da Empresa</Text>

          {/* CNPJ — bloqueado */}
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <MaterialCommunityIcons name="card-account-details-outline" size={18} color="#64748B" />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>CNPJ</Text>
              <Text style={styles.rowValue}>
                {cnpjVisible ? (profile?.cnpj ?? '—') : maskedCnpj}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.rowAction}
              onPress={() => setCnpjVisible(!cnpjVisible)}
            >
              <MaterialCommunityIcons
                name={cnpjVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>

          {/* Razão Social — bloqueada */}
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <MaterialCommunityIcons name="office-building-outline" size={18} color="#64748B" />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Razão Social</Text>
              <Text style={styles.rowValue}>{profile?.companyName ?? '—'}</Text>
            </View>
          </View>

          {/* Campos editáveis */}
          <View style={styles.formFields}>
            <FormInput name="phone" control={control} label="Telefone" keyboardType="phone-pad" />
            <FormInput name="address" control={control} label="Endereço" />

            <Text style={styles.chipLabel}>Ramo de atividade</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={[styles.chipRow, { flexWrap: 'nowrap' }]}>
                {AREAS_ATUACAO.map((area) => (
                  <Chip
                    key={area}
                    selected={areaAtuacao === area}
                    onPress={() => setAreaAtuacao(areaAtuacao === area ? '' : area)}
                    style={[styles.chip, areaAtuacao === area && styles.chipActive]}
                    textStyle={areaAtuacao === area ? styles.chipTextActive : undefined}
                    compact
                  >
                    {area}
                  </Chip>
                ))}
              </View>
            </ScrollView>

            <FormInput
              name="description"
              control={control}
              label="Descrição da empresa"
              placeholder="Conte um pouco sobre a empresa..."
              multiline
              numberOfLines={4}
            />
            <FormInput
              name="website"
              control={control}
              label="Website / rede social"
              placeholder="https://..."
              keyboardType="default"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, isSaving && { opacity: 0.6 }]}
          activeOpacity={0.8}
          onPress={handleSubmit(onSubmit)}
          disabled={isSaving}
        >
          <Text style={styles.primaryButtonText}>
            {isSaving ? 'Salvando...' : 'Salvar alterações'}
          </Text>
        </TouchableOpacity>

        {/* CONTA */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Conta</Text>

          {/* Termos de Uso */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => Linking.openURL('https://contrataja.com.br/termos')}
            activeOpacity={0.7}
          >
            <View style={styles.rowIcon}>
              <MaterialCommunityIcons name="file-document-outline" size={18} color="#64748B" />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowValue}>Termos de Uso</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
          </TouchableOpacity>

          {/* Sair */}
          <TouchableOpacity style={styles.logoutRow} onPress={handleLogout} activeOpacity={0.7}>
            <View style={styles.logoutIcon}>
              <MaterialCommunityIcons name="logout" size={18} color="#EF4444" />
            </View>
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
