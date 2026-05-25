import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Enquiry, FollowUp } from '../types';
import { ChannelBadge } from './ChannelBadge';
import { formatDateTime, formatRelativeTime } from '../utils';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../constants';

interface Props {
  followUp: FollowUp & { enquiry: Enquiry };
  onMarkDone: (followUpId: string) => void;
}

export const FollowUpCard: React.FC<Props> = ({ followUp, onMarkDone }) => {
  const isOverdue = new Date(followUp.due_at) < new Date() && followUp.status === 'scheduled';
  const isDone = followUp.status === 'done';

  return (
    <View style={[styles.card, isDone && styles.cardDone, isOverdue && styles.cardOverdue]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.customerRow}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>
              {followUp.enquiry.customer_name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.customerName}>{followUp.enquiry.customer_name}</Text>
            <ChannelBadge channel={followUp.enquiry.channel} size="sm" />
          </View>
        </View>

        {/* Due time */}
        <View style={[styles.dueBadge, isOverdue && styles.dueBadgeOverdue]}>
          <Ionicons
            name="time"
            size={11}
            color={isOverdue ? COLORS.danger : COLORS.textSecondary}
          />
          <Text style={[styles.dueText, isOverdue && styles.dueTextOverdue]}>
            {isOverdue ? 'Overdue' : formatDateTime(followUp.due_at)}
          </Text>
        </View>
      </View>

      {/* Message preview */}
      <Text style={styles.messagePreview} numberOfLines={2}>
        {followUp.message_template}
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.scheduledText}>
          Scheduled {formatRelativeTime(followUp.scheduled_at)}
        </Text>
        {!isDone && (
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => onMarkDone(followUp.id)}
            activeOpacity={0.75}
          >
            <Ionicons name="checkmark" size={14} color={COLORS.success} />
            <Text style={styles.doneBtnText}>Mark Done</Text>
          </TouchableOpacity>
        )}
        {isDone && (
          <View style={styles.doneBadge}>
            <Ionicons name="checkmark-circle" size={13} color={COLORS.success} />
            <Text style={styles.doneBadgeText}>Done</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: SPACING.sm,
  },
  cardDone: {
    opacity: 0.55,
  },
  cardOverdue: {
    borderColor: COLORS.danger + '40',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatarWrap: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.accent,
  },
  customerName: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  dueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.cardBorder,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  dueBadgeOverdue: {
    backgroundColor: COLORS.danger + '20',
  },
  dueText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  dueTextOverdue: {
    color: COLORS.danger,
    fontWeight: '700',
  },
  messagePreview: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  scheduledText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.success + '15',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
  },
  doneBtnText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.success,
    fontWeight: '600',
  },
  doneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  doneBadgeText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.success,
    fontWeight: '600',
  },
});
