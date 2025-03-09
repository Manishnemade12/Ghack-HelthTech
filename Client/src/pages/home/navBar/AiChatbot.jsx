import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { BotMessageSquare, X, ArrowUp, Loader, Spline } from "lucide-react";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const apikey = "AIzaSyBPuUC9dW_uIqC8q9wsSE1zKjgUJR62XxE";

// Variants for the chat panel
const panelVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

// Variants for each chat message
const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
};

const Ai = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 350, height: 500 });
  const resizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startDimensions = useRef({ width: 350, height: 500 });

  useEffect(() => {
    const modalEl = document.getElementById("my_modal_1");
    if (modalEl) {
      modalEl.showModal = () => setIsChatOpen(true);
      modalEl.close = () => {
        setIsChatOpen(false);
        setMessages([]); // Clear messages on close
      };
    }
  }, []);

  const generateQuestion = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setLoading(true);
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMessage = { type: "user", text: question, time: currentTime };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apikey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: question }],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (data && data.candidates && data.candidates.length > 0) {
        const generatedResponse =
          data.candidates[0]?.content?.parts[0]?.text || "No response found";
        const aiMessage = {
          type: "ai",
          text: generatedResponse,
          time: currentTime,
        };
        setMessages((prev) => [...prev, aiMessage]);
        toast.success("Response generated successfully!");
      } else {
        toast.error("No response from AI model");
      }
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Failed to generate response");
    } finally {
      setLoading(false);
      setQuestion(""); // Clear input field
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      generateQuestion();
    }
  };

  const closeModal = () => {
    setMessages([]); // Clear messages when modal is closed
    setIsChatOpen(false);
  };

  // --- Resizable functionality from the top-left corner ---
  const handleMouseDown = (e) => {
    resizing.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    startDimensions.current = { ...dimensions };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!resizing.current) return;
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    const newWidth = Math.min(
      Math.max(startDimensions.current.width - deltaX, 300),
      window.innerWidth * 0.96
    );
    const newHeight = Math.min(
      Math.max(startDimensions.current.height - deltaY, 400),
      window.innerHeight * 0.94
    );
    setDimensions({ width: newWidth, height: newHeight });
  };

  const handleMouseUp = () => {
    resizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  // --- End resizable functionality ---

  return (
    <div id="manishai">
      {/* Ask AI Button */}
      <button
        className="flex gap-3 btn shadow-[0_4px_100px_rgba(176,71,255,0.7)] px-5 py-2.5 font-semibold transition duration-200 transform hover:scale-105 ml-9 hover:shadow-[0_4px_100px_rgba(176,71,255,1)]"
        onClick={() => {
          const modalEl = document.getElementById("my_modal_1");
          modalEl && modalEl.showModal();
        }}
      >
        <BotMessageSquare />
        Ask AI
      </button>

      {/* Chat Panel */}
      <motion.div
        id="my_modal_1"
        variants={panelVariants}
        initial="hidden"
        animate={isChatOpen ? "visible" : "hidden"}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 50,
          pointerEvents: isChatOpen ? "auto" : "none",
          width: dimensions.width,
          height: dimensions.height,
        }}
      >
        <div className="bg-primary rounded-3xl w-full h-full txt flex flex-col overflow-hidden relative shadow-2xl shadow-purple-800/50">
          {/* Resizer handle using the Spline icon */}
          <div
            onMouseDown={handleMouseDown}
            className="absolute top-0 left-0 p-2 cursor-nw-resize z-50"
          >
            <Spline className="w-5 h-5 txt-dim" />
          </div>

          {/* Nav-bar */}
          <div
            className="flex justify-between items-center px-2 py-0.5 border-b"
            style={{ borderColor: "var(--bg-sec)" }}
          >
            <h3 className="text-lg txt-dim font-semibold pl-8">Ask AI</h3>
            <button
              onClick={closeModal}
              className="hover:txt transition p-2 txt-dim"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Chat area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-lg font-medium text-center">
                  Hey! Welcome to{" "}
                  <span style={{ color: "var(--btn)" }}>EduHaven AI</span>
                  <br />
                  How can I help you today?
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex flex-col ${
                    msg.type === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <p
                    className={`py-2 px-4 rounded-lg ${
                      msg.type === "user" ? "bg-sec txt" : "bg-transparent txt"
                    }`}
                  >
                    {msg.text}
                  </p>
                  <span className="text-sm txt-dim mt-1">{msg.time}</span>
                </motion.div>
              ))
            )}
          </div>

          {/* Input area */}
          <div
            className="p-1 border rounded-full flex"
            style={{ borderColor: "var(--bg-sec)" }}
          >
            <div className="flex-1">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Eduhaven AI..."
                className="w-full p-3 rounded-full outline-none bg-transparent focus:ring-2 focus:ring-transparent"
              />
            </div>
            <button
              onClick={generateQuestion}
              className={`txt font-bold p-3 rounded-full transition-all shadow-[0_4px_20px_rgba(176,71,255,0.3)] hover:shadow-[0_4px_70px_rgba(176,71,255,0.4)] ${
                loading
                  ? "bg-sec cursor-not-allowed"
                  : "btn hover:bg-[var(--btn-hover)]"
              }`}
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" /> : <ArrowUp />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Ai;
