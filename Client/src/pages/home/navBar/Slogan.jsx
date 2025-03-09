import { useState, useEffect } from "react";

function Slogan() {
  const [quote, setQuote] = useState("Stay hungry; stay foolish.");
  const [displayMode, setDisplayMode] = useState("quote");
  const [username, setUsername] = useState("User");

  // Fetch the username from the backend
  const fetchUsername = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:3000/user/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsername(data.username || "User");
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  // Determine greeting based on current time.
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${username}`;
    else if (hour < 18) return `Good afternoon, ${username}`;
    else return `Good evening, ${username}`;
  };

  const fetchQuote = async () => {
    try {
      const response = await fetch("https://api.quotable.io/random");
      if (response.ok) {
        const data = await response.json();
        return `${data.content} — ${data.author}`;
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
    return "Stay hungry; stay foolish.";
  };

  useEffect(() => {
    const today = new Date().toDateString();
    const cachedQuote = localStorage.getItem("dailyQuote");
    const cachedDate = localStorage.getItem("quoteDate");

    if (cachedQuote && cachedDate === today) {
      setQuote(cachedQuote);
    } else {
      fetchQuote().then((fetchedQuote) => {
        setQuote(fetchedQuote);
        localStorage.setItem("dailyQuote", fetchedQuote);
        localStorage.setItem("quoteDate", today);
      });
    }

    fetchUsername();
  }, []);

  useEffect(() => {
    // quote: 1 hr, greeting: 30 min
    const duration = displayMode === "quote" ? 3600000 : 1800000;

    const timer = setTimeout(() => {
      setDisplayMode((prev) => (prev === "quote" ? "greeting" : "quote"));
    }, duration);

    return () => clearTimeout(timer);
  }, [displayMode]);

  return (
    <div className="slogan text-2xl font-semibold txt">
      {displayMode === "quote" ? quote : getGreeting()}
    </div>
  );
}

export default Slogan;
