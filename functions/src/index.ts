/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

// --- Interfaces ---
interface UserData {
  email: string;
  password?: string;
  displayName: string;
  role: "admin" | "manager" | "analyst" | "investor" | "compliance";
}

interface UpdateUserData {
    uid: string;
    role: "admin" | "manager" | "analyst" | "investor" | "compliance";
}

interface DeleteUserData {
    uid: string;
}

// --- Permissions Map ---
const allPermissions = [
    'portfolio:view', 'portfolio:edit', 'portfolio:delete',
    'trades:view', 'trades:edit', 'trades:delete',
    'research:view', 'research:edit', 'research:delete',
    'investors:view', 'investors:edit', 'investors:delete',
    'reports:view', 'reports:generate', 'reports:export',
    'users:view', 'users:edit', 'users:delete',
    'settings:view', 'settings:edit'
];

const permissionsByRole: Record<string, string[]> = {
    admin: allPermissions,
    manager: [
      'portfolio:view', 'portfolio:edit', 'trades:view', 'trades:edit',
      'research:view', 'research:edit', 'investors:view', 'investors:edit',
      'reports:view', 'reports:generate',
    ],
    analyst: ['portfolio:view', 'trades:view', 'research:view'],
    investor: ['portfolio:view', 'reports:view'],
    compliance: ['portfolio:view', 'trades:view', 'investors:view', 'reports:view'],
};


// --- Cloud Functions ---

export const createUser = functions.https.onCall(async (data: UserData, context: functions.https.CallableContext) => {
  if (context.auth?.token.role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Only admins can create new users.");
  }

  const {email, password, displayName, role} = data;
  if (!password) {
    throw new functions.https.HttpsError("invalid-argument", "Password is required.");
  }

  try {
    const userRecord = await admin.auth().createUser({ email, password, displayName });
    await admin.auth().setCustomUserClaims(userRecord.uid, {role});

    const userDoc = {
      uid: userRecord.uid, email, displayName, role,
      permissions: permissionsByRole[role] || [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true, twoFactorEnabled: false, photoURL: null,
    };
    await db.collection("users").doc(userRecord.uid).set(userDoc);

    return { uid: userRecord.uid, message: `Successfully created user ${displayName} with role ${role}.` };
  } catch (error) {
    console.error("Error creating user:", error);
    const firebaseError = error as any;
    if (firebaseError.code === "auth/email-already-exists") {
      throw new functions.https.HttpsError("already-exists", "This email address is already in use.");
    }
    throw new functions.https.HttpsError("internal", "An unexpected error occurred.");
  }
});

export const updateUserRole = functions.https.onCall(async (data: UpdateUserData, context: functions.https.CallableContext) => {
    if (context.auth?.token.role !== "admin") {
        throw new functions.https.HttpsError("permission-denied", "Only admins can update user roles.");
    }
    const { uid, role } = data;
    try {
        await admin.auth().setCustomUserClaims(uid, { role });
        await db.collection("users").doc(uid).update({ role: role, permissions: permissionsByRole[role] || [] });
        return { message: `Successfully updated user ${uid} to role ${role}.` };
    } catch (error) {
        console.error("Error updating user role:", error);
        throw new functions.https.HttpsError("internal", "An unexpected error occurred.");
    }
});

export const deleteUser = functions.https.onCall(async (data: DeleteUserData, context: functions.https.CallableContext) => {
    if (context.auth?.token.role !== "admin") {
        throw new functions.https.HttpsError("permission-denied", "Only admins can delete users.");
    }
    const { uid } = data;
    try {
        await admin.auth().deleteUser(uid);
        await db.collection("users").doc(uid).delete();
        return { message: `Successfully deleted user ${uid}.` };
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new functions.https.HttpsError("internal", "An unexpected error occurred.");
    }
});

export const grantAdminRole = functions.https.onCall(async (data: { email: string }, context: functions.https.CallableContext) => {
    // This function should be secured or removed after use.
    const email = data.email;
    if (!email) {
        throw new functions.https.HttpsError("invalid-argument", "Email is required.");
    }

    try {
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
        await db.collection('users').doc(user.uid).update({
            role: 'admin',
            permissions: allPermissions
        });

        return { message: `Successfully granted admin role to ${email}` };
    } catch (error) {
        console.error("Error granting admin role:", error);
        throw new functions.https.HttpsError("internal", "Failed to grant admin role.");
    }
});

export const seedDashboardData = functions.https.onCall(async (data, context) => {
  // Portfolio summary
  await db.collection('dashboard').doc('portfolio').set({
    totalAum: 2400000000,
    dailyChange: 2.5,
    ytdReturn: 12.4,
    benchmarkReturn: 11.2,
    sharpeRatio: 1.8,
    maxDrawdown: -8.2,
    activeInvestors: 1247,
    newInvestors: 12,
    openPositions: 156,
    longPositions: 23,
    shortPositions: 133,
    cashPosition: 5.2,
    leverage: 1.4
  });

  // Recent trades
  const trades = [
    { symbol: 'AAPL', side: 'buy', quantity: 1000, price: 185.50, timestamp: Date.now() - 2*60*60*1000, pnl: 2500 },
    { symbol: 'TSLA', side: 'sell', quantity: 500, price: 245.75, timestamp: Date.now() - 4*60*60*1000, pnl: -1200 },
    { symbol: 'NVDA', side: 'buy', quantity: 200, price: 890.25, timestamp: Date.now() - 6*60*60*1000, pnl: 8500 },
    { symbol: 'MSFT', side: 'buy', quantity: 800, price: 415.30, timestamp: Date.now() - 8*60*60*1000, pnl: 3200 },
    { symbol: 'GOOGL', side: 'sell', quantity: 300, price: 165.80, timestamp: Date.now() - 12*60*60*1000, pnl: -800 }
  ];
  const tradesBatch = db.batch();
  trades.forEach((trade, i) => {
    const ref = db.collection('dashboard_trades').doc(`trade${i+1}`);
    tradesBatch.set(ref, trade);
  });
  await tradesBatch.commit();

  // Top holdings
  const holdings = [
    { symbol: 'AAPL', name: 'Apple Inc.', weight: 8.5, return: 15.2, value: 204000000 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', weight: 7.8, return: 12.8, value: 187200000 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', weight: 6.2, return: 45.6, value: 148800000 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', weight: 5.9, return: 8.4, value: 141600000 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', weight: 5.1, return: 22.1, value: 122400000 }
  ];
  const holdingsBatch = db.batch();
  holdings.forEach((h, i) => {
    const ref = db.collection('dashboard_holdings').doc(`holding${i+1}`);
    holdingsBatch.set(ref, h);
  });
  await holdingsBatch.commit();

  // Performance data
  const performance = [
    { month: 'Jan', return: 2.1, benchmark: 1.8 },
    { month: 'Feb', return: -1.2, benchmark: -0.8 },
    { month: 'Mar', return: 3.4, benchmark: 2.9 },
    { month: 'Apr', return: 1.8, benchmark: 1.5 },
    { month: 'May', return: -0.5, benchmark: -0.3 },
    { month: 'Jun', return: 2.7, benchmark: 2.2 },
    { month: 'Jul', return: 1.9, benchmark: 1.6 },
    { month: 'Aug', return: -1.1, benchmark: -0.9 },
    { month: 'Sep', return: 2.3, benchmark: 1.9 },
    { month: 'Oct', return: 1.5, benchmark: 1.2 },
    { month: 'Nov', return: 3.1, benchmark: 2.6 },
    { month: 'Dec', return: 2.8, benchmark: 2.3 }
  ];
  const perfBatch = db.batch();
  performance.forEach((p, i) => {
    const ref = db.collection('dashboard_performance').doc(`month${i+1}`);
    perfBatch.set(ref, p);
  });
  await perfBatch.commit();

  return { message: 'Dashboard mock data seeded.' };
});
