import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Enquiry } from '../types';
import { ChannelBadge } from './ChannelBadge';
import { StatusBadge } from './StatusBadge';
import { formatRelativeTime } from '../utils';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../constants';

interface Props {
  enquiry: Enquiry;
  onPress: () => void;
}

export const LeadCard: React.FC<Props> = ({ enquiry, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      {/* Header row */}
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>
            {enquiry.customer_name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.customerName}>{enquiry.customer_name}</Text>
          <Text style={styles.time}>{formatRelativeTime(enquiry.created_at)}</Text>
        </View>
        <StatusBadge status={enquiry.status} size="sm" />
      </View>

      {/* Message preview */}
      <Text style={styles.message} numberOfLines={2}>
        {enquiry.message}
      </Text>

      {/* Footer row */}
      <View style={styles.footer}>
        <ChannelBadge channel={enquiry.channel} size="sm" />
        {enquiry.matched_sop && (
          <View style={styles.sopTag}>
            <Text style={styles.sopText}>{enquiry.matched_sop}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.accent,
  },
  headerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  time: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  message: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  sopTag: {
    backgroundColor: COLORS.accent + '15',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  sopText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.accent,
    fontWeight: '500',
  },
});
