import { Channel, EnquiryStatus, Urgency } from '../types';
import { COLORS } from '../constants';

export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  return `${diffDays}d ago`;
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function getChannelColor(channel: Channel): string {
  const map: Record<Channel, string> = {
    whatsapp: COLORS.whatsapp,
    email: COLORS.email,
    call: COLORS.call,
  };
  return map[channel];
}

export function getChannelBgColor(channel: Channel): string {
  const map: Record<Channel, string> = {
    whatsapp: COLORS.whatsappBg,
    email: COLORS.emailBg,
    call: COLORS.callBg,
  };
  return map[channel];
}

export function getChannelLabel(channel: Channel): string {
  const map: Record<Channel, string> = {
    whatsapp: 'WhatsApp',
    email: 'Email',
    call: 'Call',
  };
  return map[channel];
}

export function getStatusColor(status: EnquiryStatus): string {
  const map: Record<EnquiryStatus, string> = {
    processing: COLORS.statusProcessing,
    open: COLORS.statusOpen,
    qualified: COLORS.statusQualified,
    escalated: COLORS.statusEscalated,
    resolved: COLORS.statusResolved,
  };
  return map[status];
}

export function getStatusBgColor(status: EnquiryStatus): string {
  const map: Record<EnquiryStatus, string> = {
    processing: COLORS.statusProcessingBg,
    open: COLORS.statusOpenBg,
    qualified: COLORS.statusQualifiedBg,
    escalated: COLORS.statusEscalatedBg,
    resolved: COLORS.statusResolvedBg,
  };
  return map[status];
}

export function getStatusLabel(status: EnquiryStatus): string {
  const map: Record<EnquiryStatus, string> = {
    processing: 'Processing',
    open: 'Open',
    qualified: 'Qualified',
    escalated: 'Escalated',
    resolved: 'Resolved',
  };
  return map[status];
}

export function getUrgencyColor(urgency: Urgency): string {
  const map: Record<Urgency, string> = {
    high: COLORS.urgencyHigh,
    medium: COLORS.urgencyMedium,
    low: COLORS.urgencyLow,
  };
  return map[urgency];
}

export function getChannelIcon(channel: Channel): string {
  const map: Record<Channel, string> = {
    whatsapp: 'logo-whatsapp',
    email: 'mail',
    call: 'call',
  };
  return map[channel];
}
