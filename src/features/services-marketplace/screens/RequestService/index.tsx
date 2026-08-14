import React from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Text, Card, Chip, Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../../../components/forms/FormInput';
import Loading from '../../../../components/common/Loading';
import useRequestService from './useRequestService';
import styles from './styles';

const serviceSchema = z.object({
  serviceType: z.string().min(1, 'Tipo de servico obrigatorio'),
  description: z.string().min(10, 'Descreva o servico (min 10 caracteres)'),
  address: z.string().min(1, 'Endereco obrigatorio'),
  lat: z.string().min(1, 'Latitude obrigatoria'),
  lng: z.string().min(1, 'Longitude obrigatoria'),
});

type ServiceForm = z.infer<typeof serviceSchema>;

export default function RequestService({ navigation }: any) {
  const {
    step,
    nearbyProviders,
    isLoading,
    handleSubmit: onSubmitService,
    handleSelectProvider,
    handleBack,
  } = useRequestService(navigation);

  const { control, handleSubmit } = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceType: '',
      description: '',
      address: '',
      lat: '',
      lng: '',
    },
  });

  const onSubmit = (data: ServiceForm) => {
    onSubmitService({
      ...data,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng),
    });
  };

  if (isLoading) {
    return <Loading message="Buscando prestadores..." />;
  }

  // Etapa 1: Formulario
  if (step === 'form') {
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text variant="titleLarge" style={styles.title}>
          Solicitar servico
        </Text>

        <FormInput
          name="serviceType"
          control={control}
          label="Tipo de servico"
          placeholder="Ex: Eletricista, Encanador..."
        />
        <FormInput
          name="description"
          control={control}
          label="Descricao do servico"
          placeholder="Descreva o que precisa..."
          multiline
        />
        <FormInput name="address" control={control} label="Endereco" />
        <FormInput name="lat" control={control} label="Latitude" keyboardType="numeric" />
        <FormInput name="lng" control={control} label="Longitude" keyboardType="numeric" />

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={{ marginTop: 16 }}
        >
          Buscar prestadores
        </Button>
      </ScrollView>
    );
  }

  // Etapa 2: Lista de prestadores
  return (
    <View style={styles.container}>
      <FlatList
        data={nearbyProviders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scroll}
        ListHeaderComponent={
          <Text variant="titleLarge" style={styles.title}>
            Prestadores proximos
          </Text>
        }
        renderItem={({ item }) => (
          <Card style={styles.providerCard} onPress={() => handleSelectProvider(item)}>
            <Card.Title
              title={item.companyName}
              subtitle={item.address}
              right={() => (
                <Text style={styles.rating}>
                  {item.rating.toFixed(1)} ({item.totalRatings})
                </Text>
              )}
            />
            <Card.Content>
              {item.distance != null && (
                <Text style={styles.distance}>
                  {item.distance.toFixed(1)} km de distancia
                </Text>
              )}
              <View style={styles.categories}>
                {item.serviceCategories.map((cat) => (
                  <Chip key={cat} compact>
                    {cat}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum prestador encontrado na sua regiao
          </Text>
        }
      />
    </View>
  );
}
