import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { mockDashboardStats, mockActivity } from '../mock/dashboard';
import { StatCard } from '../components/StatCard';
import { ChannelBadge } from '../components/ChannelBadge';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../constants';
import { formatRelativeTime } from '../utils';
import { RootStackParamList } from '../types';
import { useOpenEscalationCount } from '../utils/store';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ACTIVITY_TYPE_CONFIG = {
  new_lead: { icon: 'person-add', color: COLORS.accent, label: 'New Lead' },
  escalation: { icon: 'warning', color: COLORS.danger, label: 'Escalated' },
  follow_up: { icon: 'alarm', color: COLORS.warning, label: 'Follow-up' },
  resolved: { icon: 'checkmark-circle', color: COLORS.success, label: 'Resolved' },
} as const;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const escalationCount = useOpenEscalationCount();
  const stats = { ...mockDashboardStats, openEscalations: escalationCount };
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'offline'>('checking');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const checkHealth = async () => {
      try {
        const response = await fetch('http://localhost:8000/health', { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Health check failed');
        }
        if (active) {
          setApiStatus('connected');
        }
      } catch {
        if (active) {
          setApiStatus('offline');
        }
      } finally {
        clearTimeout(timeoutId);
      }
    };

    void checkHealth();

    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  const apiStatusLabel = apiStatus === 'connected'
    ? 'API Connected'
    : apiStatus === 'offline'
      ? 'API Offline'
      : 'Checking API...';

  const apiStatusIcon = apiStatus === 'connected'
    ? 'checkmark-circle'
    : apiStatus === 'offline'
      ? 'alert-circle'
      : 'time';

  const apiStatusColor = apiStatus === 'connected'
    ? COLORS.success
    : apiStatus === 'offline'
      ? COLORS.warning
      : COLORS.textMuted;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero header */}
        <View style={styles.heroSection}>
          <View style={styles.heroLeft}>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.heroTitle}>Dashboard</Text>
            <Text style={styles.heroDate}>{today}</Text>
            <View style={[styles.apiStatusPill, { borderColor: apiStatusColor + '40' }]}>
              <Ionicons name={apiStatusIcon as any} size={12} color={apiStatusColor} />
              <Text style={[styles.apiStatusText, { color: apiStatusColor }]}>{apiStatusLabel}</Text>
            </View>
          </View>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>CL</Text>
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              label="Leads Today"
              value={stats.totalLeadsToday}
              icon="people"
              iconColor={COLORS.accent}
              iconBg={COLORS.accentDim}
              highlight
            />
            <StatCard
              label="Missed"
              value={stats.missedEnquiries}
              icon="notifications-off"
              iconColor={COLORS.warning}
              iconBg={COLORS.warning + '20'}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              label="Escalations"
              value={stats.openEscalations}
              icon="warning"
              iconColor={COLORS.danger}
              iconBg={COLORS.danger + '20'}
            />
            <StatCard
              label="Follow-ups Due"
              value={stats.followUpsDue}
              icon="alarm"
              iconColor={COLORS.success}
              iconBg={COLORS.success + '20'}
            />
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            {[
              { icon: 'people', label: 'All Leads', color: COLORS.accent, tab: 'Leads' },
              { icon: 'warning', label: 'Escalations', color: COLORS.danger, tab: 'Escalations' },
              { icon: 'alarm', label: 'Follow-ups', color: COLORS.warning, tab: 'FollowUps' },
            ].map((action) => (
              <TouchableOpacity
                key={action.tab}
                style={styles.actionBtn}
                onPress={() => navigation.navigate('Main' as any)}
                activeOpacity={0.75}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <Ionicons name={action.icon as any} size={22} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Activity feed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {mockActivity.map((item) => {
            const config = ACTIVITY_TYPE_CONFIG[item.type];
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.activityItem}
                onPress={() =>
                  navigation.navigate('ConversationDetail', { enquiryId: item.enquiry_id })
                }
                activeOpacity={0.75}
              >
                <View style={[styles.activityIcon, { backgroundColor: config.color + '18' }]}>
                  <Ionicons name={config.icon as any} size={16} color={config.color} />
                </View>
                <View style={styles.activityInfo}>
                  <View style={styles.activityHeader}>
                    <Text style={styles.activityName}>{item.customer_name}</Text>
                    <ChannelBadge channel={item.channel} size="sm" />
                  </View>
                  <Text style={styles.activityPreview} numberOfLines={1}>
                    {item.message_preview}
                  </Text>
                </View>
                <View style={styles.activityRight}>
                  <Text style={styles.activityTime}>
                    {formatRelativeTime(item.timestamp)}
                  </Text>
                  <View style={[styles.activityTypeDot, { backgroundColor: config.color }]} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },

  heroSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  heroLeft: { flex: 1 },
  greeting: { fontSize: FONT_SIZE.base, color: COLORS.textSecondary },
  heroTitle: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -1,
    marginTop: 2,
  },
  heroDate: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  apiStatusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    borderWidth: 1,
  },
  apiStatusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },

  statsGrid: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statsRow: { flexDirection: 'row', gap: SPACING.md },

  section: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: SPACING.md,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: { flex: 1, gap: 3 },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  activityName: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  activityPreview: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  activityRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  activityTime: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  activityTypeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
