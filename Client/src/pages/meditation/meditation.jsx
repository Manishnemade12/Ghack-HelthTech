import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlay, FaRandom, FaThumbsUp, FaComments, FaMoon, FaSun } from "react-icons/fa";

const videos = [
  "https://youtube.com/embed/DulNz2CkoHI?si=KFTdZ0giSnyYtpyU",
  "https://youtube.com/embed/inpok4MKVLM?si=StsWrMnxADygaxSr",
  "https://youtube.com/embed/ZToicYcHIOU"
];

const Motivation = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [videoSrc, setVideoSrc] = useState(videos[0]);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showMeditation, setShowMeditation] = useState(false);

  const handleShowVideo = () => {
    setLoading(true);
    setTimeout(() => {
      setShowVideo(true);
      setLoading(false);
    }, 1000);
  };

  const changeVideo = () => {
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    setVideoSrc(randomVideo);
    setShowVideo(false);
  };

  const addComment = () => {
    if (comment.trim() !== "") {
      setComments([...comments, comment]);
      setComment("");
    }
  };

  return (
    <div className={`${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-900"
    } min-h-screen flex flex-col items-center justify-center p-6 w-full`}>

      <button onClick={() => setDarkMode(!darkMode)} className="absolute top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-full">
        {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl w-full p-8 rounded-xl shadow-xl text-center bg-white dark:bg-gray-800">
        <h2 className="text-4xl font-bold mb-6">🌿 Meditation Video Player</h2>

        <motion.button onClick={() => setShowMeditation(!showMeditation)} className="mb-6 px-8 py-4 bg-indigo-500 text-white rounded-lg">
          {showMeditation ? "Hide Meditation Room" : "Show Meditation Room"}
        </motion.button>

        {showMeditation && <Meditation />}

        {!showVideo ? (
          <div className="flex flex-col gap-6">
            <motion.button onClick={handleShowVideo} className="px-8 py-4 bg-blue-500 text-white rounded-lg">
              {loading ? "Loading..." : <FaPlay />} Play Video
            </motion.button>
            <motion.button onClick={changeVideo} className="px-8 py-4 bg-green-500 text-white rounded-lg">
              <FaRandom /> Random Video
            </motion.button>
          </div>
        ) : (
          <motion.div className="rounded-lg overflow-hidden border-2 border-gray-300 mt-6 w-full">
            <iframe className="w-full h-[500px] rounded-lg" src={videoSrc} title="YouTube Video" frameBorder="0" allowFullScreen></iframe>
          </motion.div>
        )}

        <div className="mt-6 flex justify-center space-x-6">
          <motion.button onClick={() => setLikeCount(likeCount + 1)} className="px-6 py-3 bg-red-500 text-white rounded-lg">
            <FaThumbsUp /> Like ({likeCount})
          </motion.button>
        </div>

        <div className="mt-6 text-left w-full">
          <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." className="w-full p-4 border rounded-lg text-black" />
          <motion.button onClick={addComment} className="mt-4 px-6 py-3 bg-yellow-500 text-white rounded-lg">
            <FaComments /> Comment
          </motion.button>
        </div>

        <div className="mt-6 text-left w-full">
          {comments.map((c, index) => (
            <motion.p key={index} className="mt-3 bg-gray-200 p-4 rounded-lg dark:bg-gray-700">
              {c}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const Meditation = () => {
  return (
    <div className="mt-6 p-6 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🧘 Meditation Room</h1>
      <p className="mt-3 text-gray-700 dark:text-gray-300">Relax, take a deep breath, and enjoy the peaceful environment.</p>
    </div>
  );
};

export default Motivation;
