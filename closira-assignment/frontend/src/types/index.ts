export type Channel = 'whatsapp' | 'email' | 'call';
export type EnquiryStatus = 'processing' | 'open' | 'qualified' | 'escalated' | 'resolved';
export type Urgency = 'high' | 'medium' | 'low';
export type FollowUpStatus = 'scheduled' | 'done' | 'overdue';

export interface TimelineEntry {
  event: string;
  timestamp: string;
  detail?: string;
}

export interface ConversationMessage {
  role: 'customer' | 'assistant';
  content: string;
  timestamp: string;
}

export interface FollowUp {
  id: string;
  delay_minutes: number;
  message_template: string;
  scheduled_at: string;
  due_at: string;
  status: FollowUpStatus;
}

export interface Enquiry {
  id: string;
  job_id: string;
  channel: Channel;
  customer_name: string;
  message: string;
  status: EnquiryStatus;
  matched_sop: string | null;
  suggested_response: string | null;
  escalation_reason: string | null;
  urgency?: Urgency;
  created_at: string;
  updated_at: string;
  status_timeline: TimelineEntry[];
  follow_ups: FollowUp[];
  conversation_history: ConversationMessage[];
  ai_summary?: string;
  tags?: string[];
}

export type RootStackParamList = {
  Main: undefined;
  ConversationDetail: { enquiryId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Leads: undefined;
  Escalations: undefined;
  FollowUps: undefined;
};
