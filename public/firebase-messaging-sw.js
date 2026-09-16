importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCd4ZGac7Mw-S9O65-8EAlOMi6_Px5jzfg",
  authDomain: "booming-syntax-ndtd0.firebaseapp.com",
  projectId: "booming-syntax-ndtd0",
  storageBucket: "booming-syntax-ndtd0.firebasestorage.app",
  messagingSenderId: "616633366541",
  appId: "1:616633366541:web:4e7eb8ebdb782f225e7d44"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title || 'Norra Scores Update';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new update.',
    icon: '/pwa-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
