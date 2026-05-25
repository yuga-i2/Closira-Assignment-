import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from '../screens/HomeScreen';
import { LeadsScreen } from '../screens/LeadsScreen';
import { EscalationsScreen } from '../screens/EscalationsScreen';
import { FollowUpsScreen } from '../screens/FollowUpsScreen';
import { ConversationDetailScreen } from '../screens/ConversationDetailScreen';
import { COLORS, FONT_SIZE } from '../constants';
import { RootStackParamList, MainTabParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIconName =
  | 'home' | 'home-outline'
  | 'people' | 'people-outline'
  | 'warning' | 'warning-outline'
  | 'alarm' | 'alarm-outline';

const tabIconMap: Record<
  keyof MainTabParamList,
  { active: TabIconName; inactive: TabIconName }
> = {
  Home:        { active: 'home',     inactive: 'home-outline'    },
  Leads:       { active: 'people',   inactive: 'people-outline'  },
  Escalations: { active: 'warning',  inactive: 'warning-outline' },
  FollowUps:   { active: 'alarm',    inactive: 'alarm-outline'   },
};

const linking = {
  prefixes: [],
  config: {
    screens: {
      Main: {
        screens: {
          Home: '',
          Leads: 'leads',
          Escalations: 'escalations',
          FollowUps: 'followups',
        },
      },
      ConversationDetail: 'conversation/:enquiryId',
    },
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.cardBorder,
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: 6,
          height: 62,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: FONT_SIZE.xs,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color }) => {
          const icons = tabIconMap[route.name as keyof MainTabParamList];
          const iconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"        component={HomeScreen}        options={{ title: 'Home'       }} />
      <Tab.Screen name="Leads"       component={LeadsScreen}       options={{ title: 'Leads'      }} />
      <Tab.Screen name="Escalations" component={EscalationsScreen} options={{ title: 'Escalations'}} />
      <Tab.Screen name="FollowUps"   component={FollowUpsScreen}   options={{ title: 'Follow-ups' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="ConversationDetail"
          component={ConversationDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
