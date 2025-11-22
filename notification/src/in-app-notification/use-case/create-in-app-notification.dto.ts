export type CreateInAppNotificationDTO = {
  to: string[];
  eventType: string;
  title: string;
  body: string;
  actionLink?: string;
  metadata?: Record<string, any>;
};
