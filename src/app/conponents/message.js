"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Message({ message }) {
  const { user } = useSelector((state) => state.auth);
  const date = new Date(message.createdAt);
  const splitImageText = (message, numb) => {
    if (message.type == "message/video") {
      let numArray = message.message.split(",");
      console.log(numArray);
      return numArray[numb];
    } else {
      return message;
    }
  };
  // useEffect(() => {
  //   const height = window.innerHeight;
  //   console.log(height);
  //   window.scrollTo(height, height);
  //   console.log(window);
  // }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`flex ${
        message.personId == user.id ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-[70%] xl:w-[400px] w-[200px] md:w-[300px] text-wrap overflow-hidden  p-3 rounded-lg ${
          message.personId == user.id
            ? "bg-[#005c4b] text-[#e9edef]"
            : "bg-[#202c33] text-[#e9edef]"
        }`}
      >
        {message.type == "message/video" ? (
          <div>
            <video
              controls
              src={splitImageText(message, 0)}
              className=" rounded-lg"
            />
            <p className=" break-all">{splitImageText(message, 1)}</p>
          </div>
        ) : message.type == "image" ? (
          <video src={message.message} controls className=" break-all" />
        ) : (
          <p className=" break-all">{message.message}</p>
        )}
        <p className="text-xs text-[#8696a0] text-right mt-1">
          {date.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
}
