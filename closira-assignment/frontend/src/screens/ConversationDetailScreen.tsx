import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { getEnquiryById } from '../mock/enquiries';
import { ChannelBadge } from '../components/ChannelBadge';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../constants';
import { formatDateTime, formatRelativeTime } from '../utils';
import { RootStackParamList } from '../types';

type RouteType = RouteProp<RootStackParamList, 'ConversationDetail'>;

export const ConversationDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteType>();
  const { enquiryId } = route.params;
  const enquiry = getEnquiryById(enquiryId);

  if (!enquiry) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <EmptyState
          icon="alert-circle-outline"
          title="Enquiry not found"
          subtitle="This enquiry may have been removed or the ID is invalid."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Nav header */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.navCenter}>
          <Text style={styles.navTitle}>{enquiry.customer_name}</Text>
          <StatusBadge status={enquiry.status} size="sm" />
        </View>
        <ChannelBadge channel={enquiry.channel} size="sm" />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* SOP match banner */}
        {enquiry.matched_sop && (
          <View style={styles.sopBanner}>
            <Ionicons name="sparkles" size={14} color={COLORS.accent} />
            <Text style={styles.sopBannerText}>
              Matched SOP: <Text style={styles.sopBannerBold}>{enquiry.matched_sop}</Text>
            </Text>
          </View>
        )}

        {/* AI Summary */}
        {enquiry.ai_summary && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="bulb" size={15} color={COLORS.warning} />
              <Text style={styles.summaryTitle}>AI Summary</Text>
            </View>
            <Text style={styles.summaryText}>{enquiry.ai_summary}</Text>
          </View>
        )}

        {/* Escalation warning */}
        {enquiry.status === 'escalated' && enquiry.escalation_reason && (
          <View style={styles.escalationBanner}>
            <Ionicons name="warning" size={15} color={COLORS.danger} />
            <View style={{ flex: 1 }}>
              <Text style={styles.escalationTitle}>Escalated</Text>
              <Text style={styles.escalationReason}>{enquiry.escalation_reason}</Text>
            </View>
          </View>
        )}

        {/* Conversation thread */}
        <Text style={styles.sectionLabel}>CONVERSATION</Text>
        {enquiry.conversation_history.map((msg, idx) => (
          <View
            key={idx}
            style={[
              styles.messageBubble,
              msg.role === 'assistant' ? styles.bubbleAssistant : styles.bubbleCustomer,
            ]}
          >
            <Text
              style={[
                styles.bubbleRole,
                msg.role === 'assistant' ? styles.roleAssistant : styles.roleCustomer,
              ]}
            >
              {msg.role === 'assistant' ? '🤖 Closira AI' : `👤 ${enquiry.customer_name}`}
            </Text>
            <Text
              style={[
                styles.bubbleText,
                msg.role === 'assistant' ? styles.bubbleTextAssistant : styles.bubbleTextCustomer,
              ]}
            >
              {msg.content}
            </Text>
            <Text style={styles.bubbleTime}>{formatDateTime(msg.timestamp)}</Text>
          </View>
        ))}

        {/* Status Timeline */}
        <Text style={[styles.sectionLabel, { marginTop: SPACING.xl }]}>STATUS TIMELINE</Text>
        <View style={styles.timelineContainer}>
          {enquiry.status_timeline.map((entry, idx) => (
            <View key={idx} style={styles.timelineItem}>
              <View style={styles.timelineLine}>
                <View style={styles.timelineDot} />
                {idx < enquiry.status_timeline.length - 1 && (
                  <View style={styles.timelineConnector} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineEvent}>
                  {entry.event.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </Text>
                {entry.detail && (
                  <Text style={styles.timelineDetail}>{entry.detail}</Text>
                )}
                <Text style={styles.timelineTime}>
                  {formatRelativeTime(entry.timestamp)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Follow-ups */}
        {enquiry.follow_ups.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: SPACING.xl }]}>FOLLOW-UPS</Text>
            {enquiry.follow_ups.map((fu) => (
              <View key={fu.id} style={styles.followUpItem}>
                <Ionicons name="alarm" size={15} color={COLORS.warning} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.followUpTemplate}>{fu.message_template}</Text>
                  <Text style={styles.followUpMeta}>
                    Due {formatDateTime(fu.due_at)} · {fu.delay_minutes}min delay
                  </Text>
                </View>
                <View
                  style={[
                    styles.followUpStatus,
                    fu.status === 'done' && styles.followUpStatusDone,
                  ]}
                >
                  <Text
                    style={[
                      styles.followUpStatusText,
                      fu.status === 'done' && styles.followUpStatusTextDone,
                    ]}
                  >
                    {fu.status}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    gap: SPACING.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  navTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  scroll: { flex: 1 },
  content: {
    padding: SPACING.xl,
  },

  sopBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.accentDim,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.accent + '30',
  },
  sopBannerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.accent,
  },
  sopBannerBold: { fontWeight: '700' },

  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.warning + '30',
    gap: SPACING.sm,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  summaryTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.warning,
  },
  summaryText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },

  escalationBanner: {
    flexDirection: 'row',
    gap: SPACING.md,
    backgroundColor: COLORS.danger + '12',
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.danger + '30',
  },
  escalationTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.danger,
    marginBottom: 3,
  },
  escalationReason: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
  },

  sectionLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },

  messageBubble: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    gap: 5,
    maxWidth: '92%',
  },
  bubbleCustomer: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignSelf: 'flex-start',
  },
  bubbleAssistant: {
    backgroundColor: COLORS.accentDim,
    borderWidth: 1,
    borderColor: COLORS.accent + '25',
    alignSelf: 'flex-end',
  },
  bubbleRole: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    marginBottom: 3,
  },
  roleCustomer: { color: COLORS.textMuted },
  roleAssistant: { color: COLORS.accent },
  bubbleText: {
    fontSize: FONT_SIZE.base,
    lineHeight: 21,
  },
  bubbleTextCustomer: { color: COLORS.textPrimary },
  bubbleTextAssistant: { color: COLORS.textSecondary },
  bubbleTime: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 3,
    alignSelf: 'flex-end',
  },

  timelineContainer: { gap: 0 },
  timelineItem: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  timelineLine: {
    alignItems: 'center',
    width: 16,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
    marginTop: 3,
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: 2,
    minHeight: 20,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: SPACING.lg,
    gap: 2,
  },
  timelineEvent: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  timelineDetail: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  timelineTime: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },

  followUpItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  followUpTemplate: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  followUpMeta: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  followUpStatus: {
    backgroundColor: COLORS.warning + '20',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  followUpStatusDone: {
    backgroundColor: COLORS.success + '20',
  },
  followUpStatusText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.warning,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  followUpStatusTextDone: {
    color: COLORS.success,
  },
});
