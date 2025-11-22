export const CREATE_IN_APP_NOTIFICATION_EVENT =
  'notification-create-ian' as const;

export type CreateInAppNotificationPayload = {
  to: string[];
  eventType: string;
  title: string;
  body: string;
  actionLink?: string;
  metadata?: Record<string, any>;
};
