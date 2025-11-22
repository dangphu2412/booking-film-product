export const CREATE_IN_APP_NOTIFICATION_EVENT =
  'notification-create-ian' as const;

export type CreateInAppNotificationPayload = {
  to: string[];
  message: string;
};
