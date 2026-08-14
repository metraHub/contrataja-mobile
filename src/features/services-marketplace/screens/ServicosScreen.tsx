import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../../theme/colors';

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

const CATEGORIAS = [
  { id: '1', name: 'Elétrica', icon: 'flash' },
  { id: '2', name: 'Hidráulica', icon: 'water-pump' },
  { id: '3', name: 'Pintura', icon: 'format-paint' },
  { id: '4', name: 'Limpeza', icon: 'broom' },
  { id: '5', name: 'Jardinagem', icon: 'flower' },
  { id: '6', name: 'Marcenaria', icon: 'hammer' },
  { id: '7', name: 'TI / Tech', icon: 'laptop' },
  { id: '8', name: 'Reforma', icon: 'home-city' },
  { id: '9', name: 'Mudança', icon: 'truck' },
  { id: '10', name: 'Aulas', icon: 'school' },
];

const MOCK_PROVIDERS = [
  {
    id: '1',
    name: 'Roberto Almeida',
    specialty: 'Eletricista Residencial e Comercial',
    city: 'São Paulo, SP',
    rating: 4.8,
    reviews: 127,
    distance: '3.2 km',
    categories: ['Elétrica', 'Reforma'],
    available: true,
  },
  {
    id: '2',
    name: 'Marcos Oliveira',
    specialty: 'Encanador e Instalações Hidráulicas',
    city: 'São Paulo, SP',
    rating: 4.6,
    reviews: 89,
    distance: '5.1 km',
    categories: ['Hidráulica'],
    available: true,
  },
  {
    id: '3',
    name: 'Patricia Santos',
    specialty: 'Pintora Profissional',
    city: 'Guarulhos, SP',
    rating: 4.9,
    reviews: 203,
    distance: '8.7 km',
    categories: ['Pintura', 'Reforma'],
    available: false,
  },
  {
    id: '4',
    name: 'Lucas Ferreira',
    specialty: 'Jardineiro e Paisagista',
    city: 'Osasco, SP',
    rating: 4.7,
    reviews: 56,
    distance: '12.4 km',
    categories: ['Jardinagem'],
    available: true,
  },
  {
    id: '5',
    name: 'Juliana Rocha',
    specialty: 'Limpeza Residencial e Comercial',
    city: 'São Paulo, SP',
    rating: 4.5,
    reviews: 312,
    distance: '2.0 km',
    categories: ['Limpeza'],
    available: true,
  },
];

export default function ServicosScreen() {
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('SP');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const filteredProviders = MOCK_PROVIDERS.filter(p => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.specialty.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      !selectedCategory || p.categories.includes(selectedCategory);
    return matchSearch && matchCategory;
  });

  return (
    <View style={s.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Serviços</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={s.searchSection}>
          <View style={s.searchRow}>
            <View style={s.searchInputWrap}>
              <MaterialCommunityIcons name="magnify" size={20} color={colors.textMuted} />
              <TextInput
                style={s.searchInput}
                placeholder="Buscar serviço ou profissional..."
                placeholderTextColor={colors.textMuted}
                value={search}
                onChangeText={setSearch}
              />
            </View>
          </View>

          {/* State selector */}
          <View style={s.locationRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={18} color={colors.accent} />
            <TouchableOpacity
              style={s.stateSelector}
              onPress={() => setShowStateDropdown(!showStateDropdown)}
            >
              <Text style={s.stateSelectorText}>{selectedState}</Text>
              <MaterialCommunityIcons
                name={showStateDropdown ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
            <Text style={s.locationHint}>Filtrar por estado</Text>
          </View>

          {showStateDropdown && (
            <View style={s.stateDropdown}>
              <FlatList
                data={ESTADOS}
                numColumns={6}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[s.stateChip, selectedState === item && s.stateChipActive]}
                    onPress={() => {
                      setSelectedState(item);
                      setShowStateDropdown(false);
                    }}
                  >
                    <Text
                      style={[s.stateChipText, selectedState === item && s.stateChipTextActive]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        {/* Categories */}
        <View style={s.categoriesSection}>
          <Text style={s.sectionTitle}>Categorias</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.categoriesScroll}>
            {CATEGORIAS.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[s.categoryCard, selectedCategory === cat.name && s.categoryCardActive]}
                onPress={() =>
                  setSelectedCategory(selectedCategory === cat.name ? null : cat.name)
                }
              >
                <View
                  style={[
                    s.categoryIcon,
                    selectedCategory === cat.name && s.categoryIconActive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={cat.icon as any}
                    size={22}
                    color={selectedCategory === cat.name ? '#FFF' : colors.primary}
                  />
                </View>
                <Text
                  style={[
                    s.categoryName,
                    selectedCategory === cat.name && s.categoryNameActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Providers */}
        <View style={s.providersSection}>
          <Text style={s.sectionTitle}>
            Profissionais {selectedCategory ? `· ${selectedCategory}` : ''}
          </Text>

          {filteredProviders.length === 0 ? (
            <View style={s.emptyContainer}>
              <MaterialCommunityIcons name="account-search" size={48} color={colors.textMuted} />
              <Text style={s.emptyText}>Nenhum profissional encontrado</Text>
            </View>
          ) : (
            filteredProviders.map(provider => (
              <TouchableOpacity key={provider.id} style={s.providerCard}>
                <View style={s.providerHeader}>
                  <View style={s.providerAvatar}>
                    <MaterialCommunityIcons name="account" size={26} color={colors.textMuted} />
                  </View>
                  <View style={s.providerInfo}>
                    <View style={s.providerNameRow}>
                      <Text style={s.providerName}>{provider.name}</Text>
                      {provider.available && (
                        <View style={s.availableBadge}>
                          <Text style={s.availableText}>Disponível</Text>
                        </View>
                      )}
                    </View>
                    <Text style={s.providerSpecialty}>{provider.specialty}</Text>
                    <Text style={s.providerLocation}>
                      {provider.city} · {provider.distance}
                    </Text>
                  </View>
                </View>

                <View style={s.providerFooter}>
                  <View style={s.ratingRow}>
                    <MaterialCommunityIcons name="star" size={16} color={colors.warning} />
                    <Text style={s.ratingText}>{provider.rating}</Text>
                    <Text style={s.reviewsText}>({provider.reviews} avaliações)</Text>
                  </View>
                  <View style={s.tagRow}>
                    {provider.categories.map(cat => (
                      <View key={cat} style={s.tag}>
                        <Text style={s.tagText}>{cat}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <TouchableOpacity style={s.contactBtn}>
                  <MaterialCommunityIcons name="message-text-outline" size={18} color="#FFF" />
                  <Text style={s.contactBtnText}>Solicitar Orçamento</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: spacing.xl,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#FFF', letterSpacing: -0.3 },

  searchSection: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  searchRow: { flexDirection: 'row', gap: spacing.sm },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 42,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, ...typography.body, color: colors.text },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  stateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
    gap: 4,
  },
  stateSelectorText: { fontSize: 14, fontWeight: '600', color: colors.accent },
  locationHint: { ...typography.bodySmall, color: colors.textMuted },
  stateDropdown: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radius.md,
  },
  stateChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    margin: 2,
    borderRadius: radius.sm,
  },
  stateChipActive: { backgroundColor: colors.accent },
  stateChipText: { fontSize: 12, fontWeight: '500', color: colors.textSecondary },
  stateChipTextActive: { color: '#FFF', fontWeight: '700' },

  categoriesSection: { paddingHorizontal: spacing.md, marginTop: spacing.sm },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
  categoriesScroll: { marginBottom: spacing.md },
  categoryCard: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 72,
  },
  categoryCardActive: {},
  categoryIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryIconActive: { backgroundColor: colors.accent },
  categoryName: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  categoryNameActive: { color: colors.accent, fontWeight: '700' },

  providersSection: { paddingHorizontal: spacing.md, marginTop: spacing.sm },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { ...typography.body, color: colors.textMuted, marginTop: spacing.md },

  providerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 1,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  providerHeader: { flexDirection: 'row' },
  providerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerInfo: { flex: 1, marginLeft: spacing.md },
  providerNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  providerName: { fontSize: 15, fontWeight: '600', color: colors.text },
  availableBadge: {
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  availableText: { fontSize: 10, fontWeight: '600', color: colors.success },
  providerSpecialty: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  providerLocation: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  providerFooter: { marginTop: spacing.md },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '700', color: colors.text },
  reviewsText: { fontSize: 12, color: colors.textMuted },
  tagRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  tag: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  tagText: { fontSize: 11, color: colors.accent, fontWeight: '600' },
  contactBtn: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  contactBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
});
