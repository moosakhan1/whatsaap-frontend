"use client";

import { usePeer } from "../context/peerContext";

const { useRef, useEffect } = require("react");
const WebRTCPlayer = () => {
  const { remoteStream } = usePeer();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && remoteStream) {
      videoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div>
      <h2>Remote WebRTC Video</h2>
      <video
        className="border boder-black"
        ref={videoRef}
        autoPlay
        playsInline
      />
    </div>
  );
};
export default WebRTCPlayer;
