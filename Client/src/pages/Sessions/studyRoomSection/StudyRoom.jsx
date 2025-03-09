import { useState } from "react";
import {
  PlusCircle,
  Activity,
  CheckCircle,
  MoreHorizontal,
} from "lucide-react";
import CreateRoomModal from "./CreateRoomModal";

function StudyRoom() {
  const [sessions, setSessions] = useState([
    { id: 1, name: "Room 1", students: 4, hasJoined: false, pinned: false },
    { id: 2, name: "Room 2", students: 4, hasJoined: false, pinned: false },
    { id: 3, name: "Room 3", students: 4, hasJoined: false, pinned: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  // Track which room's menu is open (by room id)
  const [activeRoomMenu, setActiveRoomMenu] = useState(null);

  // Handler for creating a new room.
  const handleCreateRoom = (newRoomName) => {
    const newRoom = {
      id: sessions.length + 1,
      name: newRoomName,
      students: 0, // New rooms start with 0 students.
      hasJoined: false,
      pinned: false,
    };
    setSessions([...sessions, newRoom]);
  };

  // Handler for joining a room.
  const handleJoinRoom = (roomId) => {
    setSessions(
      sessions.map((room) =>
        room.id === roomId && !room.hasJoined
          ? { ...room, students: room.students + 1, hasJoined: true }
          : room
      )
    );
  };

  // Toggle pin status for a room.
  const handlePinRoom = (roomId) => {
    setSessions(
      sessions.map((room) =>
        room.id === roomId ? { ...room, pinned: !room.pinned } : room
      )
    );
    setActiveRoomMenu(null);
  };

  // Delete a room.
  const handleDeleteRoom = (roomId) => {
    setSessions(sessions.filter((room) => room.id !== roomId));
    setActiveRoomMenu(null);
  };

  // Filter rooms by search term.
  const filteredSessions = sessions.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort rooms based on sortOption.
  let sortedSessions = [...filteredSessions];
  if (sortOption === "name") {
    sortedSessions.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === "studentsAsc") {
    sortedSessions.sort((a, b) => a.students - b.students);
  } else if (sortOption === "studentsDesc") {
    sortedSessions.sort((a, b) => b.students - a.students);
  }

  return (
    <div className="flex-1">
      {/* Navbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold txt mb-4 sm:mb-0">
          Study Room
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search rooms..."
              className="px-4 py-2 rounded-lg bg-sec txt placeholder:txt-dim  focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 rounded-lg bg-sec txt  focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="default">Sort by</option>
              <option value="name">Name (A-Z)</option>
              <option value="studentsAsc">Students (Low to High)</option>
              <option value="studentsDesc">Students (High to Low)</option>
            </select>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 btn px-6 py-2.5 rounded-xl transition-colors"
          >
            <PlusCircle className="w-6 h-6" />
            <span>Create Room</span>
          </button>
        </div>
      </div>

      {/* Room Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSessions.map((room) => (
          <div
            key={room.id}
            className="relative bg-sec backdrop-blur-md p-6 rounded-3xl shadow "
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold txt">
                  {room.name}
                </h3>
                {room.pinned && (
                  <span className="text-xs txt-dim bg-sec px-2 py-0.5 rounded-full">
                    Pinned
                  </span>
                )}
              </div>
              {/* 3 dots button */}
              <button
                onClick={() =>
                  setActiveRoomMenu((prev) =>
                    prev === room.id ? null : room.id
                  )
                }
                className="txt hover:txt-dim"
              >
                <MoreHorizontal className="w-6 h-6" />
              </button>
              {/* Dropdown Menu */}
              {activeRoomMenu === room.id && (
                <div
                  className="absolute right-4 top-12 bg-sec rounded-lg shadow-md z-10"
                >
                  <button
                    onClick={() => handlePinRoom(room.id)}
                    className="block w-full text-left px-4 py-3 text-sm txt hover:bg-ter"
                  >
                    {room.pinned
                      ? "Unpin from homepage"
                      : "Pin to homepage"}
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="block w-full text-left px-4 py-2 text-sm txt-dim hover:bg-ter"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <p className="txt-dim mb-4">
              <span className="font-medium">{room.students}</span> student
              {room.students !== 1 ? "s" : ""} studying
            </p>
            {room.hasJoined ? (
              <button
                className="w-full bg-sec txt-disabled px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-default"
                disabled
              >
                <CheckCircle className="w-5 h-5" />
                Joined
              </button>
            ) : (
              <button
                onClick={() => handleJoinRoom(room.id)}
                className="w-full btn px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Activity className="w-5 h-5" />
                Join
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateRoom}
      />
    </div>
  );
}

export default StudyRoom;
