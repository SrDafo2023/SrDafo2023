"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscription = createSubscription;
const admin = __importStar(require("firebase-admin"));
/**
 * Creates or updates a subscription for a user in Firestore.
 * @param {string} uid The user's ID.
 * @param {'monthly' | 'yearly'} planId The billing cycle of the plan.
 * @throws Will throw an error if the update fails.
 */
async function createSubscription(uid, planId) {
    const db = admin.firestore();
    const userDocRef = db.collection('users').doc(uid);
    const now = new Date();
    const expiryDate = new Date();
    if (planId === 'yearly') {
        expiryDate.setFullYear(now.getFullYear() + 1);
    }
    else {
        expiryDate.setMonth(now.getMonth() + 1);
    }
    const subscriptionData = {
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
    }
    catch (error) {
        console.error(`Failed to create subscription for user ${uid}:`, error);
        throw new Error('Could not update user document with subscription details.');
    }
}
//# sourceMappingURL=subscription.service.js.map