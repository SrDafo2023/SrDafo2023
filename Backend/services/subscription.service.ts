import * as admin from 'firebase-admin';

export interface Subscription {
  plan: 'profesional';
  status: 'active' | 'cancelled';
  planId: 'monthly' | 'yearly';
  startDate: admin.firestore.Timestamp;
  expiryDate: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

/**
 * Creates or updates a subscription for a user in Firestore.
 * @param {string} uid The user's ID.
 * @param {'monthly' | 'yearly'} planId The billing cycle of the plan.
 * @throws Will throw an error if the update fails.
 */
export async function createSubscription(uid: string, planId: 'monthly' | 'yearly'): Promise<void> {
  const db = admin.firestore();
  const userDocRef = db.collection('users').doc(uid);

  const now = new Date();
  const expiryDate = new Date();
  
  if (planId === 'yearly') {
    expiryDate.setFullYear(now.getFullYear() + 1);
  } else {
    expiryDate.setMonth(now.getMonth() + 1);
  }

  const subscriptionData: Subscription = {
    plan: 'profesional',
    status: 'active',
    planId: planId,
    startDate: admin.firestore.Timestamp.fromDate(now),
    expiryDate: admin.firestore.Timestamp.fromDate(expiryDate),
    updatedAt: admin.firestore.Timestamp.fromDate(now),
  };
  
  try {
    // Atomically update the user's document
    await userDocRef.update({ subscription: subscriptionData });
    console.log(`Subscription '${planId}' successfully created for user ${uid}.`);
  } catch (error) {
    console.error(`Failed to create subscription for user ${uid}:`, error);
    throw new Error('Could not update user document with subscription details.');
  }
} 