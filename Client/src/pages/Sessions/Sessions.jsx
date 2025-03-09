import { useState } from "react";
import StudyRoom from "./studyRoomSection/StudyRoom.jsx";
import OnlineFriends from "./friendsSection/OnlineFriends.jsx";
import FriendRequests from "./friendsSection/FriendsRequests.jsx";
import SuggestedFriends from "./friendsSection/SuggestedFriends.jsx";
import SentRequests from "./friendsSection/SentRequests";

function Session() {
  const [view, setView] = useState("suggested");
  return (
    <div className="h-[100vh] p-6 pb-0 flex gap-6">
      <StudyRoom />
      <aside className="w-[20%] overflow-scroll min-w-72 pr-1 space-y-6">
        <OnlineFriends />
        <FriendRequests />
        {view === "suggested" ? (
        <SuggestedFriends onViewSentRequests={() => setView("sent")} />
      ) : (
        <SentRequests onBack={() => setView("suggested")} />
      )}
      </aside>
    </div>
  );
}

export default Session;
