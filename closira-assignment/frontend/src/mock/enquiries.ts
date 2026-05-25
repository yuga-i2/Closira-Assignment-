import { Enquiry } from '../types';

export const mockEnquiries: Enquiry[] = [
  {
    id: 'enq_001',
    job_id: 'job_a1b2c3',
    channel: 'whatsapp',
    customer_name: 'Sarah M.',
    message: 'I would like to get pricing details for your premium plan. Can someone send me a quote?',
    status: 'escalated',
    matched_sop: 'Pricing Question',
    suggested_response: "Thanks for your interest in our pricing! Our plans start from competitive rates tailored for SMBs. I will have someone share a detailed quote with you shortly.",
    escalation_reason: 'Customer unhappy with quote, requested manager.',
    urgency: 'high',
    created_at: '2026-05-24T09:14:00Z',
    updated_at: '2026-05-24T09:22:00Z',
    ai_summary: 'Customer enquired about premium pricing and escalated after receiving quote — wants manager intervention.',
    tags: ['pricing', 'escalated', 'vip'],
    status_timeline: [
      { event: 'enquiry_created', timestamp: '2026-05-24T09:14:00Z', detail: 'Channel: whatsapp' },
      { event: 'sop_matched', timestamp: '2026-05-24T09:14:03Z', detail: 'SOP: Pricing Question' },
      { event: 'manually_escalated', timestamp: '2026-05-24T09:22:00Z', detail: 'Customer unhappy with quote, requested manager.' },
    ],
    follow_ups: [
      {
        id: 'fu_001',
        delay_minutes: 30,
        message_template: 'Following up on your pricing enquiry. Can we help?',
        scheduled_at: '2026-05-24T09:22:00Z',
        due_at: '2026-05-24T09:52:00Z',
        status: 'scheduled',
      },
    ],
    conversation_history: [
      { role: 'customer', content: 'I would like to get pricing details for your premium plan. Can someone send me a quote?', timestamp: '2026-05-24T09:14:00Z' },
      { role: 'assistant', content: "Thanks for your interest in our pricing! Our plans start from competitive rates tailored for SMBs. I will have someone share a detailed quote with you shortly.", timestamp: '2026-05-24T09:14:03Z' },
      { role: 'customer', content: 'That quote is too high. I want to speak with a manager.', timestamp: '2026-05-24T09:21:00Z' },
    ],
  },
  {
    id: 'enq_002',
    job_id: 'job_d4e5f6',
    channel: 'email',
    customer_name: 'James K.',
    message: 'Hi, I would like to book an appointment for next Tuesday. Is 2pm available?',
    status: 'open',
    matched_sop: 'Booking Enquiry',
    suggested_response: 'Thank you for reaching out! We would love to help you book an appointment. Please let us know your preferred date and time.',
    escalation_reason: null,
    urgency: 'medium',
    created_at: '2026-05-24T10:05:00Z',
    updated_at: '2026-05-24T10:05:10Z',
    ai_summary: 'Customer requesting appointment booking for Tuesday at 2pm. Awaiting confirmation.',
    tags: ['booking'],
    status_timeline: [
      { event: 'enquiry_created', timestamp: '2026-05-24T10:05:00Z', detail: 'Channel: email' },
      { event: 'sop_matched', timestamp: '2026-05-24T10:05:10Z', detail: 'SOP: Booking Enquiry' },
    ],
    follow_ups: [],
    conversation_history: [
      { role: 'customer', content: 'Hi, I would like to book an appointment for next Tuesday. Is 2pm available?', timestamp: '2026-05-24T10:05:00Z' },
      { role: 'assistant', content: 'Thank you for reaching out! We would love to help you book an appointment. Please let us know your preferred date and time, and we will confirm availability right away.', timestamp: '2026-05-24T10:05:10Z' },
    ],
  },
  {
    id: 'enq_003',
    job_id: 'job_g7h8i9',
    channel: 'call',
    customer_name: 'Priya S.',
    message: 'This is absolutely terrible service. The product is broken and I am furious. I want a full refund.',
    status: 'escalated',
    matched_sop: 'Complaint',
    suggested_response: "We are truly sorry to hear about your experience. A senior team member will be in touch within 2 hours to resolve this.",
    escalation_reason: 'High-priority complaint — customer requesting refund.',
    urgency: 'high',
    created_at: '2026-05-24T08:30:00Z',
    updated_at: '2026-05-24T08:35:00Z',
    ai_summary: 'Angry customer with broken product demanding refund. High urgency — senior agent required.',
    tags: ['complaint', 'refund', 'urgent'],
    status_timeline: [
      { event: 'enquiry_created', timestamp: '2026-05-24T08:30:00Z', detail: 'Channel: call' },
      { event: 'sop_matched', timestamp: '2026-05-24T08:30:04Z', detail: 'SOP: Complaint' },
      { event: 'manually_escalated', timestamp: '2026-05-24T08:35:00Z', detail: 'High-priority complaint — customer requesting refund.' },
    ],
    follow_ups: [],
    conversation_history: [
      { role: 'customer', content: 'This is absolutely terrible service. The product is broken and I am furious. I want a full refund.', timestamp: '2026-05-24T08:30:00Z' },
      { role: 'assistant', content: "We are truly sorry to hear about your experience. Your feedback is very important to us. A senior team member will be in touch within 2 hours.", timestamp: '2026-05-24T08:30:04Z' },
    ],
  },
  {
    id: 'enq_004',
    job_id: 'job_j1k2l3',
    channel: 'whatsapp',
    customer_name: 'Marcus T.',
    message: 'Hey, can I get a demo of the product? Would love a walkthrough of all the features.',
    status: 'qualified',
    matched_sop: 'Product Demo Request',
    suggested_response: "We would love to show you what Closira can do! Our demos are about 20 minutes. Please share a convenient time.",
    escalation_reason: null,
    urgency: 'medium',
    created_at: '2026-05-24T11:00:00Z',
    updated_at: '2026-05-24T11:15:00Z',
    ai_summary: 'Warm lead requesting product demo. Highly interested — schedule ASAP.',
    tags: ['demo', 'warm-lead'],
    status_timeline: [
      { event: 'enquiry_created', timestamp: '2026-05-24T11:00:00Z', detail: 'Channel: whatsapp' },
      { event: 'sop_matched', timestamp: '2026-05-24T11:00:05Z', detail: 'SOP: Product Demo Request' },
    ],
    follow_ups: [
      {
        id: 'fu_002',
        delay_minutes: 60,
        message_template: 'Just checking in — ready to schedule your demo?',
        scheduled_at: '2026-05-24T11:15:00Z',
        due_at: '2026-05-24T12:15:00Z',
        status: 'scheduled',
      },
    ],
    conversation_history: [
      { role: 'customer', content: 'Hey, can I get a demo of the product? Would love a walkthrough of all the features.', timestamp: '2026-05-24T11:00:00Z' },
      { role: 'assistant', content: "We would love to show you what Closira can do! Our demos are tailored to your business needs and take about 20 minutes. Please share a convenient time.", timestamp: '2026-05-24T11:00:05Z' },
      { role: 'customer', content: 'Great! How about Wednesday at 3pm?', timestamp: '2026-05-24T11:14:00Z' },
    ],
  },
  {
    id: 'enq_005',
    job_id: 'job_m4n5o6',
    channel: 'email',
    customer_name: 'Anika R.',
    message: 'Hello, I sent a message last night but no one replied. Is your office open now?',
    status: 'open',
    matched_sop: 'After-Hours Message',
    suggested_response: "Thanks for reaching out! Our team is now available and will respond to your query right away.",
    escalation_reason: null,
    urgency: 'low',
    created_at: '2026-05-24T07:45:00Z',
    updated_at: '2026-05-24T09:00:00Z',
    ai_summary: 'After-hours follow-up message — customer waiting for response since last night.',
    tags: ['after-hours'],
    status_timeline: [
      { event: 'enquiry_created', timestamp: '2026-05-24T07:45:00Z', detail: 'Channel: email' },
      { event: 'sop_matched', timestamp: '2026-05-24T07:45:02Z', detail: 'SOP: After-Hours Message' },
    ],
    follow_ups: [],
    conversation_history: [
      { role: 'customer', content: 'Hello, I sent a message last night but no one replied. Is your office open now?', timestamp: '2026-05-24T07:45:00Z' },
      { role: 'assistant', content: "Thanks for reaching out! Our team is now available. We apologise for the delay and will respond to your query right away.", timestamp: '2026-05-24T09:00:00Z' },
    ],
  },
  {
    id: 'enq_006',
    job_id: 'job_p7q8r9',
    channel: 'whatsapp',
    customer_name: 'David L.',
    message: 'What is the price for the enterprise tier? We have about 50 users.',
    status: 'processing',
    matched_sop: null,
    suggested_response: null,
    escalation_reason: null,
    urgency: 'medium',
    created_at: '2026-05-24T12:10:00Z',
    updated_at: '2026-05-24T12:10:00Z',
    ai_summary: null,
    tags: ['pricing', 'enterprise'],
    status_timeline: [
      { event: 'enquiry_created', timestamp: '2026-05-24T12:10:00Z', detail: 'Channel: whatsapp' },
    ],
    follow_ups: [],
    conversation_history: [
      { role: 'customer', content: 'What is the price for the enterprise tier? We have about 50 users.', timestamp: '2026-05-24T12:10:00Z' },
    ],
  },
];

export const getEnquiryById = (id: string): Enquiry | undefined =>
  mockEnquiries.find((e) => e.id === id);

export const getLeads = (): Enquiry[] => mockEnquiries;

export const getEscalations = (): Enquiry[] =>
  mockEnquiries.filter((e) => e.status === 'escalated');

export const getFollowUps = () =>
  mockEnquiries.flatMap((e) =>
    e.follow_ups.map((fu) => ({ ...fu, enquiry: e }))
  );
