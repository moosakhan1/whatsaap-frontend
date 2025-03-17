importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);
firebase.initializeApp({
  apiKey: "AIzaSyC2w081hIfjQ8v9YyVGDHgWaZTC9TRrowc",
  authDomain: "whatsapp-web-b2deb.firebaseapp.com",
  projectId: "whatsapp-web-b2deb",
  storageBucket: "whatsapp-web-b2deb.firebasestorage.app",
  messagingSenderId: "132805479381",
  appId: "1:132805479381:web:86ed14c3a312252ee2cb5c",
  measurementId: "G-FJ5R72K83P",
});
// const app = initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  // Customize notification here
  const notificationTitle = payload?.data?.title;

  const notificationOptions = {
    body: payload?.data?.body,
    //icon: '/firebase-logo.png'
  };
  if (payload.data) {
    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});
