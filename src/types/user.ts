import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string | null;
  createdAt: Timestamp;
  isPro: boolean;
  stripeCustomerId: string;
}