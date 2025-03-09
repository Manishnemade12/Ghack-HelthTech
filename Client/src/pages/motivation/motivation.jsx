import React from "react";
import { FaSadTear, FaBrain, FaTired, FaAngry } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const motivationData = {
  Sad: [
    "Listen to your favorite music and dance! 🎵",
    "Spend time with loved ones ❤️",
    "Write down 3 things you're grateful for ✨",
    "Take a walk outside 🌿",
    "Watch a comedy show and laugh 😂",
    "Try meditation for 5 minutes 🧘",
    "Read an inspiring book 📖",
    "Express your feelings to a friend ☎️",
    "Do something creative 🎨",
    "Help someone in need 💖"
  ],
  Overthinking: [
    "Write your thoughts down and let go ✍️",
    "Take deep breaths 🌿",
    "Exercise to distract your mind 🏃",
    "Most worries never come true 💭",
    "Talk to a friend ☕",
    "Practice mindfulness 🧘",
    "Learn something new 🚀",
    "Limit social media 📵",
    "Break big problems into steps 📋",
    "Read a positive quote ✨"
  ],
  Demotivated: [
    "Remember why you started 💪",
    "Watch a success story 🎥",
    "Set small goals 🎯",
    "Surround yourself with positivity 😊",
    "Take a break ⏳",
    "Read quotes from successful people 📖",
    "Change your routine 🔄",
    "Visualize success 🎭",
    "Take one small step today 🏁",
    "You are stronger than you think ⭐"
  ],
  Angry: [
    "Take deep breaths and count to 10 😌",
    "Go for a walk 🚶",
    "Write down your feelings ✍️",
    "Listen to calming music 🎶",
    "Think before reacting 🤔",
    "Watch something funny 😂",
    "Drink water and relax 💦",
    "Engage in physical activity 🏃",
    "Meditate for a few minutes 🧘",
    "Peace is more powerful than anger ☮️"
  ]
};

const emotions = [
  { name: "Sad", icon: <FaSadTear /> },
  { name: "Overthinking", icon: <FaBrain /> },
  { name: "Demotivated", icon: <FaTired /> },
  { name: "Angry", icon: <FaAngry /> }
];

const Motivation = () => {
  const navigate = useNavigate();

  const handleSelection = (feeling) => {
    const randomSuggestion = motivationData[feeling][Math.floor(Math.random() * motivationData[feeling].length)];
    navigate("/result", { state: { feeling, suggestion: randomSuggestion } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 p-6">
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-bold text-white mb-6">
        How do you feel?
      </motion.h2>
      <div className="grid grid-cols-2 gap-6">
        {emotions.map(({ name, icon }) => (
          <motion.button
            key={name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center p-6 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition"
            onClick={() => handleSelection(name)}
          >
            <span className="text-4xl mb-2">{icon}</span>
            {name}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Motivation;
