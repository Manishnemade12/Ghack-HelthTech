import jwt from 'jsonwebtoken';

const generateAuthToken = (user) => {
  return jwt.sign({ id: user._id, fullName: user.FullName }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export default generateAuthToken;
