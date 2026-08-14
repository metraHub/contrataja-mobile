import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../../theme/colors';
import { feedApi, NewsArticle } from '../services/feedApi';

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonBox({ style }: { style?: object }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return <Animated.View style={[sk.box, style, { opacity }]} />;
}

function SkeletonFeatured() {
  return (
    <View style={[s.featuredCard, { overflow: 'hidden' }]}>
      <SkeletonBox style={sk.featuredImg} />
      <View style={sk.featuredBody}>
        <SkeletonBox style={sk.line} />
        <SkeletonBox style={[sk.line, { width: '90%', marginTop: 8 }]} />
        <SkeletonBox style={[sk.line, { width: '70%', marginTop: 8 }]} />
        <SkeletonBox style={[sk.line, { width: '40%', marginTop: 12, height: 10 }]} />
      </View>
    </View>
  );
}

function SkeletonCompact() {
  return (
    <View style={[s.compactCard, { overflow: 'hidden' }]}>
      <SkeletonBox style={sk.compactImg} />
      <View style={sk.compactBody}>
        <SkeletonBox style={[sk.line, { width: '50%', height: 10 }]} />
        <SkeletonBox style={[sk.line, { marginTop: 8 }]} />
        <SkeletonBox style={[sk.line, { width: '80%', marginTop: 6 }]} />
      </View>
    </View>
  );
}

function SkeletonList() {
  return (
    <View style={s.newsList}>
      <SkeletonFeatured />
      <SkeletonCompact />
      <SkeletonCompact />
      <SkeletonCompact />
    </View>
  );
}

// ─── Cards ───────────────────────────────────────────────────────────────────

interface CardProps {
  article: NewsArticle;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffH = Math.floor((now.getTime() - date.getTime()) / 3_600_000);

  if (diffH < 1) return 'Agora';
  if (diffH < 24) return `${diffH}h atrás`;

  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

/** Primeiro artigo — card grande com imagem no topo */
function FeaturedCard({ article }: CardProps) {
  return (
    <TouchableOpacity
      style={s.featuredCard}
      onPress={() => Linking.openURL(article.url)}
      activeOpacity={0.88}
    >
      {article.image ? (
        <Image source={{ uri: article.image }} style={s.featuredImage} />
      ) : (
        <View style={[s.featuredImage, s.imageFallback]}>
          <MaterialCommunityIcons name="newspaper-variant" size={48} color={colors.textMuted} />
        </View>
      )}

      {/* Badge fonte + data sobre a imagem */}
      <View style={s.featuredBadge}>
        <Text style={s.featuredBadgeText} numberOfLines={1}>
          {article.source}
        </Text>
        <View style={s.badgeDot} />
        <Text style={s.featuredBadgeText}>{formatDate(article.publishedAt)}</Text>
      </View>

      <View style={s.featuredBody}>
        <Text style={s.featuredTitle} numberOfLines={3}>
          {article.title}
        </Text>
        {article.description ? (
          <Text style={s.featuredDesc} numberOfLines={2}>
            {article.description}
          </Text>
        ) : null}

        <TouchableOpacity
          style={s.readBtn}
          onPress={() => Linking.openURL(article.url)}
          activeOpacity={0.8}
        >
          <Text style={s.readBtnText}>Ler matéria</Text>
          <MaterialCommunityIcons name="arrow-right" size={14} color={colors.accent} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

/** Demais artigos — card compacto horizontal */
function CompactCard({ article }: CardProps) {
  return (
    <TouchableOpacity
      style={s.compactCard}
      onPress={() => Linking.openURL(article.url)}
      activeOpacity={0.85}
    >
      {article.image ? (
        <Image source={{ uri: article.image }} style={s.compactThumb} />
      ) : (
        <View style={[s.compactThumb, s.imageFallback]}>
          <MaterialCommunityIcons name="newspaper" size={24} color={colors.textMuted} />
        </View>
      )}

      <View style={s.compactBody}>
        <Text style={s.compactSource}>
          {article.source}
          <Text style={s.compactDot}> · </Text>
          {formatDate(article.publishedAt)}
        </Text>
        <Text style={s.compactTitle} numberOfLines={3}>
          {article.title}
        </Text>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={18}
        color={colors.textMuted}
        style={s.chevron}
      />
    </TouchableOpacity>
  );
}

// ─── Error state ─────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={s.centered}>
      <MaterialCommunityIcons name="wifi-off" size={44} color={colors.textMuted} />
      <Text style={s.centeredTitle}>Sem conexão</Text>
      <Text style={s.centeredDesc}>{message}</Text>
      <TouchableOpacity style={s.retryBtn} onPress={onRetry} activeOpacity={0.8}>
        <MaterialCommunityIcons name="refresh" size={16} color="#FFF" />
        <Text style={s.retryBtnText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={s.centered}>
      <MaterialCommunityIcons name="newspaper-remove" size={44} color={colors.textMuted} />
      <Text style={s.centeredTitle}>Nenhuma notícia</Text>
      <Text style={s.centeredDesc}>Não encontramos notícias para o seu perfil agora.</Text>
      <TouchableOpacity style={s.retryBtn} onPress={onRetry} activeOpacity={0.8}>
        <MaterialCommunityIcons name="refresh" size={16} color="#FFF" />
        <Text style={s.retryBtnText}>Atualizar</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function FeedScreen() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await feedApi.getNews();
      setNews(data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Erro desconhecido');
      if (!isRefresh) setNews([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const featured = news[0] ?? null;
  const rest = news.slice(1);

  return (
    <View style={s.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>ContrataJá</Text>
        <View style={s.headerRight}>
          <MaterialCommunityIcons name="newspaper-variant-outline" size={22} color="#FFF" />
        </View>
      </View>

      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(true)}
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        }
      >
        {/* Section header */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Notícias do mercado</Text>
          {news.length > 0 && (
            <View style={s.badge}>
              <Text style={s.badgeText}>{news.length}</Text>
            </View>
          )}
        </View>

        {/* Estados */}
        {loading ? (
          <SkeletonList />
        ) : error ? (
          <ErrorState message={error} onRetry={() => load()} />
        ) : news.length === 0 ? (
          <EmptyState onRetry={() => load()} />
        ) : (
          <View style={s.newsList}>
            {featured && <FeaturedCard article={featured} />}
            {rest.map((article, i) => (
              <CompactCard key={i} article={article} />
            ))}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Header
  header: {
    backgroundColor: colors.primary,
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: -0.3,
  },
  headerRight: {
    opacity: 0.7,
  },

  scroll: { flex: 1 },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  badge: {
    backgroundColor: colors.accent,
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: 'center',
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#FFF' },

  // News list
  newsList: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },

  // Featured card
  featuredCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  featuredImage: {
    width: '100%',
    height: 190,
  },
  imageFallback: {
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  featuredBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  badgeDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
  },
  featuredBody: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  featuredTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 24,
  },
  featuredDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    lineHeight: 19,
  },
  readBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.md,
    alignSelf: 'flex-start',
  },
  readBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },

  // Compact card
  compactCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 1,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  compactThumb: {
    width: 90,
    height: 90,
  },
  compactBody: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  compactSource: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  compactDot: {
    color: colors.accent,
  },
  compactTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 18,
  },
  chevron: {
    marginRight: spacing.sm,
  },

  // Centered states
  centered: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl * 2,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  centeredTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.sm,
  },
  centeredDesc: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    marginTop: spacing.sm,
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
});

// ─── Skeleton styles ──────────────────────────────────────────────────────────

const sk = StyleSheet.create({
  box: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
  },
  featuredImg: {
    width: '100%',
    height: 190,
    borderRadius: 0,
  },
  featuredBody: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  line: {
    height: 14,
    width: '100%',
    borderRadius: radius.sm,
  },
  compactImg: {
    width: 90,
    height: 90,
    borderRadius: 0,
  },
  compactBody: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
});
