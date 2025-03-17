import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "asASJkldfjaweur234sdaj3qerqq432cas",
  authDomain: "whatsapp-dd4f.firebaseapp.com",
  projectId: "whatsapp-dd4f",
  storageBucket: "whatsapp-web-b2deb.firebasestorage.app",
  messagingSenderId: "132544794354681",
  appId: "1:1328342134qe:web:86ed14c3adsfs2r3e2cb5c",
  measurementId: "86ed14c3adsfs2r3e2cb5c2",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
