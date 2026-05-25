import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Enquiry } from '../types';
import { ChannelBadge } from './ChannelBadge';
import { formatRelativeTime, getUrgencyColor } from '../utils';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../constants';

interface Props {
  enquiry: Enquiry;
  onPress: () => void;
  onResolve: (id: string) => void;
}

export const EscalationCard: React.FC<Props> = ({ enquiry, onPress, onResolve }) => {
  const urgencyColor = getUrgencyColor(enquiry.urgency || 'medium');

  const handleResolve = () => {
    Alert.alert(
      'Resolve Escalation',
      `Mark escalation for ${enquiry.customer_name} as resolved?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Resolve', style: 'default', onPress: () => onResolve(enquiry.id) },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Urgency strip */}
      <View style={[styles.urgencyStrip, { backgroundColor: urgencyColor }]} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.urgencyBadge}>
            <Ionicons name="warning" size={12} color={urgencyColor} />
            <Text style={[styles.urgencyText, { color: urgencyColor }]}>
              {(enquiry.urgency || 'medium').toUpperCase()}
            </Text>
          </View>
          <Text style={styles.time}>{formatRelativeTime(enquiry.updated_at)}</Text>
        </View>

        {/* Customer info */}
        <Text style={styles.customerName}>{enquiry.customer_name}</Text>

        {/* Reason */}
        {enquiry.escalation_reason && (
          <Text style={styles.reason} numberOfLines={2}>
            {enquiry.escalation_reason}
          </Text>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <ChannelBadge channel={enquiry.channel} size="sm" />
          <TouchableOpacity style={styles.resolveBtn} onPress={handleResolve}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
            <Text style={styles.resolveText}>Resolve</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.statusEscalatedBg,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  urgencyStrip: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  urgencyText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  time: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  customerName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reason: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  resolveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.success + '15',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
  },
  resolveText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.success,
    fontWeight: '600',
  },
});
