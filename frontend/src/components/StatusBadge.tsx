import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EnquiryStatus } from '../types';
import { getStatusColor, getStatusBgColor, getStatusLabel } from '../utils';
import { FONT_SIZE, RADIUS, SPACING } from '../constants';

interface Props {
  status: EnquiryStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const color = getStatusColor(status);
  const bgColor = getStatusBgColor(status);
  const label = getStatusLabel(status);
  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }, isSmall && styles.badgeSm]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }, isSmall && styles.textSm]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  text: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  textSm: {
    fontSize: FONT_SIZE.xs,
  },
});
