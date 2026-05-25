import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../constants';

interface Props {
  label: string;
  value: number | string;
  icon: string;
  iconColor: string;
  iconBg: string;
  onPress?: () => void;
  highlight?: boolean;
}

export const StatCard: React.FC<Props> = ({
  label,
  value,
  icon,
  iconColor,
  iconBg,
  onPress,
  highlight,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, highlight && styles.cardHighlight]}
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon as any} size={20} color={iconColor} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 6,
  },
  cardHighlight: {
    borderColor: COLORS.accent + '40',
    backgroundColor: COLORS.accentDim,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  value: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
