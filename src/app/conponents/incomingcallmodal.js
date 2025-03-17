"use client";
import { Button, Modal } from "antd";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { useSocket } from "../context/socketContext";
import { usePeer } from "../context/peerContext";
import {
  setSelectedChat,
  updateStatusChat,
} from "../redux/features/chats/chat";
import { motion } from "framer-motion";
import { PhoneIncoming, XCircle } from "lucide-react";
import { setActiveCall } from "../redux/features/activecall/activecall";

const IncomingCall = NiceModal.create(({ data }) => {
  const dispatch = useDispatch();
  const modal = useModal();
  const { socket } = useSocket();
  const { CreatAnswer } = usePeer();
  const acceptCall = useCallback(async () => {
    const ans = await CreatAnswer(data.offer);
    socket.emit("call-accepted", {
      id: data.callerid,
      answer: ans,
    });
    dispatch(setSelectedChat(data.chat));
    dispatch(setActiveCall(data.chat));
    dispatch(updateStatusChat("call"));
    modal.hide();
  }, [CreatAnswer, data, dispatch, modal, socket]);

  const declineCall = useCallback(() => {
    socket.emit("call-decline", { email: data.email });
    modal.hide();
  }, []);

  return (
    <Modal
      visible={modal.visible}
      onCancel={() => declineCall()}
      afterClose={() => modal.remove()}
      footer={null}
      modalClassName="bg-gray-900" // Custom background
      className="custom-modal" // Add a custom class
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center   justify-center gap-y-4 p-4"
      >
        <p className="text-2xl text-white  font-bold">icomming call from </p>

        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-2 border bg-white rounded-full overflow-hidden ">
            <img
              src={data?.pic}
              alt={data.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-lg text-white font-semibold">{data.name}</p>
          <p className="text-sm text-gray-400">{data.email}</p>
        </div>
        <div className="mt-4 flex space-x-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={acceptCall}
            className="px-6 py-2 flex items-center space-x-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold transition-all"
          >
            <PhoneIncoming size={20} />
            <span>Accept</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => declineCall()}
            className="px-6 py-2 flex items-center space-x-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold transition-all"
          >
            <XCircle size={20} />
            <span>Decline</span>
          </motion.button>
        </div>
      </motion.div>
    </Modal>
  );
});

export default IncomingCall;
