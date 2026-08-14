import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserType } from '../../../types';
import { spacing, radius, typography } from '../../../theme/colors';

const LOGO_WIDTH = Dimensions.get('window').width * 0.55;
const LOGO_HEIGHT = Math.round(LOGO_WIDTH / 3.6);

const TYPE_CARDS = [
  {
    type: UserType.PF,
    title: 'PESSOA FÍSICA',
    description: 'Encontre vagas e serviços\nperto de você',
    icon: 'account' as const,
    color: '#F97316',  // laranja — cor principal
    colorDark: '#C2550E',
  },
  {
    type: UserType.PJ_CONTRATANTE,
    title: 'EMPRESA',
    description: 'Crie vagas e contrate\nos melhores profissionais',
    icon: 'office-building' as const,
    color: '#0F4C81',  // azul naval — complementar clássico do laranja
    colorDark: '#083660',
  },
  {
    type: UserType.PJ_PRESTADOR,
    title: 'PRESTADOR DE SERVIÇO',
    description: 'Receba chamados de serviços\nna sua área',
    icon: 'wrench' as const,
    color: '#0891B2',  // teal — split-complementar do laranja
    colorDark: '#0E7490',
  },
  {
    type: UserType.INSTITUICAO,
    title: 'INSTITUIÇÃO DE ENSINO',
    description: 'Cadastre e venda cursos\nprofissionalizantes',
    icon: 'school' as const,
    color: '#059669',  // esmeralda — equilíbrio com o laranja
    colorDark: '#047857',
  },
];

export default function UserTypeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDF1F7" />

      <View style={s.header}>
        <Image
          source={require('../../../../assets/logo.png')}
          style={s.logo}
          resizeMode="contain"
        />
        <Text style={s.question}>Como você quer usar o app?</Text>
      </View>

      <View style={s.cards}>
        {TYPE_CARDS.map((item) => (
          <TouchableOpacity
            key={item.type}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Login', { userType: item.type })}
          >
            <View style={[s.card, { backgroundColor: item.color }]}>
              {/* Decoração de curva — círculo grande de fundo */}
              <View
                style={[
                  s.decoBubble,
                  s.decoBubbleLarge,
                  { backgroundColor: item.colorDark },
                ]}
              />
              <View
                style={[
                  s.decoBubble,
                  s.decoBubbleSmall,
                  { backgroundColor: item.colorDark },
                ]}
              />

              {/* Conteúdo */}
              <View style={s.cardContent}>
                <View style={s.cardText}>
                  <Text style={s.cardTitle}>{item.title}</Text>
                  <Text style={s.cardDesc}>{item.description}</Text>
                </View>

                <View style={s.cardRight}>
                  <MaterialCommunityIcons name={item.icon} size={42} color="rgba(255,255,255,0.9)" />
                  <MaterialCommunityIcons name="chevron-right" size={22} color="rgba(255,255,255,0.7)" style={{ marginTop: 6 }} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EDF1F7',
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
    marginBottom: spacing.lg,
  },
  question: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
  },

  cards: {
    gap: spacing.md,
  },

  card: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    height: 96,
  },

  // Decorações de curva
  decoBubble: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.45,
  },
  decoBubbleLarge: {
    width: 160,
    height: 160,
    right: -30,
    top: -50,
  },
  decoBubbleSmall: {
    width: 110,
    height: 110,
    right: 60,
    bottom: -55,
  },

  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },

  cardText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 17,
  },

  cardRight: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
