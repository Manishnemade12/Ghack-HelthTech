import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock12, PlayCircle, RotateCcw } from "lucide-react";
import AnimatedDigits from "./AnimatedDigits";

// Study Timer Component (Connected to the backend)
function StudyTimer() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState("");

  const handlePostSession = async (endTimestamp) => {
    const totalMinutes = time.hours * 60 + time.minutes + time.seconds / 60;
    console.log(totalMinutes);
    if (totalMinutes < 1) {
      console.log(
        "Timer needs to be at least 1 minute long to save in database."
      );
      return;
    }

    const sessionData = {
      startTime,
      endTime: endTimestamp,
      duration: Math.round(totalMinutes),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/timer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sessionData),
      });
      const result = await response.json();
      console.log("Session Saved:", result);
    } catch (error) {
      console.log("Error saving timer", error);
    }
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => {
          let newSeconds = prev.seconds + 1;
          let newMinutes = prev.minutes;
          let newHours = prev.hours;

          if (newSeconds === 60) {
            newMinutes++;
            newSeconds = 0;
          }
          if (newMinutes === 60) {
            newHours++;
            newMinutes = 0;
          }

          return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartPause = () => {
    if (!isRunning) {
      const formattedTime = new Date().toISOString();
      setStartTime((prev) => (prev ? prev : formattedTime));
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = async () => {
    if (time.hours !== 0 || time.minutes !== 0 || time.seconds !== 0) {
      const formattedEndTime = new Date().toISOString();
      await handlePostSession(formattedEndTime);
    }
    setIsRunning(false);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setStartTime("");
  };

  return (
    <div className="text-center flex flex-col items-center justify-center h-full">
      {/* Timer Display with animated individual digits */}
      <div className="text-6xl font-bold mb-4">
        <div className="flex items-center gap-1">
          <AnimatedDigits value={String(time.hours).padStart(2, "0")} />
          <p className="text-gray-400 pb-3">:</p>
          <AnimatedDigits value={String(time.minutes).padStart(2, "0")} />
          <p className="text-gray-400 pb-3">:</p>
          <AnimatedDigits value={String(time.seconds).padStart(2, "0")} />
        </div>
      </div>
      <div className="flex gap-4 justify-center mt-4">
        <motion.button
          onClick={handleStartPause}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`relative px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300 ease-in-out ${
            isRunning
              ? "bg-black/20 hover:bg-black/30"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          <span
            className={`flex items-center gap-2 transition-opacity duration-300 ${
              isRunning ? "opacity-0" : "opacity-100"
            }`}
          >
            <PlayCircle className="w-5 h-5" />
            <span>Start Studying</span>
          </span>
          <span
            className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-300 ${
              isRunning ? "opacity-100" : "opacity-0"
            }`}
          >
            <Clock12 className="w-5 h-5 animate-spin" />
            <span>Pause</span>
          </span>
        </motion.button>
        <motion.button
          onClick={handleReset}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="hover:bg-red-700 p-2 rounded-lg flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

export default StudyTimer;
