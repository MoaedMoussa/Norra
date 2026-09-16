import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { app, db, auth } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export const initMessaging = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.log('Firebase Messaging is not supported in this browser.');
      return null;
    }
    const messaging = getMessaging(app);
    return messaging;
  } catch (err) {
    console.error('Messaging initialization failed', err);
    return null;
  }
};

export const requestNotificationPermission = async () => {
  const messaging = await initMessaging();
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      const token = await getToken(messaging, {
        vapidKey: 'BGyhz0xxvruQisHAPIrsPuUAycBWwZcKebb2NgMbNL2L_nSj0TnkDbwXFdb5FwVQAcnsQiKCZl0plfIhE1dpeIM'
      });
      
      console.log('FCM Token:', token);
      
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, { fcmToken: token, updatedAt: new Date().toISOString() }, { merge: true });
      }
      
      return token;
    } else {
      console.log('Unable to get permission to notify.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token.', error);
    return null;
  }
};

export const setupOnMessageListener = async (callback) => {
  const messaging = await initMessaging();
  if (!messaging) return () => {};

  return onMessage(messaging, (payload) => {
    console.log('Message received in foreground: ', payload);
    callback(payload);
  });
};
