import * as admin from 'firebase-admin';

/**
 * Sets a custom user role (claim) for a given user.
 * @param {string} uid The user's ID.
 * @param {string} role The role to assign (e.g., 'admin', 'user').
 * @throws Will throw an error if the user is not found or claims cannot be set.
 */
export async function setUserRole(uid: string, role: string): Promise<void> {
  try {
    // Set custom user claims on the user's authentication record.
    await admin.auth().setCustomUserClaims(uid, { role });

    // We can also update the user's document in Firestore to keep roles in sync.
    const userDocRef = admin.firestore().collection('users').doc(uid);
    await userDocRef.update({ userType: role });

    console.log(`Successfully set role '${role}' for user ${uid}`);
  } catch (error) {
    console.error(`Error setting user role for ${uid}:`, error);
    throw new Error('Could not set user role.');
  }
} 