"use client";

import { useCallback, useEffect, useState } from "react";
import ChatList from "../conponents/chat-list";
import ChatWindow from "../conponents/chat-window";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  messaging,
  getToken,
  onMessage,
} from "../FirebaseConfig/firebaseconfig";
import { allowNotification } from "../Action/Message";
import { useSocket } from "../context/socketContext";
import NiceModal from "@ebay/nice-modal-react";
import IncomingCall from "../conponents/incomingcallmodal";
import { usePeer } from "../context/peerContext";
import { updateStatusChat } from "../redux/features/chats/chat";
import { clearActiveCall } from "../redux/features/activecall/activecall";
import { toast, Toaster } from "sonner";

export default function WhatsAppClone() {
  const { selectedChat } = useSelector((state) => state.selectChat);
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSocket();
  const [token, setToken] = useState("");
  const [offer, setoffer] = useState();
  const { Answer, CreatAnswer, Disconect, peer } = usePeer();
  const updateToken = async (token) => {
    const obj = {
      fcmToken: token,
      Useremail: user.email,
    };
    const data = await allowNotification(user.token, obj);
    if (!data.ok) {
      const { error } = await data.json();
      return console.log("error=>", error);
    }
    console.log(data.json());
  };

  const dispatch = useDispatch();
  const handleIncoming = useCallback((data) => {
    console.log("data=>", data);
    NiceModal.show(IncomingCall, { data });
    setoffer(data);
  }, []);
  const handleNewOffer = async ({ offer, callerid }) => {
    try {
      await peer.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket?.emit("negotiation-accepted", {
        id: callerid,
        answer: answer,
      });
    } catch (error) {
      console.error("Error handling new offer:", error);
    }
  };
  const NegotiationAns = useCallback(async ({ offer, callerid }) => {
    const ans = await CreatAnswer(offer);
    socket?.emit("negotiation-accepted", {
      id: callerid,
      answer: ans,
    });
  }, []);
  const handleAcceptcall = async ({ answer }) => {
    console.log("answer", answer);
    await Answer(answer);
  };
  const handleNewAnswer = async ({ answer }) => {
    try {
      await peer.setRemoteDescription(new RTCSessionDescription(answer));
      console.log("Renegotiation complete.");
    } catch (error) {
      console.error("Error setting new remote description:", error);
    }
  };
  const callDisconnected = async () => {
    Disconect();
    toast.error("call is disconnected by other person");
    dispatch(clearActiveCall());
  };

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker Registered");
        })
        .catch((err) => console.log("Service Worker Registration Failed", err));
    }
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_VAPEID_KEY })
          .then((currentToken) => {
            if (currentToken) {
              console.log("FCM Token:", currentToken);
              setToken(currentToken);
            } else {
              console.log("No FCM token found");
            }
          })
          .catch((err) => console.log("FCM token error:", err));
      }
    });
  }, []);
  useEffect(() => {
    if (token) {
      return updateToken(token);
    }
  }, [token]);
  useEffect(() => {
    socket?.on("call-not-recived", callDisconnected);
    socket?.on("incoming-call", handleIncoming);
    socket?.on("accepted-call", handleAcceptcall);
    socket?.on("negotiation", handleNewOffer);
    socket?.on("negotiation-answer", handleNewAnswer);
    socket?.on("call-disconnected", callDisconnected);

    return () => {
      socket?.off("incoming-call", handleIncoming);
      socket?.off("negotiation", handleNewOffer);
      socket?.off("negotiation-answer", handleNewAnswer);
      socket?.off("call-not-recived", callDisconnected);

      socket?.off("call-disconnected", callDisconnected);
    };
  }, [socket]);
  return (
    <>
      <div className="flex md:hidden h-screen bg-[#111b21] text-[#e9edef]">
        <AnimatePresence>
          {!selectedChat && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-full md:w-1/3"
            >
              <ChatList />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {selectedChat && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-full"
            >
              <ChatWindow />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="hidden  md:flex h-screen bg-[#111b21] text-[#e9edef]">
        <AnimatePresence>
          <div className="w-[100%] flex">
            <div className="md:w-[30%]  hidden md:block">
              <ChatList />
            </div>
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-full md:w-[70%]  hidden md:block"
            >
              <ChatWindow />
            </motion.div>
          </div>
        </AnimatePresence>
      </div>
    </>
  );
}
