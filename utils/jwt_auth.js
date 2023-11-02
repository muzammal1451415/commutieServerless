const jwt = require('jsonwebtoken');
const secretKey = 'ljhsjdf083jfsdnj803lnkdsf8u034lnkfdlkj2oi'; // Replace with your own secret key

// Function to generate a JWT token
function generateToken(email, password) {
  const payload = { email, password };
  return jwt.sign(payload, secretKey, { expiresIn: '1000h' });
}

// Function to generate a JWT token
function generateToken(email) {
    const payload = { email};
    return jwt.sign(payload, secretKey, { expiresIn: '1000h' });
  }

// Function to verify a JWT token and return email and password
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
