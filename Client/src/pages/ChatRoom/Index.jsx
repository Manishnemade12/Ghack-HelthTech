import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

const socket = io("http://localhost:3000"); 

const ChatRooms = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = { text: input, sender: "me" };
      socket.emit("message", newMessage);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        ✨ Global Chat Room 🌍
      </h2>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-800 bg-opacity-50 rounded-xl shadow-lg backdrop-blur-md">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`max-w-xs px-4 py-3 rounded-lg text-sm shadow-md ${
              msg.sender === "Demo"
                ? "bg-purple-500 text-white self-end ml-auto rounded-br-none"
                : "bg-gray-700 text-gray-200 self-start rounded-bl-none"
            }`}
          >
            {msg.text}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={sendMessage} className="flex items-center space-x-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-gray-900 bg-opacity-70 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-md transition"
        />
        <button
          type="submit"
          className="bg-purple-600 px-4 py-2 rounded-xl flex items-center shadow-lg hover:bg-purple-700 transition-transform transform active:scale-95"
        >
          <Send size={18} className="mr-1" />
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRooms;
