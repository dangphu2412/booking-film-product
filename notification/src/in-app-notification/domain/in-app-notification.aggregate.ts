import { v4 as uuidv4 } from 'uuid';

export interface NotificationProps {
  id: string;
  userId: string;
  eventType: string;
  title: string;
  body: string;
  actionLink?: string | null;
  metadata?: Record<string, any> | null;
  isRead: boolean;
  readAt?: Date | null;
  createdAt: Date;
}

export class NotificationAggregate {
  private constructor(private readonly props: NotificationProps) {}

  // Getters to expose state immutably
  get id(): string {
    return this.props.id;
  }
  get userId(): string {
    return this.props.userId;
  }
  get eventType(): string {
    return this.props.eventType;
  }
  get title(): string {
    return this.props.title;
  }
  get body(): string {
    return this.props.body;
  }
  get actionLink(): string | null {
    return this.props.actionLink || null;
  }
  get metadata(): Record<string, any> | null {
    return this.props.metadata || null;
  }
  get isRead(): boolean {
    return this.props.isRead;
  }
  get readAt(): Date | null {
    return this.props.readAt || null;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(
    userId: string,
    eventType: string,
    title: string,
    body: string,
    actionLink?: string,
    metadata?: Record<string, any>,
  ): NotificationAggregate {
    return new NotificationAggregate({
      id: uuidv4(),
      userId,
      eventType,
      title,
      body,
      actionLink,
      metadata,
      isRead: false,
      readAt: null,
      createdAt: new Date(),
    });
  }

  /**
   * 🏗️ Reconstitution Method: Restore from DB
   * Used by the Mapper/Repository to hydrate the object.
   */
  static reconstitute(props: NotificationProps): NotificationAggregate {
    return new NotificationAggregate(props);
  }

  /**
   * 🧠 Business Logic: Mark as Read
   * Enforces the rule: "If read, must have a timestamp".
   */
  markAsRead(): void {
    if (this.props.isRead) return; // Idempotent

    this.props.isRead = true;
    this.props.readAt = new Date();
  }
}
