import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { Text, Button, Chip, Switch } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AREAS_ATUACAO } from '../../types/areas';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../../../components/forms/FormInput';
import useCreateJobCall from './useCreateJobCall';
import { colors } from '../../../../theme/colors';
import styles from './styles';

const schema = z.object({
  // Informações básicas
  title: z.string().min(3, 'Título obrigatório'),
  category: z.string().optional(),
  description: z.string().min(10, 'Descrição obrigatória (mín. 10 caracteres)'),

  // Condições
  salary: z.string().optional(),
  salaryMax: z.string().optional(),
  contractType: z.string().optional(),
  jobWorkMode: z.string().optional(),
  hoursPerWeek: z.string().optional(),
  location: z.string().optional(),

  // Perfil do candidato
  experienceLevel: z.string().optional(),
  skills: z.string().optional(),
  minExperience: z.string().optional(),
  maxDistance: z.string().optional(),
  gender: z.string().optional(),
  minAge: z.string().optional(),
  maxAge: z.string().optional(),
  driverLicense: z.boolean().optional(),
  diploma: z.boolean().optional(),
  certificates: z.string().optional(),

  // Extras
  benefits: z.string().optional(),
  applicationDeadline: z.string().optional(),
});

type JobCallForm = z.infer<typeof schema>;

const CONTRACT_TYPES = [
  { label: 'CLT', value: 'CLT' },
  { label: 'PJ', value: 'PJ' },
  { label: 'Freelance', value: 'FREELANCE' },
  { label: 'Estágio', value: 'ESTAGIO' },
  { label: 'Temporário', value: 'TEMPORARIO' },
];

const WORK_MODES = [
  { label: 'Remoto', value: 'REMOTO' },
  { label: 'Presencial', value: 'PRESENCIAL' },
  { label: 'Híbrido', value: 'HIBRIDO' },
];

const EXPERIENCE_LEVELS = [
  { label: 'Estagiário', value: 'ESTAGIARIO' },
  { label: 'Júnior', value: 'JUNIOR' },
  { label: 'Pleno', value: 'PLENO' },
  { label: 'Sênior', value: 'SENIOR' },
  { label: 'Especialista', value: 'ESPECIALISTA' },
];

const GENDER_OPTIONS = [
  { label: 'Indiferente', value: '' },
  { label: 'Masculino', value: 'MASCULINO' },
  { label: 'Feminino', value: 'FEMININO' },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

// Collapsed by default — used for the two sections that stay hidden until tapped.
function ExpandableSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.expandableHeader}
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <MaterialCommunityIcons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
      {open && <View style={styles.expandableContent}>{children}</View>}
    </View>
  );
}

function ChipSelector({
  label,
  options,
  value,
  onChange,
}: {
  label?: string;
  options: { label: string; value: string }[];
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <View>
      {label && <Text style={styles.chipLabel}>{label}</Text>}
      <View style={styles.chipRow}>
        {options.map((opt) => (
          <Chip
            key={opt.value}
            selected={value === opt.value}
            onPress={() => onChange(value === opt.value ? '' : opt.value)}
            style={[styles.chip, value === opt.value && styles.chipActive]}
            textStyle={value === opt.value ? styles.chipTextActive : undefined}
            compact
          >
            {opt.label}
          </Chip>
        ))}
      </View>
    </View>
  );
}

export default function CreateJobCall({ navigation }: any) {
  const { handleSubmit: onSubmitJob, isLoading } = useCreateJobCall(navigation);

  const { control, handleSubmit, watch, setValue } = useForm<JobCallForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      category: '',
      description: '',
      salary: '',
      salaryMax: '',
      contractType: '',
      jobWorkMode: '',
      hoursPerWeek: '',
      location: '',
      experienceLevel: '',
      skills: '',
      minExperience: '',
      maxDistance: '',
      gender: '',
      minAge: '',
      maxAge: '',
      driverLicense: false,
      diploma: false,
      certificates: '',
      benefits: '',
      applicationDeadline: '',
    },
  });

  const contractType = watch('contractType');
  const jobWorkMode = watch('jobWorkMode');
  const experienceLevel = watch('experienceLevel');
  const category = watch('category');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* a) TÍTULO DA VAGA */}
        <View style={styles.bareField}>
          <FormInput
            name="title"
            control={control}
            label="Título da vaga"
            placeholder="Ex: Desenvolvedor Backend Sênior"
          />
        </View>

        {/* b) ÁREA DE ATUAÇÃO — expansível */}
        <ExpandableSection title="Área de atuação">
          <ChipSelector
            options={AREAS_ATUACAO.map((a) => ({ label: a, value: a }))}
            value={category}
            onChange={(v) => setValue('category', v)}
          />
        </ExpandableSection>

        {/* c) DESCRIÇÃO DA VAGA */}
        <View style={styles.bareField}>
          <FormInput
            name="description"
            control={control}
            label="Descrição da vaga"
            placeholder="Descreva as responsabilidades, rotina e diferenciais..."
            multiline
            numberOfLines={5}
          />
        </View>

        {/* d) CONDIÇÕES: SALÁRIO */}
        <SectionCard title="Condições">
          <View style={styles.row}>
            <View style={styles.flex1}>
              <FormInput name="salary" control={control} label="Salário mínimo (R$)" keyboardType="numeric" />
            </View>
            <View style={styles.flex1}>
              <FormInput name="salaryMax" control={control} label="Salário máximo (R$)" keyboardType="numeric" />
            </View>
          </View>
        </SectionCard>

        {/* e) TIPO DE CONTRATO + MODO DE TRABALHO — expansível */}
        <ExpandableSection title="Tipo de contrato e modo de trabalho">
          <Controller
            name="contractType"
            control={control}
            render={({ field }) => (
              <ChipSelector
                label="Tipo de contrato"
                options={CONTRACT_TYPES}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="jobWorkMode"
            control={control}
            render={({ field }) => (
              <ChipSelector
                label="Modo de trabalho"
                options={WORK_MODES}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </ExpandableSection>

        {/* f) CARGA HORÁRIA SEMANAL */}
        <View style={styles.bareField}>
          <FormInput
            name="hoursPerWeek"
            control={control}
            label="Carga horária semanal (horas)"
            keyboardType="numeric"
            placeholder="Ex: 40"
          />
        </View>

        {/* g) NÍVEL DE EXPERIÊNCIA */}
        <View style={styles.bareField}>
          <Controller
            name="experienceLevel"
            control={control}
            render={({ field }) => (
              <ChipSelector
                label="Nível de experiência"
                options={EXPERIENCE_LEVELS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </View>

        {/* h) REQUISITOS DO CANDIDATO */}
        <SectionCard title="Requisitos do candidato">
          <View style={styles.switchRow}>
            <Text style={styles.chipLabel}>CNH obrigatória</Text>
            <Controller
              name="driverLicense"
              control={control}
              render={({ field }) => (
                <Switch value={field.value ?? false} onValueChange={field.onChange} color={colors.accent} />
              )}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.chipLabel}>Diploma obrigatório</Text>
            <Controller
              name="diploma"
              control={control}
              render={({ field }) => (
                <Switch value={field.value ?? false} onValueChange={field.onChange} color={colors.accent} />
              )}
            />
          </View>

          <FormInput
            name="certificates"
            control={control}
            label="Certificados/cursos exigidos"
            placeholder="Ex: NR-35, NR-10..."
          />
          <Text style={styles.hint}>Separe cada certificado por vírgula</Text>

          <FormInput
            name="skills"
            control={control}
            label="Habilidades desejadas"
            placeholder="Ex: React Native, TypeScript, Node.js..."
          />
          <Text style={styles.hint}>Separe cada habilidade por vírgula</Text>

          <FormInput
            name="minExperience"
            control={control}
            label="Experiência mínima (anos)"
            keyboardType="numeric"
          />

          <FormInput
            name="maxDistance"
            control={control}
            label="Distância máxima do candidato (km)"
            keyboardType="numeric"
          />

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <ChipSelector
                label="Gênero"
                options={GENDER_OPTIONS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Text style={styles.chipLabel}>Faixa etária</Text>
          <View style={styles.row}>
            <View style={styles.flex1}>
              <FormInput name="minAge" control={control} label="Idade mínima" keyboardType="numeric" />
            </View>
            <View style={styles.flex1}>
              <FormInput name="maxAge" control={control} label="Idade máxima" keyboardType="numeric" />
            </View>
          </View>
        </SectionCard>

        {/* EXTRAS */}
        <SectionCard title="Extras">
          {(jobWorkMode === 'PRESENCIAL' || jobWorkMode === 'HIBRIDO') && (
            <FormInput
              name="location"
              control={control}
              label="Localização"
              placeholder="Ex: São Paulo, SP"
            />
          )}

          <FormInput
            name="applicationDeadline"
            control={control}
            label="Prazo para candidatura (DD/MM/AAAA)"
            placeholder="Ex: 31/12/2025"
            keyboardType="numeric"
          />

          <FormInput
            name="benefits"
            control={control}
            label="Benefícios oferecidos"
            placeholder="Ex: Vale-refeição, Plano de saúde, Home office..."
            multiline
            numberOfLines={3}
          />
          <Text style={styles.hint}>Separe cada benefício por vírgula</Text>
        </SectionCard>

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmitJob)}
          loading={isLoading}
          disabled={isLoading}
          style={styles.submitBtn}
          contentStyle={{ paddingVertical: 6 }}
        >
          Publicar vaga e buscar candidatos
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
