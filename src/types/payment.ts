import { Timestamp } from 'firebase/firestore';

export interface Payment {
  userId: string;
  status: string;
  stripeSubscriptionId: string;
  startDate: Timestamp;
}