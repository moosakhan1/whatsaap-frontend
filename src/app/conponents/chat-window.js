"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Send,
  phone,
  Upload,
  Phone,
  FileVideo,
} from "lucide-react";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";

import Message from "./message";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSelectedChat,
  setSelectedChat,
  updateBlock,
  updateStatusChat,
} from "../redux/features/chats/chat";
import {
  findMessage,
  sendMessage,
  sendVideos,
  sendVideosMessage,
} from "../Action/Message";
import { set, useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { useSocket } from "../context/socketContext";
import { usePeer } from "../context/peerContext";
import CallWindow from "./window-call";
import { setActiveCall } from "../redux/features/activecall/activecall";
import { Input } from "antd";
import { blockedChat, unblockedChat } from "../Action/chatAction";

export default function ChatWindow({ onBack }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const ref1 = useRef(null);
  const [Message1, setMessage] = useState([]);
  const [blockpop, setblockpop] = useState(false);

  const { peer, CreateOffer } = usePeer();
  const [sentmsg, setSentmsg] = useState("");
  const [loading, setloading] = useState(false);

  const [file, setfile] = useState();
  const [PreviewImage, setPreviewImage] = useState();
  const video = useRef(null);
  const { socket } = useSocket();
  const { selectedChat } = useSelector((state) => state.selectChat);
  const { activeCall } = useSelector((state) => state.activeCall);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fetchData = async (chat, user) => {
    try {
      const obj = {
        Useremail: user.email,
        chatId: chat.id,
      };
      const token = user.token;

      const res = await findMessage(token, obj);
      if (!res.ok) {
        const { error } = await res.json();
        return toast.error(error);
      }
      const { data } = await res.json();
      setMessage(data);
    } catch (err) {
      console.log("err=>", err);
    }
  };
  const sentMessage = async () => {
    try {
      const obj = {
        personId: user.id,
        chatId: selectedChat.id,
        message: sentmsg,
        Useremail: user.email,
      };
      const token = user.token;
      const res = await sendMessage(token, obj);
      if (!res.ok) {
        const { error } = await res.json();
        return toast.error(error);
      }
      const { data } = await res.json();
      console.log("data=>", data);
      setSentmsg("");
      console.log(token);
      setMessage((pre) => [...pre, data]);
    } catch (err) {}
  };
  const sendVidieo = async () => {
    try {
      const formData = new FormData();
      formData.append("fileName", file.name);
      formData.append("fileInput", file);
      formData.append("chatId", selectedChat.id);
      formData.append("personId", user.id);
      const res = await sendVideos(formData);
      setloading(true);
      if (!res.ok) {
        setfile();
        setPreviewImage();
        setloading(false);

        const { error } = await res.json();
        return toast.error(error);
      }
      setPreviewImage();
      setloading(false);

      setfile();
      const { data } = await res.json();
      setMessage((prev) => [...prev, data]);

      console.log(data);
    } catch {}
  };
  const uploadVideo = async (e) => {
    setPreviewImage();
    setfile(e.target.files[0]);
    videoView(e.target.files[0]);
  };
  const sendVideoMessage = async () => {
    try {
      setloading(true);

      const formData = new FormData();
      formData.append("fileName", file.name);
      formData.append("fileInput", file);
      formData.append("chatId", selectedChat.id);
      formData.append("personId", user.id);
      formData.append("message", sentmsg);

      const res = await sendVideosMessage(formData);

      if (!res.ok) {
        setfile();
        setPreviewImage();
        setSentmsg("");
        setloading(false);
        const { error } = await res.json();
        return toast.error(error);
      }
      setPreviewImage();

      setfile();
      setloading(false);

      const { data } = await res.json();
      setMessage((pre) => [...pre, data]);
      setSentmsg("");
      console.log(data);
    } catch {}
  };
  useEffect(() => {
    fetchData(selectedChat, user);
    if (socket) {
      socket?.on("newMessage", (message) => {
        setMessage((prev) => [...prev, message]);
      });
    }
    return () => socket?.off("newMessage");
  }, [selectedChat, socket]);
  const obj = {
    id: 1,
    name: "John Doe",
    lastMessage: "Hey, how are you?",
    time: "10:30 AM",
    avatar: "/placeholder.svg?height=40&width=40",
  };

  const callIng = async () => {
    const offer = await CreateOffer();
    const name = user.name;
    const email = user.email;
    const chatid = selectedChat.id;
    const callerid = user.id;
    if (selectedChat.personOne.id !== user.id) {
      const id = selectedChat.personOne.id;
      return socket.emit("calling", {
        offer,
        id,
        name,
        email,
        callerid,
        chatid,
      });
    }
    if (selectedChat.personTwo.id !== user.id) {
      const id = selectedChat.personTwo.id;
      console.log(id);
      return socket.emit("calling", {
        offer,
        id,
        name,
        email,
        callerid,
        chatid,
      });
    }
  };

  const recorder = null;
  // const recording = () => {
  //   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //     navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  //       console.log(stream);
  //     });
  //   }
  // };
  const videoView = (file) => {
    const read = new FileReader();
    read.onloadend = () => {
      setPreviewImage(read.result);
    };
    read.readAsDataURL(file);
  };
  const handleBlockPopup = () => {
    setblockpop(!blockpop);
  };
  const blockedChats = async () => {
    const obj = {
      Useremail: user.email,
      chatId: selectedChat.id,
    };
    const data = await blockedChat(user.token, obj);
    if (!data.ok) {
      const { error } = await data.json();
      console.log("error", error);

      return toast.error(error);
    }
    const res = await data.json();

    dispatch(updateBlock({ blockUserId: user.id, blocked: true }));

    // dispatch(clearSelectedChat());
  };
  const unblockedChats = async () => {
    const obj = {
      Useremail: user.email,
      chatId: selectedChat.id,
    };
    const data = await unblockedChat(user.token, obj);
    if (!data.ok) {
      const { error } = await data.json();

      return toast.error(error);
    }
    const res = await data.json();

    dispatch(updateBlock({ blockUserId: null, blocked: false }));

    // dispatch(clearSelectedChat());
  };
  return (
    <>
      <Toaster />

      {activeCall && activeCall.id == selectedChat.id ? (
        <CallWindow />
      ) : selectedChat != null ? (
        <div className="flex flex-col h-full bg-[#0b141a]">
          <div className="p-4 bg-[#202c33] flex justify-between  items-center">
            <div className="flex items-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(clearSelectedChat())}
                className="mr-2 text-[#aebac1]"
              >
                <ArrowLeft />
              </motion.button>
              {selectedChat?.personOne?.id !== user?.id ? (
                <div className="flex">
                  <img
                    src={selectedChat?.personOne?.Pic || "/placeholder.svg"}
                    // alt={personTwo?.Pic}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div className="">
                    <h2 className="font-semibold text-[#e9edef]">
                      {selectedChat?.personOne?.firstName}
                    </h2>
                    <p className="text-xs text-[#8696a0]">
                      {" "}
                      {/* {selectedChat?.personOne?.firstName} */}
                    </p>
                  </div>
                </div>
              ) : selectedChat?.personTwo?.id !== user?.id ? (
                <div className="flex">
                  <img
                    src={selectedChat.personTwo.Pic || "/placeholder.svg"}
                    // alt={personTwo?.Pic}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div className="">
                    <h2 className="font-semibold text-[#e9edef]">
                      {selectedChat.personTwo.firstName}
                    </h2>
                    <p className="text-xs text-[#8696a0]">
                      {" "}
                      {/* {selectedChat?.personTwo?.firstName} */}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex">
                  <img
                    src={obj.avatar || "/placeholder.svg"}
                    alt={obj.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div className="">
                    <h2 className="font-semibold text-[#e9edef]">{obj.name}</h2>
                    <p className="text-xs text-[#8696a0]">Online</p>
                  </div>
                </div>
              )}
            </div>
            {selectedChat.blocked ? (
              <div>
                <div className="flex gap-4">
                  <MoreVertical
                    onClick={handleBlockPopup}
                    className="text-[#aebac1] "
                  />
                </div>
                <div className=" z-20 absolute w-[150px] transtition right-5 top-12">
                  {blockpop && (
                    <motion.div
                      animate={{ translateY: 10 }}
                      transition={{ type: "spring", restSpeed: 0.5 }}
                    >
                      <div
                        onClick={unblockedChats}
                        className="text-center cursor-default border-[#0b141a] border rounded-md p-2 shadow-xl bg-[#202c33] "
                      >
                        unblock
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex gap-4">
                  <Phone
                    className="text-[#aebac1] "
                    onClick={() => {
                      callIng();
                      dispatch(setActiveCall(selectedChat));
                      dispatch(updateStatusChat("call"));
                    }}
                  />
                  <MoreVertical
                    onClick={handleBlockPopup}
                    className="text-[#aebac1] "
                  />
                </div>
                <div className=" z-20 absolute w-[150px] transtition right-5 top-12">
                  {blockpop && (
                    <motion.div
                      animate={{ translateY: 10 }}
                      transition={{ type: "spring", restSpeed: 0.5 }}
                    >
                      <div
                        onClick={blockedChats}
                        className="text-center border-[#0b141a] border rounded-md p-2 shadow-xl bg-[#202c33] "
                      >
                        block
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div
            ref={ref1}
            className="flex-1 overflow-y-auto p-4 bottom-0  bg-[#0b141a] bg-[url('/whatsapp-bg.png')] bg-repeat"
          >
            {Message1?.map((msg) => (
              // <div>asad</div>
              <Message key={msg.id} message={msg} />
            ))}
          </div>
          {selectedChat.blocked ? (
            <div className="p-4  bg-[#202c33] flex items-center justify-center ">
              {selectedChat?.blockUserId == user?.id
                ? `You have block the ${
                    user.id != selectedChat?.personOne.id
                      ? selectedChat?.personOne.firstName
                      : selectedChat?.personTwo.firstName
                  }`
                : `you have been blocked the by ${
                    user.id != selectedChat?.personOne.id
                      ? selectedChat?.personOne.firstName
                      : selectedChat?.personTwo.firstName
                  }`}
            </div>
          ) : (
            <div className="p-4  bg-[#202c33] flex items-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-[#8696a0]"
              >
                <Smile />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="ml-2 text-[#8696a0]"
              >
                <div className="flex flex-col items-center space-y-3">
                  {/* Custom File Upload Button */}
                  <label
                    htmlFor="file-upload"
                    className="flex items-center text-[#8696a0] pointer-events-auto  rounded-lg cursor-pointertransition"
                  >
                    <FileVideo />
                  </label>

                  <input
                    id="file-upload"
                    type="file"
                    accept=".mp4"
                    className="hidden"
                    onChange={uploadVideo}
                  />
                </div>
                {/* <input
                className=""
                // id="dropzone-file"
                accept=".mp4"
                type="file"
                onChange={(e) => {
                  console.log(e.target.files[0]);
                  setfile(e.target.files[0]);
                }}
              /> */}
              </motion.button>
              <div className="mx-4   rounded-lg flex-1  bg-[#2a3942] text-[#e9edef] ">
                {PreviewImage && (
                  <div className="relative  rounded-md overflow-hidden w-fit">
                    <div className="absolute right-3">
                      <button
                        className=""
                        onClick={() => {
                          console.log("asad");
                          // setfile();
                          // setPreviewImage();
                        }}
                      >
                        X
                      </button>
                    </div>
                    <video className="abolute" controls width="200">
                      <source src={PreviewImage} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Type a message"
                  className="p-2 bg-[#2a3942] text-[#e9edef] rounded-lg  w-full focus:outline-none"
                  value={sentmsg}
                  onChange={(e) => setSentmsg(e.target.value)}
                />
              </div>
              {file && sentmsg && !loading ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-[#8696a0]"
                  onClick={() => sendVideoMessage()}
                  disabled={loading}
                >
                  <Send />
                </motion.button>
              ) : file ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-[#8696a0]"
                  onClick={() => sendVidieo()}
                  disabled={loading}
                >
                  <Send />
                </motion.button>
              ) : sentmsg && !loading ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-[#8696a0]"
                  onClick={() => sentMessage()}
                  disabled={loading}
                >
                  <Send />
                </motion.button>
              ) : loading ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-[#8696a0]"
                  onClick={() => {
                    recording;
                  }}
                >
                  <Spin indicator={<LoadingOutlined spin />} size="small" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-[#8696a0]"
                  onClick={() => {
                    recording;
                  }}
                >
                  <Mic />
                </motion.button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col h-full bg-[#0b141a]"></div>
      )}
    </>
  );
}
