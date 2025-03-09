import { useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import { Plus } from "lucide-react";
import "react-calendar/dist/Calendar.css";
import "./ReactCustomCalendar.css";

const Setgoals = ({ onGoalCreated }) => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState(null);
  // New states for the dropdown options
  const [time, setTime] = useState("21:00");
  const [reminder, setReminder] = useState("On the day (9:00)");
  const [repeat, setRepeat] = useState("Daily");

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }
    try {
      // Use the selected deadline if available; otherwise, default to now
      const dueDate = deadline
        ? deadline.toISOString()
        : new Date().toISOString();
      const { data } = await axios.post(
        "http://localhost:3000/todo",
        {
          title,
          completed: false,
          dueDate,
          // Optionally pass the new dropdown values to the backend:
          // time,
          // reminder,
          // repeat,
        },
        getAuthHeader()
      );
      // Clear the input fields after creation
      setTitle("");
      setDeadline(null);
      // Inform the parent component about the new goal
      if (onGoalCreated) {
        onGoalCreated(data.data);
      }
    } catch (error) {
      console.error("Error creating goal:", error.message);
    }
  };

  // Ensure the Enter key doesn't get intercepted
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <div
      className={`px-4 pt-2 rounded-xl ${
        title.trim() !== "" ? "bg-ter shadow" : ""
      }`}
      style={{ containerType: "inline-size" }}
    >
      <div className="flex items-center px-2">
        <input
          type="text"
          placeholder="Type a goal..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus
          className="w-full bg-transparent border-b border-txt-dim txt-dim py-2 px-2 focus:outline-none"
        />
        <button onClick={handleCreate} className="txt ml-2">
          <Plus />
        </button>
      </div>
      {/* Render when there's some text in the input */}
      {title.trim() !== "" && (
        <>
          <p className="text-red-400">
            Currenty only calender is functional.
          </p>
          <div className="mt-3 mb-4 flex gap-6 [@container(max-width:420px)]:flex-col">
            <div className="flex-1">
              {/* Repeat Dropdown */}
              <div className="mb-4 [@container(max-width:420px)]:flex gap-12 items-center">
                <label className="block font-semibold mb-1">Repeat:</label>
                <select
                  className="bg-ter rounded-lg p-2 w-full txt border border-txt-dim"
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value)}
                >
                  {["Never", "Daily", "Weekly", "Monthly", "Yearly"].map(
                    (r) => (
                      <option
                        key={r}
                        value={r}
                        className="txt bg-sec"
                      >
                        {r}
                      </option>
                    )
                  )}
                </select>
              </div>
              {/* Time Dropdown */}
              <div className="mb-4 [@container(max-width:420px)]:flex gap-16 items-center">
                <label className="block font-semibold mb-1">Time:</label>
                <select
                  className="bg-ter rounded-lg p-2 w-full txt border border-txt-dim"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                >
                  {[
                    "20:30",
                    "21:00",
                    "21:30",
                    "22:00",
                    "22:30",
                    "23:00",
                    "23:30",
                  ].map((t) => (
                    <option
                      key={t}
                      value={t}
                      className="txt bg-sec"
                    >
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              {/* Reminder Dropdown */}
              <div className="[@container(max-width:420px)]:flex gap-7 items-center">
                <label className="block font-semibold mb-1">Reminder:</label>
                <select
                  className="bg-ter rounded-lg p-2 w-full txt border border-txt-dim"
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                >
                  {[
                    "On the day (9:00)",
                    "1 day early (9:00)",
                    "2 days early (9:00)",
                    "3 days early (9:00)",
                    "7 days early (9:00)",
                    "On the day (5:00)",
                  ].map((r) => (
                    <option
                      key={r}
                      value={r}
                      className="txt bg-sec"
                    >
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="max-w-fit rounded-lg m-auto">
              <h1 className="font-semibold text-md">Add deadline:</h1>
              <Calendar
                onChange={(date) => setDeadline(date)}
                value={deadline || new Date()}
                next2Label={null}
                prev2Label={null}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Setgoals;
