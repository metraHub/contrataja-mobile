import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useForm, useFieldArray, Controller, Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../../theme/colors';
import { resumeApi } from '../services/resumeApi';
import { aiApi, ResumeAnalysis } from '../../ai/services/aiApi';

// ─── Schema ──────────────────────────────────────────────────────────────────

const experienceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Cargo obrigatório'),
  company: z.string().min(1, 'Empresa obrigatória'),
  years: z.coerce.number().min(0, 'Informe os anos').max(50),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, 'Instituição obrigatória'),
  degree: z.string().min(1, 'Grau obrigatório'),
  field: z.string().min(1, 'Área obrigatória'),
  startYear: z.coerce.number().optional(),
  endYear: z.coerce.number().optional(),
});

const certificateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nome obrigatório'),
  issuer: z.string().min(1, 'Emissor obrigatório'),
  issuedAt: z.string().optional(),
  credentialUrl: z.string().optional(),
});

const schema = z.object({
  summary: z.string().optional(),
  skills: z.array(z.string()),
  experiences: z.array(experienceSchema),
  educations: z.array(educationSchema),
  certificates: z.array(certificateSchema),
});

type FormData = z.infer<typeof schema>;

// ─── Small reusable pieces ────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  onAdd,
}: {
  icon: string;
  title: string;
  onAdd: () => void;
}) {
  return (
    <View style={s.sectionHeader}>
      <View style={s.sectionLeft}>
        <MaterialCommunityIcons name={icon as any} size={18} color={colors.accent} />
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      <TouchableOpacity onPress={onAdd} style={s.addBtn} activeOpacity={0.7}>
        <MaterialCommunityIcons name="plus" size={18} color={colors.accent} />
      </TouchableOpacity>
    </View>
  );
}

function FieldLabel({ label, error }: { label: string; error?: string }) {
  return (
    <>
      <Text style={s.fieldLabel}>{label}</Text>
      {error ? <Text style={s.fieldError}>{error}</Text> : null}
    </>
  );
}

function StyledInput({
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
  error,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: any;
  error?: boolean;
}) {
  return (
    <TextInput
      style={[s.input, multiline && s.inputMultiline, error && s.inputError]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      multiline={multiline}
      keyboardType={keyboardType}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
  );
}

// ─── Skills tag input ─────────────────────────────────────────────────────────

function SkillsInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setInput('');
  };

  const remove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <View>
      <View style={s.tagInputRow}>
        <TextInput
          style={s.tagTextInput}
          value={input}
          onChangeText={setInput}
          placeholder="Ex: React Native, Elétrica..."
          placeholderTextColor={colors.textMuted}
          onSubmitEditing={add}
          returnKeyType="done"
          blurOnSubmit={false}
        />
        <TouchableOpacity style={s.tagAddBtn} onPress={add} activeOpacity={0.7}>
          <MaterialCommunityIcons name="plus" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
      {value.length > 0 && (
        <View style={s.tagList}>
          {value.map((skill, i) => (
            <View key={i} style={s.tag}>
              <Text style={s.tagText}>{skill}</Text>
              <TouchableOpacity onPress={() => remove(i)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                <MaterialCommunityIcons name="close" size={13} color={colors.accent} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Item cards ───────────────────────────────────────────────────────────────

function ExperienceItem({
  index,
  control,
  errors,
  onRemove,
}: {
  index: number;
  control: any;
  errors: any;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const exp = errors?.experiences?.[index];

  return (
    <View style={s.itemCard}>
      <TouchableOpacity style={s.itemCardHeader} onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
        <Controller
          control={control}
          name={`experiences.${index}.title`}
          render={({ field: { value } }) => (
            <Text style={s.itemCardTitle} numberOfLines={1}>
              {value || 'Nova experiência'}
            </Text>
          )}
        />
        <View style={s.itemCardActions}>
          <MaterialCommunityIcons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textMuted}
          />
          <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={s.itemCardBody}>
          <View style={s.row}>
            <View style={s.flex}>
              <FieldLabel label="Cargo *" error={exp?.title?.message} />
              <Controller
                control={control}
                name={`experiences.${index}.title`}
                render={({ field: { value, onChange } }) => (
                  <StyledInput value={value} onChangeText={onChange} placeholder="Ex: Desenvolvedor" error={!!exp?.title} />
                )}
              />
            </View>
            <View style={[s.flex, { marginLeft: spacing.sm }]}>
              <FieldLabel label="Anos de exp." error={exp?.years?.message} />
              <Controller
                control={control}
                name={`experiences.${index}.years`}
                render={({ field: { value, onChange } }) => (
                  <StyledInput value={String(value ?? '')} onChangeText={onChange} placeholder="2" keyboardType="numeric" error={!!exp?.years} />
                )}
              />
            </View>
          </View>

          <FieldLabel label="Empresa *" error={exp?.company?.message} />
          <Controller
            control={control}
            name={`experiences.${index}.company`}
            render={({ field: { value, onChange } }) => (
              <StyledInput value={value} onChangeText={onChange} placeholder="Nome da empresa" error={!!exp?.company} />
            )}
          />

          <View style={s.row}>
            <View style={s.flex}>
              <FieldLabel label="Início" />
              <Controller
                control={control}
                name={`experiences.${index}.startDate`}
                render={({ field: { value, onChange } }) => (
                  <StyledInput value={value ?? ''} onChangeText={onChange} placeholder="MM/AAAA" keyboardType="numeric" />
                )}
              />
            </View>
            <View style={[s.flex, { marginLeft: spacing.sm }]}>
              <FieldLabel label="Fim" />
              <Controller
                control={control}
                name={`experiences.${index}.endDate`}
                render={({ field: { value, onChange } }) => (
                  <StyledInput value={value ?? ''} onChangeText={onChange} placeholder="MM/AAAA ou atual" />
                )}
              />
            </View>
          </View>

          <FieldLabel label="Descrição" />
          <Controller
            control={control}
            name={`experiences.${index}.description`}
            render={({ field: { value, onChange } }) => (
              <StyledInput value={value ?? ''} onChangeText={onChange} placeholder="Descreva suas atividades..." multiline />
            )}
          />
        </View>
      )}
    </View>
  );
}

function EducationItem({
  index,
  control,
  errors,
  onRemove,
}: {
  index: number;
  control: any;
  errors: any;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const edu = errors?.educations?.[index];

  return (
    <View style={s.itemCard}>
      <TouchableOpacity style={s.itemCardHeader} onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
        <Controller
          control={control}
          name={`educations.${index}.institution`}
          render={({ field: { value } }) => (
            <Text style={s.itemCardTitle} numberOfLines={1}>
              {value || 'Nova formação'}
            </Text>
          )}
        />
        <View style={s.itemCardActions}>
          <MaterialCommunityIcons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textMuted}
          />
          <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={s.itemCardBody}>
          <FieldLabel label="Instituição *" error={edu?.institution?.message} />
          <Controller
            control={control}
            name={`educations.${index}.institution`}
            render={({ field: { value, onChange } }) => (
              <StyledInput value={value} onChangeText={onChange} placeholder="Ex: SENAI, UFRJ..." error={!!edu?.institution} />
            )}
          />

          <FieldLabel label="Grau *" error={edu?.degree?.message} />
          <Controller
            control={control}
            name={`educations.${index}.degree`}
            render={({ field: { value, onChange } }) => (
              <StyledInput value={value} onChangeText={onChange} placeholder="Ex: Bacharelado, Técnico..." error={!!edu?.degree} />
            )}
          />

          <FieldLabel label="Área *" error={edu?.field?.message} />
          <Controller
            control={control}
            name={`educations.${index}.field`}
            render={({ field: { value, onChange } }) => (
              <StyledInput value={value} onChangeText={onChange} placeholder="Ex: Engenharia Civil" error={!!edu?.field} />
            )}
          />

          <View style={s.row}>
            <View style={s.flex}>
              <FieldLabel label="Início" />
              <Controller
                control={control}
                name={`educations.${index}.startYear`}
                render={({ field: { value, onChange } }) => (
                  <StyledInput value={value ? String(value) : ''} onChangeText={onChange} placeholder="2018" keyboardType="numeric" />
                )}
              />
            </View>
            <View style={[s.flex, { marginLeft: spacing.sm }]}>
              <FieldLabel label="Conclusão" />
              <Controller
                control={control}
                name={`educations.${index}.endYear`}
                render={({ field: { value, onChange } }) => (
                  <StyledInput value={value ? String(value) : ''} onChangeText={onChange} placeholder="2022" keyboardType="numeric" />
                )}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

function CertificateItem({
  index,
  control,
  errors,
  onRemove,
}: {
  index: number;
  control: any;
  errors: any;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const cert = errors?.certificates?.[index];

  return (
    <View style={s.itemCard}>
      <TouchableOpacity style={s.itemCardHeader} onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
        <Controller
          control={control}
          name={`certificates.${index}.name`}
          render={({ field: { value } }) => (
            <Text style={s.itemCardTitle} numberOfLines={1}>
              {value || 'Novo certificado'}
            </Text>
          )}
        />
        <View style={s.itemCardActions}>
          <MaterialCommunityIcons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textMuted}
          />
          <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={s.itemCardBody}>
          <FieldLabel label="Nome do certificado *" error={cert?.name?.message} />
          <Controller
            control={control}
            name={`certificates.${index}.name`}
            render={({ field: { value, onChange } }) => (
              <StyledInput value={value} onChangeText={onChange} placeholder="Ex: AWS Cloud Practitioner" error={!!cert?.name} />
            )}
          />

          <FieldLabel label="Emissor *" error={cert?.issuer?.message} />
          <Controller
            control={control}
            name={`certificates.${index}.issuer`}
            render={({ field: { value, onChange } }) => (
              <StyledInput value={value} onChangeText={onChange} placeholder="Ex: Amazon, SENAI, Coursera..." error={!!cert?.issuer} />
            )}
          />

          <View style={s.row}>
            <View style={s.flex}>
              <FieldLabel label="Data de emissão" />
              <Controller
                control={control}
                name={`certificates.${index}.issuedAt`}
                render={({ field: { value, onChange } }) => (
                  <StyledInput value={value ?? ''} onChangeText={onChange} placeholder="AAAA-MM-DD" />
                )}
              />
            </View>
          </View>

          <FieldLabel label="URL do certificado" />
          <Controller
            control={control}
            name={`certificates.${index}.credentialUrl`}
            render={({ field: { value, onChange } }) => (
              <StyledInput value={value ?? ''} onChangeText={onChange} placeholder="https://..." keyboardType="url" />
            )}
          />
        </View>
      )}
    </View>
  );
}

// ─── Modal de resultado da IA ─────────────────────────────────────────────────

function AiResultModal({
  visible,
  analysis,
  onClose,
  onApply,
}: {
  visible: boolean;
  analysis: ResumeAnalysis | null;
  onClose: () => void;
  onApply: (text: string) => void;
}) {
  if (!analysis) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={ms.overlay}>
        <View style={ms.sheet}>
          {/* Header */}
          <View style={ms.sheetHeader}>
            <View style={ms.sheetTitleRow}>
              <MaterialCommunityIcons name="brain" size={22} color={colors.accent} />
              <Text style={ms.sheetTitle}>Análise da IA</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Pontos fortes */}
            {analysis.pontosFortres.length > 0 && (
              <View style={ms.section}>
                <View style={ms.sectionTitleRow}>
                  <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                  <Text style={[ms.sectionTitle, { color: colors.success }]}>Pontos fortes</Text>
                </View>
                {analysis.pontosFortres.map((item, i) => (
                  <View key={i} style={ms.bulletRow}>
                    <Text style={ms.bullet}>•</Text>
                    <Text style={ms.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Pontos a melhorar */}
            {analysis.pontosAMelhorar.length > 0 && (
              <View style={ms.section}>
                <View style={ms.sectionTitleRow}>
                  <MaterialCommunityIcons name="alert-circle" size={18} color={colors.warning} />
                  <Text style={[ms.sectionTitle, { color: colors.warning }]}>Pontos a melhorar</Text>
                </View>
                {analysis.pontosAMelhorar.map((item, i) => (
                  <View key={i} style={ms.bulletRow}>
                    <Text style={ms.bullet}>•</Text>
                    <Text style={ms.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Resumo melhorado */}
            {analysis.resumoMelhorado ? (
              <View style={ms.section}>
                <View style={ms.sectionTitleRow}>
                  <MaterialCommunityIcons name="lightbulb-outline" size={18} color={colors.accent} />
                  <Text style={[ms.sectionTitle, { color: colors.accent }]}>Resumo sugerido pela IA</Text>
                </View>
                <View style={ms.suggestedBox}>
                  <Text style={ms.suggestedText}>{analysis.resumoMelhorado}</Text>
                </View>
                <TouchableOpacity
                  style={ms.applyBtn}
                  onPress={() => onApply(analysis.resumoMelhorado)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons name="content-copy" size={16} color="#FFF" />
                  <Text style={ms.applyBtnText}>Usar este resumo</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function ResumeScreen({ navigation }: any) {
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<ResumeAnalysis | null>(null);
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const hasResume = useRef(false);
  const originalCertIds = useRef<string[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    // zodResolver can't infer `years` past z.coerce.number() inside a nested
    // array/object here (zod 4.3.6 / @hookform/resolvers 5.2.2 gap) — cast to
    // the schema's own real inferred type, which is correct at runtime.
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      summary: '',
      skills: [],
      experiences: [],
      educations: [],
      certificates: [],
    },
  });

  const expArray = useFieldArray({ control, name: 'experiences' });
  const eduArray = useFieldArray({ control, name: 'educations' });
  const certArray = useFieldArray({ control, name: 'certificates' });

  const load = useCallback(async () => {
    setPageLoading(true);
    try {
      const resume = await resumeApi.getMe();
      if (resume) {
        hasResume.current = true;
        originalCertIds.current = resume.certificates.map((c) => c.id);
        reset({
          summary: resume.summary ?? '',
          skills: resume.skills,
          experiences: resume.experiences.map((e) => ({
            id: e.id,
            title: e.title,
            company: e.company,
            years: e.years,
            description: e.description ?? '',
            startDate: e.startDate ?? '',
            endDate: e.endDate ?? '',
          })),
          educations: resume.educations.map((e) => ({
            id: e.id,
            institution: e.institution,
            degree: e.degree,
            field: e.field,
            startYear: e.startYear ?? undefined,
            endYear: e.endYear ?? undefined,
          })),
          certificates: resume.certificates.map((c) => ({
            id: c.id,
            name: c.name,
            issuer: c.issuer,
            issuedAt: c.issuedAt ?? '',
            credentialUrl: c.credentialUrl ?? '',
          })),
        });
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar o currículo.');
    } finally {
      setPageLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      // 1. Garante que o currículo existe (cria se necessário)
      if (!hasResume.current) {
        await resumeApi.create({ summary: data.summary, skills: data.skills });
        hasResume.current = true;
      } else {
        await resumeApi.update({ summary: data.summary, skills: data.skills });
      }

      // 2. Experiências — cria novas, remove as que foram deletadas do form
      const currentExpIds = data.experiences.filter((e) => e.id).map((e) => e.id!);
      const originalExpIds = (await resumeApi.getMe())?.experiences.map((e) => e.id) ?? [];

      const removedExpIds = originalExpIds.filter((id) => !currentExpIds.includes(id));
      await Promise.all(removedExpIds.map((id) => resumeApi.removeExperience(id)));

      await Promise.all(
        data.experiences
          .filter((e) => !e.id)
          .map((e) =>
            resumeApi.addExperience({
              title: e.title,
              company: e.company,
              years: e.years,
              description: e.description || undefined,
              startDate: e.startDate || undefined,
              endDate: e.endDate || undefined,
            }),
          ),
      );

      // 3. Formações — mesma lógica
      const currentEduIds = data.educations.filter((e) => e.id).map((e) => e.id!);
      const originalEduIds = (await resumeApi.getMe())?.educations.map((e) => e.id) ?? [];

      const removedEduIds = originalEduIds.filter((id) => !currentEduIds.includes(id));
      await Promise.all(removedEduIds.map((id) => resumeApi.removeEducation(id)));

      await Promise.all(
        data.educations
          .filter((e) => !e.id)
          .map((e) =>
            resumeApi.addEducation({
              institution: e.institution,
              degree: e.degree,
              field: e.field,
              startYear: e.startYear,
              endYear: e.endYear,
            }),
          ),
      );

      // 4. Certificados
      const currentCertIds = data.certificates.filter((c) => c.id).map((c) => c.id!);
      const removedCertIds = originalCertIds.current.filter((id) => !currentCertIds.includes(id));
      await Promise.all(removedCertIds.map((id) => resumeApi.removeCertificate(id)));

      await Promise.all(
        data.certificates
          .filter((c) => !c.id)
          .map((c) =>
            resumeApi.addCertificate({
              name: c.name,
              issuer: c.issuer,
              issuedAt: c.issuedAt || undefined,
              credentialUrl: c.credentialUrl || undefined,
            }),
          ),
      );

      // Recarrega para atualizar IDs
      await load();
      Alert.alert('Sucesso', 'Currículo salvo com sucesso!');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Erro ao salvar';
      Alert.alert('Erro', msg);
    } finally {
      setSaving(false);
    }
  };

  const analyzeWithAi = async () => {
    const summary = getValues('summary') ?? '';
    if (!summary.trim() || summary.trim().length < 20) {
      Alert.alert('Resumo muito curto', 'Escreva pelo menos 20 caracteres no resumo profissional antes de analisar.');
      return;
    }
    setAnalyzing(true);
    try {
      const result = await aiApi.analyzeResume(summary.trim());
      setAiResult(result);
      setAiModalVisible(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Não foi possível conectar à IA. Tente novamente.';
      Alert.alert('Erro na análise', msg);
    } finally {
      setAnalyzing(false);
    }
  };

  if (pageLoading) {
    return (
      <View style={s.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={s.loadingText}>Carregando currículo...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Resumo Profissional ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionLeft}>
              <MaterialCommunityIcons name="text-account" size={18} color={colors.accent} />
              <Text style={s.sectionTitle}>Resumo profissional</Text>
            </View>
          </View>
          <Controller
            control={control}
            name="summary"
            render={({ field: { value, onChange } }) => (
              <StyledInput
                value={value ?? ''}
                onChangeText={onChange}
                placeholder="Descreva seu perfil, experiências principais e objetivos profissionais..."
                multiline
              />
            )}
          />
          <TouchableOpacity
            style={s.aiBtn}
            onPress={analyzeWithAi}
            activeOpacity={0.8}
            disabled={analyzing}
          >
            {analyzing ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <MaterialCommunityIcons name="brain" size={17} color={colors.accent} />
            )}
            <Text style={s.aiBtnText}>
              {analyzing ? 'Analisando...' : 'Analisar com IA'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Habilidades ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionLeft}>
              <MaterialCommunityIcons name="star-outline" size={18} color={colors.accent} />
              <Text style={s.sectionTitle}>Habilidades</Text>
            </View>
          </View>
          <Controller
            control={control}
            name="skills"
            render={({ field: { value, onChange } }) => (
              <SkillsInput value={value} onChange={onChange} />
            )}
          />
        </View>

        {/* ── Experiências ── */}
        <View style={s.section}>
          <SectionHeader
            icon="briefcase-outline"
            title="Experiências"
            onAdd={() =>
              expArray.append({ title: '', company: '', years: 0, description: '', startDate: '', endDate: '' })
            }
          />
          {expArray.fields.length === 0 ? (
            <Text style={s.emptyHint}>Toque em + para adicionar uma experiência</Text>
          ) : (
            expArray.fields.map((field, index) => (
              <ExperienceItem
                key={field.id}
                index={index}
                control={control}
                errors={errors}
                onRemove={() => expArray.remove(index)}
              />
            ))
          )}
        </View>

        {/* ── Formação ── */}
        <View style={s.section}>
          <SectionHeader
            icon="school-outline"
            title="Formação acadêmica"
            onAdd={() =>
              eduArray.append({ institution: '', degree: '', field: '', startYear: undefined, endYear: undefined })
            }
          />
          {eduArray.fields.length === 0 ? (
            <Text style={s.emptyHint}>Toque em + para adicionar uma formação</Text>
          ) : (
            eduArray.fields.map((field, index) => (
              <EducationItem
                key={field.id}
                index={index}
                control={control}
                errors={errors}
                onRemove={() => eduArray.remove(index)}
              />
            ))
          )}
        </View>

        {/* ── Certificados ── */}
        <View style={s.section}>
          <SectionHeader
            icon="certificate-outline"
            title="Certificados"
            onAdd={() =>
              certArray.append({ name: '', issuer: '', issuedAt: '', credentialUrl: '' })
            }
          />
          {certArray.fields.length === 0 ? (
            <Text style={s.emptyHint}>Toque em + para adicionar um certificado</Text>
          ) : (
            certArray.fields.map((field, index) => (
              <CertificateItem
                key={field.id}
                index={index}
                control={control}
                errors={errors}
                onRemove={() => certArray.remove(index)}
              />
            ))
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Save button ── */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.saveBtn, saving && s.saveBtnDisabled]}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.85}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <MaterialCommunityIcons name="content-save-outline" size={20} color="#FFF" />
              <Text style={s.saveBtnText}>Salvar currículo</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Modal resultado da IA ── */}
      <AiResultModal
        visible={aiModalVisible}
        analysis={aiResult}
        onClose={() => setAiModalVisible(false)}
        onApply={(text) => {
          setValue('summary', text, { shouldDirty: true });
          setAiModalVisible(false);
          Alert.alert('Resumo aplicado!', 'O texto foi copiado para o campo de resumo. Revise antes de salvar.');
        }}
      />
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  loadingText: { ...typography.bodySmall, color: colors.textMuted },

  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingTop: spacing.xl },

  // Section
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 1,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    backgroundColor: colors.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyHint: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },

  // Field
  fieldLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: 4,
    marginTop: spacing.sm,
  },
  fieldError: {
    fontSize: 11,
    color: colors.error,
    marginBottom: 2,
  },

  // Inputs
  input: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 14,
    color: colors.text,
    minHeight: 44,
  },
  inputMultiline: {
    minHeight: 90,
    paddingTop: spacing.md,
  },
  inputError: {
    borderColor: colors.error,
  },

  // Layout helpers
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex: { flex: 1 },

  // Skills tags
  tagInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  tagTextInput: {
    flex: 1,
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 14,
    color: colors.text,
    minHeight: 44,
  },
  tagAddBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accentDark,
  },

  // Item cards (experiences, educations, certificates)
  itemCard: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  itemCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surfaceVariant,
  },
  itemCardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  itemCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  itemCardBody: {
    padding: spacing.md,
    gap: 2,
  },

  // Footer save button
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 8,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Botão Analisar com IA
  aiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  aiBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
});

// ─── Estilos do Modal IA ──────────────────────────────────────────────────────

const ms = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    maxHeight: '85%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  bulletRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    paddingRight: spacing.sm,
  },
  bullet: {
    fontSize: 16,
    color: colors.textMuted,
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  suggestedBox: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    marginBottom: spacing.md,
  },
  suggestedText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  applyBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
