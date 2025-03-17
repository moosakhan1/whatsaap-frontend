"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, MoreVertical, MessageCircle, LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { findChats } from "../Action/chatAction";
import { Toaster, toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import AddChat from "./addChatModale";
import NiceModal from "@ebay/nice-modal-react";
import {
  clearSelectedChat,
  setSelectedChat,
} from "../redux/features/chats/chat";
import EditeProfile from "./edit-profile";
import { logoutAction } from "../redux/features/auth/auth";
import { clearActiveCall } from "../redux/features/activecall/activecall";
import clearCachesByServerAction from "@/hook/revelidatepath";
import { redirect } from "next/navigation";

export default function ChatList({}) {
  const [Term, setTerm] = useState(true);
  const auth = useSelector((state) => state.auth);
  const [data, setdata] = useState([]);
  const showAntdModal = () => {
    NiceModal.show(AddChat, { Term, setTerm: setTerm });
  };
  console.log("data", data);
  const dispatch = useDispatch();
  const selectchat = (chat) => {
    dispatch(setSelectedChat(chat));
  };
  const logout1 = () => {
    dispatch(clearSelectedChat());
    dispatch(clearActiveCall());
    dispatch(logoutAction());
    Cookies.remove("User");
    redirect("/signin");
  };
  const fetchData = async (user) => {
    try {
      const token = user.token;
      const email = user.email;
      const res = await findChats(token, email);
      if (!res.ok) {
        const { error } = res.json();
        return toast.error(error);
      }
      const { data } = await res.json();
      setdata(data);
    } catch (err) {
      console.log("err=>", err);
    }
  };
  const editProfileModale = () => {
    NiceModal.show(EditeProfile, {});
  };
  useEffect(() => {
    if (auth.user !== null) {
      const callData = async () => {
        const user = auth.user;
        await fetchData(user);
      };
      callData();
      // const data = fetchData(user);
    }
  }, [Term]);

  return (
    <div className="h-full flex flex-col bg-[#111b21]">
      <Toaster />

      <div className="p-4 bg-[#202c33] flex justify-between items-center">
        <img
          src={auth?.user?.Pic || "/boy.png"}
          alt="User"
          className="w-10 h-10 rounded-full"
          onClick={editProfileModale}
        />

        <div className="flex space-x-4">
          <LogOut className="text-[#aebac1]" onClick={() => logout1()} />
          <MessageCircle
            className="text-[#aebac1]"
            onClick={() => showAntdModal()}
          />
          {/* <MoreVertical className="text-[#aebac1]" /> */}
        </div>
      </div>
      <div className="p-2 bg-[#111b21]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#aebac1]" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="pl-10 p-2 bg-[#202c33] text-[#e9edef] w-full rounded-lg focus:outline-none"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {data?.map((chat) => {
          return chat?.personOneId !== auth?.user?.id ? (
            <motion.div
              key={chat?.id}
              className="flex items-center p-3 border-b border-[#222d34] hover:bg-[#2a3942] cursor-pointer"
              onClick={() => selectchat(chat)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src={chat.personOne?.Pic || "/placeholder.svg"}
                alt={"chat.personOne.pic"}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div className="flex-1 ">
                <h3 className="font-semibold text-[#e9edef]">
                  {chat?.personOne?.firstName}
                </h3>
                <p className="text-sm text-[#8696a0] truncate">
                  {chat.personOne.whatappstatus}
                </p>
              </div>
              <span className="text-xs text-[#8696a0]">
                {" "}
                <p className="text-sm text-[#8696a0] truncate">
                  {" "}
                  {chat?.personOne?.status}
                </p>
              </span>
            </motion.div>
          ) : chat.personTwoId !== auth.user.id ? (
            <motion.div
              key={chat.id}
              className="flex items-center p-3 border-b border-[#222d34] hover:bg-[#2a3942] cursor-pointer"
              onClick={() => selectchat(chat)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src={chat.personTwo?.Pic || "/placeholder.svg"}
                alt={chat.personTwo?.firstName}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-[#e9edef]">
                  {chat.personTwo.firstName}
                </h3>
                <p className="text-sm text-[#8696a0] truncate">
                  {chat.personTwo.whatappstatus}
                </p>
              </div>
              <span className="text-xs text-[#8696a0]">
                {chat.personTwo.status}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key={chat.id}
              className="flex items-center p-3 border-b border-[#222d34] hover:bg-[#2a3942] cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div>not found</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
