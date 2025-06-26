import { FirestoreDataConverter, Timestamp } from 'firebase/firestore';
import { UserProfile } from '../types/profile';

export const profileConverter: FirestoreDataConverter<UserProfile> = {
  toFirestore: (profile: UserProfile) => {
    return {
      ...profile,
      createdAt: Timestamp.fromDate(profile.createdAt),
      updatedAt: Timestamp.fromDate(profile.updatedAt),
      subscription: {
        ...profile.subscription,
        expiresAt: profile.subscription.expiresAt ? Timestamp.fromDate(profile.subscription.expiresAt) : null
      }
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      subscription: {
        ...data.subscription,
        expiresAt: data.subscription.expiresAt ? data.subscription.expiresAt.toDate() : null
      }
    } as UserProfile;
  }
}; 