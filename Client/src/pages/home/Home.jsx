import { Headphones } from "lucide-react";
import Calender from "./calenderComponent/CalendarComponent.jsx";
import TimerComponent from "./timerComponent/TimerComponent.jsx";
import NotesComponent from "./goalsAndNotes/NotesComponent.jsx";
import GoalsComponent from "./goalsAndNotes/GoalsComponent.jsx";
import StudyStats from "./timerComponent/TimerStats.jsx";
import NavBar from "./navBar/NavBar.jsx";
import { Link } from 'react-router-dom';

function StudyRoom() {
  return (
    <>
      <style>
        {`
          @media (max-width: 1200px) {
            .notes-goals-grid {
              grid-template-columns: repeat(1, 1fr);
            }
          }
        `}
      </style>
      <div className="m-6 space-y-4">
        <NavBar />
        <div className="flex gap-6 w-full h-auto flex-col [min-width:700px]:flex-col lg:flex-row z-0">
          <div className="flex-1 h-100 flex flex-col gap-6">
            <div className="flex bg-sec rounded-3xl shadow">
              <TimerComponent />
              <StudyStats />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 notes-goals-grid">
              <NotesComponent />
              <GoalsComponent />
            </div>
          </div>
          <Calender />
        </div>

        {/* Discussion Rooms */}
        <h1 className="text-2xl font-bold">Connect with friends</h1>
        <div className="grid grid-cols-3 gap-6">
          {["Room 1", "Room 2", "Room 3"].map((room) => (
            <div key={room} className="bg-sec p-6 rounded-3xl shadow">
              <h3 className="font-semibold mb-2">{room}</h3>
              <p className="txt-dim text-sm mb-4">4 students studying</p>
              <button className="bg-ter hover:bg-purple-700 px-4 py-2 rounded-lg w-full flex gap-3 transition-all duration-200 ease-in-out">
                <Headphones />
                <Link to="/study-room">
                  Join Room
                </Link>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default StudyRoom;
