export interface DashboardStats {
  totalLeadsToday: number;
  missedEnquiries: number;
  openEscalations: number;
  followUpsDue: number;
}

export const mockDashboardStats: DashboardStats = {
  totalLeadsToday: 12,
  missedEnquiries: 3,
  openEscalations: 2,
  followUpsDue: 4,
};

export interface ActivityItem {
  id: string;
  type: 'new_lead' | 'escalation' | 'follow_up' | 'resolved';
  customer_name: string;
  channel: 'whatsapp' | 'email' | 'call';
  message_preview: string;
  timestamp: string;
  enquiry_id: string;
}

export const mockActivity: ActivityItem[] = [
  {
    id: 'act_001',
    type: 'escalation',
    customer_name: 'Sarah M.',
    channel: 'whatsapp',
    message_preview: 'That quote is too high. I want to speak with a manager.',
    timestamp: '2026-05-24T09:22:00Z',
    enquiry_id: 'enq_001',
  },
  {
    id: 'act_002',
    type: 'new_lead',
    customer_name: 'David L.',
    channel: 'whatsapp',
    message_preview: 'What is the price for the enterprise tier?',
    timestamp: '2026-05-24T12:10:00Z',
    enquiry_id: 'enq_006',
  },
  {
    id: 'act_003',
    type: 'new_lead',
    customer_name: 'Marcus T.',
    channel: 'whatsapp',
    message_preview: 'Hey, can I get a demo of the product?',
    timestamp: '2026-05-24T11:00:00Z',
    enquiry_id: 'enq_004',
  },
  {
    id: 'act_004',
    type: 'escalation',
    customer_name: 'Priya S.',
    channel: 'call',
    message_preview: 'This is absolutely terrible service. I want a refund.',
    timestamp: '2026-05-24T08:35:00Z',
    enquiry_id: 'enq_003',
  },
  {
    id: 'act_005',
    type: 'new_lead',
    customer_name: 'James K.',
    channel: 'email',
    message_preview: 'I would like to book an appointment for next Tuesday.',
    timestamp: '2026-05-24T10:05:00Z',
    enquiry_id: 'enq_002',
  },
  {
    id: 'act_006',
    type: 'resolved',
    customer_name: 'Anika R.',
    channel: 'email',
    message_preview: 'Hello, I sent a message last night — is your office open?',
    timestamp: '2026-05-24T09:00:00Z',
    enquiry_id: 'enq_005',
  },
];
