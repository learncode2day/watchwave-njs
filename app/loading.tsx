"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import LoadingAnimation from "./components/Loading";

const loadingMessages = [
  "Preparing your experience...",
  "Hang tight...",
  "Almost there...",
  "Just a moment...",
  "Don't break your screen yet!",
  "Hold tight! Our hamster-powered servers are working their tiny legs off.",
  "Loading... because the anticipation makes the popcorn taste better.",
  "Just a moment... we're almost there!",
  "Loading... because good things come to those who wait.",
];

const Loading = () => {
  const [message, setMessage] = useState(loadingMessages[0]);
  const [hidden, setHidden] = useState(false);
  const [time, setTime] = useState(0);
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,

      transition: { staggerChildren: 0.1, delayChildren: 0.1 * i },
    }),
    exit: (i = 1) => ({
      opacity: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 * i },
    }),
  };
  const child = {
    exit: {
      opacity: 0,
      y: -100,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 100,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  useEffect(() => {
    const interval2 = setInterval(() => {
      setHidden(true);
    }, 3000);
    const interval = setInterval(() => {
      const randomIndex: number = Math.floor(
        Math.random() * loadingMessages.length,
      );
      setMessage(loadingMessages[randomIndex]);
    }, 4000); // Change message every 3 seconds

    // Clear interval on component unmount
    return () => {
      clearInterval(interval);
      clearInterval(interval2);
    };
  }, [message]);

  useEffect(() => {
    const second = setInterval(() => {
      setTime((prev) => prev + 0.1);
    }, 100);

    return () => {
      clearInterval(second);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fc fixed z-50 h-screen w-screen gap-4 overflow-hidden bg-black px-10"
    >
      {/* bouncing ball animation */}
      <LoadingAnimation />
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="font-articulat inline-flex min-h-[80px] flex-wrap overflow-hidden text-2xl tracking-tighter text-white"
      >
        {/* {prevMessage.length !== 0 &&
						prevMessage.split('').map((letter, index) => (
              <motion.span variants={child} key={index}>
              {letter === ' ' ? '\u00A0' : letter}
							</motion.span>
						))} */}
        <AnimatePresence>
          {message.length !== 0 &&
            message.split("").map((letter, index) => (
              <motion.span
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={child}
                key={message + index}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
        </AnimatePresence>
      </motion.div>
      {/* <>{time.toFixed(1)}</> */}
    </motion.div>
  );
};

export default Loading;
