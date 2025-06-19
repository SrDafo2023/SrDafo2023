export interface Notification {
  id?: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  recipientType: 'user' | 'petshop' | 'admin' | 'all';
  read?: boolean;
  createdAt?: Date;
  link?: string;
  metadata?: Record<string, any>;
  recipientIds?: string[];
} 