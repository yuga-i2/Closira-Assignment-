import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Channel } from '../types';
import { getChannelColor, getChannelBgColor, getChannelLabel, getChannelIcon } from '../utils';
import { FONT_SIZE, RADIUS, SPACING } from '../constants';

interface Props {
  channel: Channel;
  size?: 'sm' | 'md';
}

export const ChannelBadge: React.FC<Props> = ({ channel, size = 'md' }) => {
  const color = getChannelColor(channel);
  const bgColor = getChannelBgColor(channel);
  const label = getChannelLabel(channel);
  const icon = getChannelIcon(channel) as any;
  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }, isSmall && styles.badgeSm]}>
      <Ionicons name={icon} size={isSmall ? 10 : 12} color={color} />
      <Text style={[styles.text, { color }, isSmall && styles.textSm]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  text: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  textSm: {
    fontSize: FONT_SIZE.xs,
  },
});
