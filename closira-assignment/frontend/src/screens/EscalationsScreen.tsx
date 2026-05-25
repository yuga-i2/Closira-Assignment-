import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { getEscalations } from '../mock/enquiries';
import { EscalationCard } from '../components/EscalationCard';
import { EmptyState } from '../components/EmptyState';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../constants';
import { Enquiry, RootStackParamList } from '../types';
import { decrementOpenEscalationCount } from '../utils/store';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const EscalationsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [escalations, setEscalations] = useState<Enquiry[]>(getEscalations());

  const handleResolve = (id: string) => {
    setEscalations((prev) => {
      const next = prev.filter((e) => e.id !== id);
      if (next.length !== prev.length) {
        decrementOpenEscalationCount();
      }
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScreenHeader
        title="Escalations"
        subtitle={`${escalations.length} active`}
      />

      {escalations.length > 0 && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertText}>
            ⚠️ {escalations.length} escalation{escalations.length !== 1 ? 's' : ''} need your attention
          </Text>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {escalations.length === 0 ? (
          <EmptyState
            icon="shield-checkmark-outline"
            title="All clear!"
            subtitle="No active escalations. Your team is handling all enquiries smoothly."
          />
        ) : (
          escalations.map((enquiry) => (
            <EscalationCard
              key={enquiry.id}
              enquiry={enquiry}
              onPress={() =>
                navigation.navigate('ConversationDetail', { enquiryId: enquiry.id })
              }
              onResolve={handleResolve}
            />
          ))
        )}
        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  alertBanner: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.danger + '18',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.danger + '30',
  },
  alertText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.danger,
    fontWeight: '600',
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
  },
});
