//How to generate cookies

const jwt = require('jsonwebtoken');

  const generateToken = (id) => {
    const token = jwt.sign({ id }, process.env.ACCESS_TOKEN, { expiresIn: '1d' });
    return token;
  }
  module.exports = generateToken;