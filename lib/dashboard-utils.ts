import { differenceInMinutes, format, parseISO } from 'date-fns';

export const PROGRESS_COLORS = ['bg-purple-500', 'bg-orange-500', 'bg-yellow-500'] as const;

export function formatTodayDate(date = new Date()): string {
  return format(date, 'EEEE, MMMM d, yyyy');
}

export function formatSessionTime(scheduledTime: string | Date): string {
  const date = typeof scheduledTime === 'string' ? parseISO(scheduledTime) : scheduledTime;
  return format(date, 'h:mm a');
}

export function formatJoinDate(dateValue: string | Date): string {
  const date = typeof dateValue === 'string' ? parseISO(dateValue) : dateValue;
  return format(date, 'MMM d, yyyy');
}

export function getHoursUntilLabel(scheduledTime: string | Date): string | null {
  const scheduled = typeof scheduledTime === 'string' ? parseISO(scheduledTime) : scheduledTime;
  const diffMinutes = differenceInMinutes(scheduled, new Date());

  if (diffMinutes <= 0) {
    return null;
  }

  if (diffMinutes < 60) {
    return `In ${diffMinutes}min`;
  }

  const hours = Math.ceil(diffMinutes / 60);
  return `In ${hours}Hrs`;
}

export function isSessionJoinable(scheduledTime: string | Date, status?: string): boolean {
  if (status === 'ongoing') {
    return true;
  }

  const scheduled = typeof scheduledTime === 'string' ? parseISO(scheduledTime) : scheduledTime;
  const diffMinutes = differenceInMinutes(scheduled, new Date());
  return diffMinutes <= 15 && diffMinutes >= -60;
}

export function getStoredUser(): { full_name?: string; email?: string; role?: string } | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem('user');
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as { full_name?: string; email?: string; role?: string };
  } catch {
    return null;
  }
}

export function renderStars(rating: number | string): string {
  const value = Number(rating) || 0;
  const filled = Math.max(0, Math.min(5, Math.round(value)));
  return '★'.repeat(filled) + '☆'.repeat(5 - filled);
}
