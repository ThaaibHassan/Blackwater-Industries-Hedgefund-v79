const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc } = require('firebase/firestore');

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQ",
  authDomain: "blackwater-hedgefund.firebaseapp.com",
  projectId: "blackwater-hedgefund",
  storageBucket: "blackwater-hedgefund.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Replace with your actual user UID
const USER_UID = 'YOUR_USER_UID_HERE';

async function grantAdminRole() {
  try {
    const userRef = doc(db, 'users', USER_UID);
    await updateDoc(userRef, {
      role: 'admin',
      permissions: [
        'portfolio:view', 'portfolio:edit', 'portfolio:delete',
        'trades:view', 'trades:edit', 'trades:delete',
        'research:view', 'research:edit', 'research:delete',
        'investors:view', 'investors:edit', 'investors:delete',
        'reports:view', 'reports:generate', 'reports:export',
        'users:view', 'users:edit', 'users:delete',
        'settings:view', 'settings:edit'
      ]
    });
    console.log('Successfully granted admin role to user:', USER_UID);
  } catch (error) {
    console.error('Error granting admin role:', error);
  }
}

grantAdminRole(); 