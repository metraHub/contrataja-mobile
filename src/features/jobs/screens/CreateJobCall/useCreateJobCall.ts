import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useJobCallsStore } from '../../store/jobCallsStore';

export default function useCreateJobCall(navigation: any) {
  const { createJobCall, isLoading } = useJobCallsStore();

  const handleSubmit = useCallback(async (data: any) => {
    try {
      // Converter DD/MM/AAAA para ISO (YYYY-MM-DD)
      let applicationDeadline: string | undefined;
      if (data.applicationDeadline) {
        const cleaned = data.applicationDeadline.replace(/\D/g, '');
        if (cleaned.length === 8) {
          const day = cleaned.slice(0, 2);
          const month = cleaned.slice(2, 4);
          const year = cleaned.slice(4, 8);
          applicationDeadline = `${year}-${month}-${day}`;
        }
      }

      const result = await createJobCall({
        title: data.title,
        description: data.description,
        category: data.category || undefined,
        salary: data.salary || undefined,
        salaryMax: data.salaryMax || undefined,
        contractType: data.contractType || undefined,
        jobWorkMode: data.jobWorkMode || undefined,
        hoursPerWeek: data.hoursPerWeek ? parseInt(data.hoursPerWeek) : undefined,
        benefits: data.benefits
          ? data.benefits.split(',').map((b: string) => b.trim()).filter(Boolean)
          : [],
        location: data.location || undefined,
        experienceLevel: data.experienceLevel || undefined,
        applicationDeadline,
        requirements: {
          requiredSkills: data.skills
            ? data.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
            : [],
          minExperience: data.minExperience ? parseInt(data.minExperience) : undefined,
          maxDistance: data.maxDistance ? parseInt(data.maxDistance) : undefined,
          driverLicense: data.driverLicense === true,
          gender: data.gender || undefined,
          minAge: data.minAge ? parseInt(data.minAge) : undefined,
          maxAge: data.maxAge ? parseInt(data.maxAge) : undefined,
          requiresDiploma: data.diploma === true,
          requiredCertificates: data.certificates
            ? data.certificates.split(',').map((c: string) => c.trim()).filter(Boolean)
            : [],
        },
      });
      Alert.alert(
        'Vaga publicada!',
        `${result.matchesCount} candidato(s) encontrado(s) pelo matching.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Não foi possível publicar a vaga';
      Alert.alert('Erro', Array.isArray(msg) ? msg.join('\n') : msg);
    }
  }, []);

  return { handleSubmit, isLoading };
}
