import ProfileCard from "./ProfileCard";
import MonthlyLevel from "./MonthlyLevel";
import Achievements from "./Achievements";
import Badges from "./Badges";
import StudyStats from "./StudyStats";
import Goals from "./Goals";
import Leaderboard from "./Leaderboard";
import Test from "./Test.jsx";

const Stats = () => {
  return (
    <div className="m-6 ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Anaylitics</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Great! keep it up</span>
        </div>
      </div>
      {/* content */}
      <div className="flex flex-col lg:flex-row gap-6 w-full content-center">
        <ProfileCard />
        <div className="flex-1">
          <div className="mb-6">
            <StudyStats />
          </div>
          <div className="flex flex-col xl:flex-col 2xl:flex-row">
            <div className="flex-1 mr-6">
              <div className="flex gap-6 mb-6">
                <MonthlyLevel />
                <Badges />
              </div>
              <div className=" gap-6 mb-6 ">
                <Goals />
              </div>
            </div>
            <div>
              <Achievements />
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>
      <Test />
    </div>
  );
};

export default Stats;
