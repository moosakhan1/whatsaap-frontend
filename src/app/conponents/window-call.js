"use client";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStatusChat } from "../redux/features/chats/chat";
import { usePeer } from "../context/peerContext";
import { useSocket } from "../context/socketContext";
import ReactPlayer from "react-player";
import { Toaster } from "sonner";
import { motion } from "framer-motion";
import { clearActiveCall } from "../redux/features/activecall/activecall";

const CallWindow = () => {
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [stream, setStream] = useState(null);

  const { selectedChat } = useSelector((state) => state.selectChat);
  const { user } = useSelector((state) => state.auth);
  const { sendStream, remoteStream, Disconect, peer, setremoteStream } =
    usePeer();
  const { socket } = useSocket();

  const openMic = useCallback(async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(newStream);
      sendStream(newStream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }, [sendStream]);

  useEffect(() => {
    if (videoRef.current && remoteStream) {
      videoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);
  const handleNegotiation = async () => {
    const Localoffer = await peer.createOffer();
    await peer.setLocalDescription(Localoffer);
    const callerid = user.id;
    if (selectedChat.personOne.id !== user.id) {
      const id = selectedChat.personOne.id;
      return socket?.emit("negotiation-call", {
        callerid,
        offer: Localoffer,
        id,
      });
    }
    if (selectedChat.personTwo.id !== user.id) {
      const id = selectedChat.personTwo.id;
      return socket?.emit("negotiation-call", {
        callerid,
        offer: Localoffer,
        id,
      });
    }
    console.log("negotiationneeded");
  };
  useEffect(() => {
    peer.ontrack = (event) => {
      if (event.streams[0]) {
        setremoteStream(event.streams[0]);
      }
    };
    peer.onnegotiationneeded = () => handleNegotiation();
  }, [peer, setremoteStream]);

  const disconnectCall = () => {
    Disconect();
    socket?.emit("disconect-call", {
      id:
        selectedChat.personOne.id !== user.id
          ? selectedChat.personOne.id
          : selectedChat.personTwo.id,
    });
    dispatch(clearActiveCall());
  };

  const otherUser =
    user.id === selectedChat.personOne.id
      ? selectedChat.personTwo
      : selectedChat.personOne;

  return (
    <>
      <Toaster />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-screen bg-[#0b141a] p-6"
      >
        <div className="w-full max-w-4xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VideoCard stream={stream} user={user} />
            <VideoCard stream={remoteStream} user={otherUser} />
          </div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-lg shadow-lg p-4 flex justify-center items-center space-x-6"
          >
            {/* <motion.button
              whileTap={{ scale: 0.9 }}
              className={`p-4 rounded-full transition-all ${
                micOn ? "bg-green-500" : "bg-red-500"
              }`}
              onClick={() => setMicOn(!micOn)}
            >
              {micOn ? (
                <Mic size={28} className="text-white" />
              ) : (
                <MicOff size={28} className="text-white" />
              )}
            </motion.button> */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`p-4 rounded-full transition-all ${
                cameraOn ? "bg-green-500" : "bg-red-500"
              }`}
              onClick={() => {
                openMic();
                setCameraOn(!cameraOn);
              }}
            >
              {cameraOn ? (
                <Video size={28} className="text-white" />
              ) : (
                <VideoOff size={28} className="text-white" />
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all"
              onClick={disconnectCall}
            >
              <PhoneOff size={28} className="text-white" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default CallWindow;

const VideoCard = ({ stream, user }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="bg-gray-900 rounded-lg shadow-lg overflow-hidden relative aspect-video flex items-center justify-center"
  >
    {stream ? (
      <ReactPlayer
        url={stream}
        playing
        muted
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    ) : (
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-2 rounded-full overflow-hidden bg-gray-700">
          <img
            src={user.pic || "/placeholder.svg?height=96&width=96"}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-white text-lg font-semibold">{user.name}</p>
      </div>
    )}
  </motion.div>
);
