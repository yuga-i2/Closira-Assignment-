import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getFollowUps } from '../mock/enquiries';
import { FollowUpCard } from '../components/FollowUpCard';
import { EmptyState } from '../components/EmptyState';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING } from '../constants';
import { FollowUp, Enquiry } from '../types';

type FollowUpWithEnquiry = FollowUp & { enquiry: Enquiry };

export const FollowUpsScreen: React.FC = () => {
  const [followUps, setFollowUps] = useState<FollowUpWithEnquiry[]>(
    getFollowUps() as FollowUpWithEnquiry[]
  );

  const handleMarkDone = (followUpId: string) => {
    setFollowUps((prev) =>
      prev.map((fu) =>
        fu.id === followUpId ? { ...fu, status: 'done' as const } : fu
      )
    );
  };

  const pending = followUps.filter((fu) => fu.status !== 'done');
  const done = followUps.filter((fu) => fu.status === 'done');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScreenHeader
        title="Follow-ups"
        subtitle={`${pending.length} pending`}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {followUps.length === 0 ? (
          <EmptyState
            icon="alarm-outline"
            title="No follow-ups scheduled"
            subtitle="Follow-up tasks will appear here once they are created from an enquiry."
          />
        ) : (
          <>
            {pending.length > 0 && (
              <>
                <Text style={styles.groupLabel}>PENDING</Text>
                {pending.map((fu) => (
                  <FollowUpCard key={fu.id} followUp={fu} onMarkDone={handleMarkDone} />
                ))}
              </>
            )}

            {done.length > 0 && (
              <>
                <Text style={[styles.groupLabel, styles.groupLabelDone]}>COMPLETED</Text>
                {done.map((fu) => (
                  <FollowUpCard key={fu.id} followUp={fu} onMarkDone={handleMarkDone} />
                ))}
              </>
            )}
          </>
        )}
        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
  },
  groupLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.accent,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  groupLabelDone: {
    color: COLORS.textMuted,
    marginTop: SPACING.xl,
  },
});
