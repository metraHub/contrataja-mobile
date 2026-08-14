import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Switch } from 'react-native-paper';
import { AREAS_ATUACAO } from '../../../jobs/types/areas';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FormInput from '../../../../components/forms/FormInput';
import Loading from '../../../../components/common/Loading';
import useProfilePF from './useProfilePF';
import styles from './styles';
import { colors } from '../../../../theme/colors';

const profileSchema = z.object({
  fullName: z.string().min(3, 'Nome obrigatorio'),
  cpf: z.string().min(11, 'CPF invalido'),
  phone: z.string().min(10, 'Telefone invalido'),
  birthDate: z.string().min(1, 'Data de nascimento obrigatoria'),
  city: z.string().optional(),
  address: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  qualificationsSummary: z.string().optional(),
  skills: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const DISPOSITIONS = [
  { key: 'PRESENCIAL', label: 'Presencial' },
  { key: 'REMOTO', label: 'Remoto' },
  { key: 'AMBOS', label: 'Ambos' },
];

export default function ProfilePF() {
  const {
    profile,
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
  } = useProfilePF();

  const [workDisposition, setWorkDisposition] = useState(
    profile?.workDisposition ?? 'PRESENCIAL'
  );
  const [disponivel, setDisponivel] = useState(profile?.disponivel ?? false);
  const [areaAtuacao, setAreaAtuacao] = useState(profile?.areaAtuacao ?? '');

  // Experience form state
  const [expTitle, setExpTitle] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('');
  const [expYears, setExpYears] = useState('');
  const [expAchievements, setExpAchievements] = useState('');

  // Education form state
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduDegree, setEduDegree] = useState('');
  const [eduField, setEduField] = useState('');
  const [eduStartYear, setEduStartYear] = useState('');
  const [eduEndYear, setEduEndYear] = useState('');

  const { control, handleSubmit } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile?.fullName ?? '',
      cpf: profile?.cpf ?? '',
      phone: profile?.phone ?? '',
      birthDate: profile?.birthDate?.split('T')[0] ?? '',
      city: profile?.city ?? '',
      address: profile?.address ?? '',
      lat: profile?.lat ? profile.lat.toString() : '0',
      lng: profile?.lng ? profile.lng.toString() : '0',
      qualificationsSummary: profile?.qualificationsSummary ?? '',
      skills: profile?.skills?.join(', ') ?? '',
    },
  });

  if (isLoading) {
    return <Loading message="Carregando perfil..." />;
  }

  const onSubmit = (data: ProfileForm) => {
    const skillsArray = data.skills
      ? data.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    handleSaveProfile({
      fullName: data.fullName,
      cpf: data.cpf,
      phone: data.phone,
      birthDate: data.birthDate,
      city: data.city || undefined,
      address: data.address || 'Não informado',
      lat: parseFloat(data.lat || '0') || 0,
      lng: parseFloat(data.lng || '0') || 0,
      qualificationsSummary: data.qualificationsSummary || undefined,
      workDisposition,
      skills: skillsArray,
      gender: 'OUTRO',
      disponivel,
      areaAtuacao: areaAtuacao || undefined,
    });
  };

  const submitExperience = () => {
    if (!expTitle.trim() || !expCompany.trim()) return;
    handleAddExperience({
      title: expTitle,
      company: expCompany,
      years: parseInt(expYears) || 0,
      startDate: expStartDate || undefined,
      endDate: expEndDate || undefined,
      achievements: expAchievements || undefined,
    });
    setExpTitle('');
    setExpCompany('');
    setExpStartDate('');
    setExpEndDate('');
    setExpYears('');
    setExpAchievements('');
  };

  const submitEducation = () => {
    if (!eduInstitution.trim() || !eduDegree.trim() || !eduField.trim()) return;
    handleAddEducation({
      institution: eduInstitution,
      degree: eduDegree,
      field: eduField,
      startYear: parseInt(eduStartYear) || undefined,
      endYear: parseInt(eduEndYear) || undefined,
    });
    setEduInstitution('');
    setEduDegree('');
    setEduField('');
    setEduStartYear('');
    setEduEndYear('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.pageTitle}>
        {hasProfile ? 'Meu Curriculo' : 'Criar Curriculo'}
      </Text>

      {/* ========== DADOS PESSOAIS ========== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Dados Pessoais</Text>
        </View>
        <FormInput name="fullName" control={control} label="Nome completo" />
        <FormInput name="cpf" control={control} label="CPF" keyboardType="numeric" />
        <FormInput name="phone" control={control} label="Telefone" keyboardType="phone-pad" />
        <FormInput name="birthDate" control={control} label="Data de nascimento" placeholder="AAAA-MM-DD" />
        <FormInput name="city" control={control} label="Cidade" />
        <FormInput name="address" control={control} label="Endereco completo" />
        <FormInput name="lat" control={control} label="Latitude" keyboardType="numeric" />
        <FormInput name="lng" control={control} label="Longitude" keyboardType="numeric" />
      </View>

      {/* ========== DISPOSICAO DE TRABALHO ========== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Disposicao de Trabalho</Text>
        </View>
        <View style={styles.dispositionRow}>
          {DISPOSITIONS.map((d) => (
            <TouchableOpacity
              key={d.key}
              style={[
                styles.dispositionChip,
                workDisposition === d.key && styles.dispositionChipActive,
              ]}
              onPress={() => setWorkDisposition(d.key)}
            >
              <Text
                style={[
                  styles.dispositionText,
                  workDisposition === d.key && styles.dispositionTextActive,
                ]}
              >
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ========== DISPONIBILIDADE ========== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Disponibilidade</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.text, fontSize: 15 }}>Disponivel para contratacao</Text>
          <Switch
            value={disponivel}
            onValueChange={setDisponivel}
            color={colors.accent}
          />
        </View>
      </View>

      {/* ========== AREA DE ATUACAO ========== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Area de Atuacao</Text>
        </View>
        <View style={styles.dispositionRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {AREAS_ATUACAO.map((area) => (
                <TouchableOpacity
                  key={area}
                  style={[
                    styles.dispositionChip,
                    areaAtuacao === area && styles.dispositionChipActive,
                  ]}
                  onPress={() => setAreaAtuacao(areaAtuacao === area ? '' : area)}
                >
                  <Text
                    style={[
                      styles.dispositionText,
                      areaAtuacao === area && styles.dispositionTextActive,
                    ]}
                  >
                    {area}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* ========== RESUMO DE QUALIFICACOES ========== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Resumo de Qualificacoes</Text>
        </View>
        <FormInput
          name="qualificationsSummary"
          control={control}
          label="Descreva suas principais qualificacoes"
          multiline
          numberOfLines={4}
        />
      </View>

      {/* ========== EXPERIENCIA PROFISSIONAL ========== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Experiencia Profissional</Text>
          {hasProfile && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setActiveSection(activeSection === 'exp' ? null : 'exp')}
            >
              <MaterialCommunityIcons name="plus" size={14} color={colors.accent} />
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
          )}
        </View>

        {activeSection === 'exp' && (
          <View style={styles.inlineForm}>
            <TextInput
              label="Cargo"
              value={expTitle}
              onChangeText={setExpTitle}
              mode="outlined"
              style={{ backgroundColor: colors.surface, marginBottom: 6 }}
              outlineColor={colors.border}
              activeOutlineColor={colors.accent}
            />
            <TextInput
              label="Empresa"
              value={expCompany}
              onChangeText={setExpCompany}
              mode="outlined"
              style={{ backgroundColor: colors.surface, marginBottom: 6 }}
              outlineColor={colors.border}
              activeOutlineColor={colors.accent}
            />
            <View style={styles.inlineFormRow}>
              <View style={{ flex: 1 }}>
                <TextInput
                  label="Inicio"
                  value={expStartDate}
                  onChangeText={setExpStartDate}
                  mode="outlined"
                  placeholder="MM/AAAA"
                  style={{ backgroundColor: colors.surface }}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.accent}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  label="Fim"
                  value={expEndDate}
                  onChangeText={setExpEndDate}
                  mode="outlined"
                  placeholder="MM/AAAA ou Atual"
                  style={{ backgroundColor: colors.surface }}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.accent}
                />
              </View>
            </View>
            <TextInput
              label="Anos de experiencia"
              value={expYears}
              onChangeText={setExpYears}
              mode="outlined"
              keyboardType="numeric"
              style={{ backgroundColor: colors.surface, marginTop: 6 }}
              outlineColor={colors.border}
              activeOutlineColor={colors.accent}
            />
            <TextInput
              label="Realizacoes"
              value={expAchievements}
              onChangeText={setExpAchievements}
              mode="outlined"
              multiline
              numberOfLines={3}
              placeholder="Principais conquistas e realizacoes..."
              style={{ backgroundColor: colors.surface, marginTop: 6 }}
              outlineColor={colors.border}
              activeOutlineColor={colors.accent}
            />
            <View style={styles.inlineFormActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setActiveSection(null)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={submitExperience}>
                <Text style={styles.saveBtnText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {profile?.experiences && profile.experiences.length > 0
          ? profile.experiences.map((exp: any) => (
              <View key={exp.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{exp.title}</Text>
                    <Text style={styles.itemSubtitle}>{exp.company}</Text>
                    <Text style={styles.itemMeta}>
                      {exp.startDate && exp.endDate
                        ? `${exp.startDate} - ${exp.endDate}`
                        : `${exp.years} ano(s)`}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleRemoveExperience(exp.id)}
                  >
                    <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
                {exp.achievements && (
                  <Text style={styles.itemDesc}>{exp.achievements}</Text>
                )}
              </View>
            ))
          : !activeSection && (
              <View style={styles.itemCard}>
                <Text style={{ color: colors.textMuted, textAlign: 'center', fontSize: 13 }}>
                  Nenhuma experiencia cadastrada
                </Text>
              </View>
            )}
      </View>

      {/* ========== FORMACAO ACADEMICA ========== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Formacao Academica</Text>
          {hasProfile && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setActiveSection(activeSection === 'edu' ? null : 'edu')}
            >
              <MaterialCommunityIcons name="plus" size={14} color={colors.accent} />
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
          )}
        </View>

        {activeSection === 'edu' && (
          <View style={styles.inlineForm}>
            <TextInput
              label="Instituicao"
              value={eduInstitution}
              onChangeText={setEduInstitution}
              mode="outlined"
              style={{ backgroundColor: colors.surface, marginBottom: 6 }}
              outlineColor={colors.border}
              activeOutlineColor={colors.accent}
            />
            <TextInput
              label="Grau (Ex: Graduacao, Tecnologo, MBA)"
              value={eduDegree}
              onChangeText={setEduDegree}
              mode="outlined"
              style={{ backgroundColor: colors.surface, marginBottom: 6 }}
              outlineColor={colors.border}
              activeOutlineColor={colors.accent}
            />
            <TextInput
              label="Area (Ex: Engenharia Civil)"
              value={eduField}
              onChangeText={setEduField}
              mode="outlined"
              style={{ backgroundColor: colors.surface, marginBottom: 6 }}
              outlineColor={colors.border}
              activeOutlineColor={colors.accent}
            />
            <View style={styles.inlineFormRow}>
              <View style={{ flex: 1 }}>
                <TextInput
                  label="Ano inicio"
                  value={eduStartYear}
                  onChangeText={setEduStartYear}
                  mode="outlined"
                  keyboardType="numeric"
                  style={{ backgroundColor: colors.surface }}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.accent}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  label="Ano conclusao"
                  value={eduEndYear}
                  onChangeText={setEduEndYear}
                  mode="outlined"
                  keyboardType="numeric"
                  placeholder="ou em andamento"
                  style={{ backgroundColor: colors.surface }}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.accent}
                />
              </View>
            </View>
            <View style={styles.inlineFormActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setActiveSection(null)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={submitEducation}>
                <Text style={styles.saveBtnText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {profile?.educations && profile.educations.length > 0
          ? profile.educations.map((edu: any) => (
              <View key={edu.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{edu.degree} - {edu.field}</Text>
                    <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                    <Text style={styles.itemMeta}>
                      {edu.startYear ? `${edu.startYear}` : ''}
                      {edu.endYear ? ` - ${edu.endYear}` : edu.startYear ? ' - Atual' : ''}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleRemoveEducation(edu.id)}
                  >
                    <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          : !activeSection && (
              <View style={styles.itemCard}>
                <Text style={{ color: colors.textMuted, textAlign: 'center', fontSize: 13 }}>
                  Nenhuma formacao cadastrada
                </Text>
              </View>
            )}
      </View>

      {/* ========== HABILIDADES ========== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Habilidades e Competencias</Text>
        </View>
        {profile?.skills && profile.skills.length > 0 ? (
          <View style={styles.skillsRow}>
            {profile.skills.map((skill: string) => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <FormInput
          name="skills"
          control={control}
          label="Habilidades"
          placeholder="Separadas por virgula: Soldagem, NR10, Excel..."
        />
      </View>

      {/* ========== BOTOES ========== */}
      <TouchableOpacity
        style={[styles.primaryButton, isSaving && { opacity: 0.6 }]}
        activeOpacity={0.8}
        onPress={handleSubmit(onSubmit)}
        disabled={isSaving}
      >
        <Text style={styles.primaryButtonText}>
          {isSaving ? 'Salvando...' : hasProfile ? 'Salvar alteracoes' : 'Criar curriculo'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
