import React, { useState, useEffect } from "react";
import {
  User,
  MessageCircle,
  ThumbsUp,
  Edit3,
  Share2,
  UserPlus,
  Landmark,
  Earth,
  DraftingCompass,
  Puzzle,
} from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const response = await axios.get(
          `http://localhost:3000/user/details?id=${decoded.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (isLoading || !user) {
    return (
      <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-3xl shadow-2xl p-6 w-full animate-pulse">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-700 rounded-full mb-4"></div>
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500/50 to-purple-500/5 rounded-3xl shadow-2xl pt-6 lg:w-[20%] min-w-72 h-fit relative overflow-hidden">
      {/* nav */}
      <div className=" flex justify-end gap-6 px-4">
        <Link to={"/profile/"}>
          <Edit3 className="h-6 w-6 text-gray-400 hover:text-white" />
        </Link>
        <Share2 className=" h-6 w-6 text-gray-400 hover:text-white" />
      </div>

      <div className="mx-4">
        {/* Profile  */}
        <div className="relative flex items-center mb-4 gap-4">
          <div className="w-28 h-28 rounded-full shadow-lg overflow-hidden">
            {user.ProfilePicture ? (
              <img
                src={user.ProfilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-indigo-600/50 flex items-center justify-center">
                <User className="w-16 h-16 text-white/70" />
              </div>
            )}
          </div>
          <div className=" text-center flex-1">
            <span className="block text-2xl font-bold">342</span>
            <span className="text-sm text-white/70">like</span>
          </div>
          <div className=" text-center flex-1">
            <span className="block text-2xl font-bold">56</span>
            <span className="text-sm text-white/70">Friends</span>
          </div>
        </div>

        {/* User Info */}
        <div className="text-white">
          <h2 className="text-xl font-bold">
            {user.FirstName} {user.LastName}
          </h2>
          {user?.Bio && (
            <p className="text-white/80 mb-4 max-w-xs">{user.Bio}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 my-4">
          <button className="bg-white/20 hover:bg-white/30 transition-colors text-white px-6 py-2 h-10 rounded-lg flex items-center space-x-2 flex-1">
            <ThumbsUp className="w-5 h-5" />
            <span>Kudos</span>
          </button>
          <button className="bg-white/20 hover:bg-white/30 transition-colors text-white px-6 py-2 h-10 rounded-lg flex items-center space-x-2 flex-1">
            <MessageCircle className="w-5 h-5" />
            <span>Chat</span>
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 transition-colors text-white px-6 py-2 h-10 rounded-lg flex items-center space-x-2 w-full sm:w-auto text-center flex-1 text-nowrap">
            <UserPlus className="w-5 h-5" />
            <span>Add friend</span>
          </button>
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-gray-500/20 rounded-3xl p-4 space-y-4">
        {user.FieldOfStudy && (
          <div className="flex items-center gap-4 text-white/80">
            <Landmark className="h-7 w-7" />
            <div>
              <p className="text-xs">{user.University || "Field of Study"}</p>
              <p className="text-lg">
                {user.FieldOfStudy}
                {", " + user.GraduationYear || ""}
              </p>
            </div>
          </div>
        )}

        {user.OtherDetails?.skills && (
          <div className="flex items-center gap-4 text-white/80">
            <Puzzle className="h-7 w-7" />
            <div>
              <p className="text-xs">Skills</p>
              <p className="text-lg">{user.OtherDetails.skills}</p>
            </div>
          </div>
        )}
        {user.OtherDetails?.interests && (
          <div className="flex items-center gap-4 text-white/80">
            <DraftingCompass className="h-7 w-7" />
            <div>
              <p className="text-xs">Interests</p>
              <p className="text-lg">{user.OtherDetails.interests}</p>
            </div>
          </div>
        )}
        {user.Country && (
          <div className="flex items-center gap-4 text-white/80">
            <Earth className="h-7 w-7" />
            <div>
              <p className="text-xs">Country</p>
              <p className="text-lg">{user.Country}</p>
            </div>
          </div>
        )}
        {user.OtherDetails?.additionalNotes && (
          <div className="flex gap-3 text-white/80">
            <span>{user.OtherDetails.additionalNotes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
