import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    ProfilePicture: { type: String },
    Bio: { type: String, maxlength: 500 },
    Gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
    },
    University: { type: String },
    Country: { type: String },
    FieldOfStudy: { type: String },
    GraduationYear: { type: Number, min: 1900, max: 2100 },
    OtherDetails: { type: mongoose.Schema.Types.Mixed },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    sentRequests:[{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    streaks: {
      current: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      lastStudyDate: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
