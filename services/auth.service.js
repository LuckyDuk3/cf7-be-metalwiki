const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles || []
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
  generateAccessToken,
  hashPassword,
  comparePassword,
};
