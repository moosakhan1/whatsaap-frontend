import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
const PeerContext = createContext();
export const PeerProvider = ({ children }) => {
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  const [remoteStream, setremoteStream] = useState(null);
  const [peer, setPeer] = useState(() => new RTCPeerConnection(configuration));
  // const peer = useMemo(() => {
  //   return new RTCPeerConnection(configuration);
  // }, []);

  const Disconect = async () => {
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
    }
    peer.getSenders().forEach((sender) => peer.removeTrack(sender));
    peer.ontrack = null;
    peer.onicecandidate = null;
    setremoteStream(null);
    // peer.close();
    const newPeer = new RTCPeerConnection(configuration);
    setPeer(newPeer);
    console.log("newPeer", newPeer);
  };
  // const Disconect = async () => {};
  console.log("setLocalDescription=>", peer);
  const CreateOffer = async () => {
    console.log("peer.signalingState=>", peer.signalingState);
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };
  const negociationOffer = async () => {
    // await peer.setLocalDescription(null);
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    return offer;
  };
  const CreatAnswer = async (offer) => {
    try {
      await peer.setRemoteDescription(offer);
      console.log("Remote offer set successfully.");

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      console.log("Created and set local answer:", answer);

      return answer;
    } catch (error) {
      console.error("Error handling offer:", error);
    }
    // await peer.setRemoteDescription(offer);
    // const answer = await peer.createAnswer();
    // await peer.setLocalDescription(answer);
    // return answer;
  };

  const Answer = async (anwser) => {
    try {
      console.log(
        "Signaling state before setting answer:",
        peer.signalingState
      );

      if (peer.signalingState !== "have-local-offer") {
        console.error("Cannot set remote answer: Invalid state.");
        return;
      }

      await peer.setRemoteDescription(anwser);
      console.log("Remote answer set successfully.");
    } catch (error) {
      console.error("Error setting remote answer:", error);
    }
    // await peer.setRemoteDescription(anwser);
  };
  const sendStream = async (stream) => {
    const tracks = await stream.getTracks();
    console.log("track=>", tracks);
    for (const track of tracks) {
      peer.addTrack(track, stream);
    }
  };

  const handleStream = useCallback((e) => {
    const streams = e.streams;
    console.log("streams=>", streams[0]);
    setremoteStream(streams[0]);
  }, []);
  useEffect(() => {
    // peer.addEventListener("track", handleStream);
    // return () => {
    //   peer.removeEventListener("track", handleStream);
    // };
  }, [peer]);
  return (
    <PeerContext.Provider
      value={{
        peer,
        setremoteStream,
        CreateOffer,
        CreatAnswer,
        Answer,
        sendStream,
        remoteStream,
        Disconect,
        negociationOffer,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};
export const usePeer = () => useContext(PeerContext);
