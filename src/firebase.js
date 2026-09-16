import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const githubProvider = new GithubAuthProvider();
githubProvider.addScope('user:email');

// Initialize Firestore with custom databaseId if configured
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// ---------------------------------------------------------------------------
// Plan definitions helper
// ---------------------------------------------------------------------------
export const PLAN_DETAILS = {
  free: {
    name: 'Free Plan',
    price: '$0/mo',
    maxMessageCredits: 20,
    maxChatbots: 1,
    charLimit: '400K'
  },
  hobby: {
    name: 'Hobby Plan',
    price: '$12/mo',
    maxMessageCredits: 2000,
    maxChatbots: 2,
    charLimit: '11M'
  },
  standard: {
    name: 'Standard Plan',
    price: '$49/mo',
    maxMessageCredits: 10000,
    maxChatbots: 5,
    charLimit: 'Unlimited'
  },
  unlimited: {
    name: 'Unlimited Plan',
    price: '$199/mo',
    maxMessageCredits: 40000,
    maxChatbots: 999,
    charLimit: 'Unlimited'
  }
};

// ---------------------------------------------------------------------------
// Deep Sanitizer: Removes all 'undefined' values recursively to prevent Firestore errors
// ---------------------------------------------------------------------------
export function cleanFirestoreData(obj) {
  if (obj === null || obj === undefined) {
    return null;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter(item => item !== undefined)
      .map(item => cleanFirestoreData(item));
  }
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        const cleanedVal = cleanFirestoreData(value);
        if (cleanedVal !== undefined) {
          cleaned[key] = cleanedVal;
        }
      }
    }
    return cleaned;
  }
  return obj;
}

// ---------------------------------------------------------------------------
// Sync user profile with selected plan (Free vs Paid)
// ---------------------------------------------------------------------------
export async function syncUserProfile(user, chosenPlanKey = 'free', extraData = {}) {
  if (!user?.uid) return null;
  
  const planInfo = PLAN_DETAILS[chosenPlanKey?.toLowerCase()] || PLAN_DETAILS.free;
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  let profileData;
  if (!userSnap.exists()) {
    profileData = {
      uid: user.uid,
      email: user.email || '',
      displayName: extraData.displayName || user.displayName || (user.email ? user.email.split('@')[0] : 'Norra Creator'),
      photoURL: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
      plan: planInfo.name,
      planKey: chosenPlanKey || 'free',
      messageCredits: planInfo.maxMessageCredits,
      maxMessageCredits: planInfo.maxMessageCredits,
      maxChatbots: planInfo.maxChatbots,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...extraData
    };
    await setDoc(userRef, cleanFirestoreData(profileData));
  } else {
    profileData = userSnap.data();
    // If user explicitly switched to a specific paid or free plan, update Firestore
    if (chosenPlanKey && chosenPlanKey !== profileData.planKey) {
      const updatedFields = {
        plan: planInfo.name,
        planKey: chosenPlanKey,
        maxMessageCredits: planInfo.maxMessageCredits,
        messageCredits: Math.max(profileData.messageCredits || 0, planInfo.maxMessageCredits),
        maxChatbots: planInfo.maxChatbots,
        updatedAt: new Date().toISOString()
      };
      await setDoc(userRef, cleanFirestoreData(updatedFields), { merge: true });
      profileData = { ...profileData, ...updatedFields };
    }
  }

  return profileData;
}

// ---------------------------------------------------------------------------
// Auth Helpers
// ---------------------------------------------------------------------------

// 1. Google Sign-In
export async function signInWithGoogle(chosenPlanKey = 'free') {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const profile = await syncUserProfile(user, chosenPlanKey);
    return { user, profile };
  } catch (error) {
    console.error('Firebase Google sign in error:', error);
    throw error;
  }
}

// 2. GitHub Sign-In
export async function signInWithGithub(chosenPlanKey = 'free') {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    const profile = await syncUserProfile(user, chosenPlanKey);
    return { user, profile };
  } catch (error) {
    console.error('Firebase GitHub sign in error:', error);
    throw error;
  }
}

// 3. Email & Password (Sign Up or Sign In)
export async function signInWithEmail(email, password, isSignUp = false, chosenPlanKey = 'free', displayName = '') {
  try {
    let result;
    if (isSignUp) {
      result = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
      }
    } else {
      result = await signInWithEmailAndPassword(auth, email, password);
    }
    const user = result.user;
    const profile = await syncUserProfile(user, chosenPlanKey, { displayName });
    return { user, profile };
  } catch (error) {
    console.error('Firebase Email sign in/up error:', error);
    throw error;
  }
}

// 4. Sign Out
export async function logOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Firebase sign out error:', error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Firestore Helpers (Multi-Tenant & Multi-User Isolated)
// ---------------------------------------------------------------------------

// User Profile
export async function getUserProfile(uid) {
  if (!uid) return null;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (e) {
    console.error('Error getting user profile:', e);
    return null;
  }
}

export async function updateUserProfile(uid, data) {
  if (!uid) return;
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, cleanFirestoreData({ ...data, updatedAt: new Date().toISOString() }), { merge: true });
  } catch (e) {
    console.error('Error updating user profile:', e);
  }
}

// Chatbots
export async function fetchUserChatbots(userId) {
  try {
    const chatbotsRef = collection(db, 'chatbots');
    let q;
    if (userId) {
      q = query(chatbotsRef, where('userId', '==', userId));
    } else {
      q = query(chatbotsRef);
    }
    const snap = await getDocs(q);
    const list = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    return list;
  } catch (e) {
    console.error('Error fetching user chatbots:', e);
    return [];
  }
}

export async function getChatbotById(chatbotId) {
  try {
    const docRef = doc(db, 'chatbots', chatbotId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...snap.data(), id: snap.id };
    }
    return null;
  } catch (e) {
    console.error('Error getting chatbot by id:', e);
    return null;
  }
}

export async function saveChatbotToFirestore(chatbot) {
  try {
    const docRef = doc(db, 'chatbots', chatbot.id);
    const payload = cleanFirestoreData({
      ...chatbot,
      updatedAt: new Date().toISOString()
    });
    await setDoc(docRef, payload, { merge: true });
    return chatbot;
  } catch (e) {
    console.error('Error saving chatbot:', e);
    throw e;
  }
}

export async function deleteChatbotFromFirestore(chatbotId) {
  try {
    const docRef = doc(db, 'chatbots', chatbotId);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    console.error('Error deleting chatbot:', e);
    throw e;
  }
}

// Conversations & Transcripts
export async function saveConversationToFirestore(conv) {
  try {
    const docRef = doc(db, 'conversations', conv.id);
    const payload = cleanFirestoreData({
      ...conv,
      updatedAt: new Date().toISOString()
    });
    await setDoc(docRef, payload, { merge: true });
    return conv;
  } catch (e) {
    console.error('Error saving conversation:', e);
  }
}

export async function fetchConversationsForChatbot(chatbotId) {
  try {
    const q = query(collection(db, 'conversations'), where('chatbotId', '==', chatbotId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  } catch (e) {
    console.error('Error fetching conversations:', e);
    return [];
  }
}

// Leads
export async function saveLeadToFirestore(lead) {
  try {
    const docRef = doc(db, 'leads', lead.id);
    const payload = cleanFirestoreData({
      ...lead,
      capturedAt: lead.capturedAt || new Date().toISOString()
    });
    await setDoc(docRef, payload);
    return lead;
  } catch (e) {
    console.error('Error saving lead:', e);
  }
}

export async function fetchLeadsForOwner(userId, chatbotIds = []) {
  try {
    const leadsRef = collection(db, 'leads');
    const snap = await getDocs(leadsRef);
    const allLeads = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    if (userId) {
      return allLeads.filter(l => l.chatbotOwnerId === userId || (chatbotIds && chatbotIds.includes(l.chatbotId)));
    }
    return allLeads;
  } catch (e) {
    console.error('Error fetching leads:', e);
    return [];
  }
}
