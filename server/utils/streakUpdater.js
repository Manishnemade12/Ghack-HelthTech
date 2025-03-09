import User from '../Model/UserModel.js'
export const updateStreaks = async (userId) => {
  const user = await User.findById(userId);
  if (!user.streaks) {
    user.streaks = { current: 0, max: 0, lastStudyDate: null };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let lastStudyDay = user.streaks.lastStudyDate
    ? new Date(user.streaks.lastStudyDate)
    : null;

  if (lastStudyDay) {
    lastStudyDay.setHours(0, 0, 0, 0);
  }

  if (!lastStudyDay || today - lastStudyDay > 86400000) {
    user.streaks.current = 1;
  } else if (today - lastStudyDay < 86400000) {
    return;
  }
  if (user.streaks.current > user.streaks.max) {
    user.streaks.max = user.streaks.current;
  }
  user.streaks.lastStudyDate = new Date();
  await user.save();
};
