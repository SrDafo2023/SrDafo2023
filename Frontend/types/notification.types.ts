export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type RecipientType = 'user' | 'admin' | 'business' | 'grooming';

export interface Notification {
  id?: string;
  title: string;
  message: string;
  type: NotificationType;
  recipientType: RecipientType;
  recipientIds?: string[];
  read?: boolean;
  readAt?: string;
  link?: string;
  metadata?: Record<string, any>;
  timestamp: string;
} 