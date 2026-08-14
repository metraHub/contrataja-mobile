import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Chip, Divider, Button } from 'react-native-paper';
import Loading from '../../../../components/common/Loading';
import useJobCallDetail from './useJobCallDetail';
import styles from './styles';

export default function JobCallDetail({ route, navigation }: any) {
  const { jobCallId } = route.params;
  const { jobCall, isLoading, handleAccept, handleReject } =
    useJobCallDetail(jobCallId, navigation);

  if (isLoading || !jobCall) {
    return <Loading message="Carregando vaga..." />;
  }

  const req = jobCall.requirements;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text variant="headlineSmall" style={styles.title}>
          {jobCall.title}
        </Text>
        <Text variant="titleMedium" style={styles.company}>
          {jobCall.company?.companyName}
        </Text>

        <View style={styles.section}>
          <Text variant="titleSmall" style={styles.sectionTitle}>
            Descricao
          </Text>
          <Text style={styles.description}>{jobCall.description}</Text>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text variant="titleSmall" style={styles.sectionTitle}>
            Requisitos
          </Text>

          {req.requiredSkills?.length > 0 && (
            <View style={styles.chipRow}>
              {req.requiredSkills.map((skill: string) => (
                <Chip key={skill} style={styles.chip}>
                  {skill}
                </Chip>
              ))}
            </View>
          )}

          {req.minExperience != null && (
            <Text style={styles.description}>
              Experiencia minima: {req.minExperience} ano(s)
            </Text>
          )}
          {req.maxDistance != null && (
            <Text style={styles.description}>
              Distancia maxima: {req.maxDistance} km
            </Text>
          )}
          {req.driverLicense && (
            <Text style={styles.description}>CNH obrigatoria</Text>
          )}
          {req.requiresDiploma && (
            <Text style={styles.description}>Diploma obrigatorio</Text>
          )}
          {req.requiredCertificates && req.requiredCertificates.length > 0 && (
            <View style={styles.chipRow}>
              {req.requiredCertificates.map((cert: string) => (
                <Chip key={cert} style={styles.chip}>
                  {cert}
                </Chip>
              ))}
            </View>
          )}
          {req.gender && (
            <Text style={styles.description}>Genero: {req.gender}</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={handleReject}
          style={styles.rejectBtn}
          textColor="#f44336"
        >
          Recusar
        </Button>
        <Button mode="contained" onPress={handleAccept} style={styles.acceptBtn}>
          Aceitar vaga
        </Button>
      </View>
    </View>
  );
}
