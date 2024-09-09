export interface NotificationSender<T> {
  sendNotification(option: T): void;
}
