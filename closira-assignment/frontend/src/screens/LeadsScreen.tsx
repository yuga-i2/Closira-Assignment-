import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { getLeads } from '../mock/enquiries';
import { LeadCard } from '../components/LeadCard';
import { EmptyState } from '../components/EmptyState';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../constants';
import { EnquiryStatus, RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FILTER_OPTIONS: { label: string; value: EnquiryStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Processing', value: 'processing' },
  { label: 'Qualified', value: 'qualified' },
  { label: 'Escalated', value: 'escalated' },
];

export const LeadsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [filter, setFilter] = useState<EnquiryStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const allLeads = getLeads();
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filtered = allLeads.filter((e) => {
    const matchesFilter = filter === 'all' || e.status === filter;
    const matchesSearch = normalizedSearchQuery.length === 0
      || e.customer_name.toLowerCase().includes(normalizedSearchQuery);

    return matchesFilter && matchesSearch;
  });

  const hasSearchResults = normalizedSearchQuery.length > 0 && filtered.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScreenHeader
        title="Leads"
        subtitle={`${filtered.length} enquiries`}
      />

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search leads by name"
        placeholderTextColor={COLORS.textMuted}
        style={styles.searchInput}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTER_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.filterTab, filter === opt.value && styles.filterTabActive]}
            onPress={() => setFilter(opt.value)}
          >
            <Text style={[styles.filterText, filter === opt.value && styles.filterTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon="people-outline"
            title={hasSearchResults ? `No results for ${searchQuery.trim()}` : 'No leads found'}
            subtitle={
              hasSearchResults
                ? 'Try a different name or clear the search.'
                : 'No enquiries match the selected filter. Try changing the filter or wait for new leads.'
            }
          />
        ) : (
          filtered.map((enquiry) => (
            <LeadCard
              key={enquiry.id}
              enquiry={enquiry}
              onPress={() =>
                navigation.navigate('ConversationDetail', { enquiryId: enquiry.id })
              }
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
  filterScroll: {
    flexGrow: 0,
    marginBottom: SPACING.md,
  },
  searchInput: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    padding: 12,
    color: '#F1F5F9',
    fontSize: FONT_SIZE.base,
  },
  filterContent: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  filterTab: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  filterTabActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  filterText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: '#fff',
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
  },
});
