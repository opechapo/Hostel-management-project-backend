const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const AdminModel = require("../models/AdminModel");

const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;
  if (
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")) ||
    req.cookies.token
  ) {
    try {
      // console.log(req.headers.authorization);

      token = req.headers?.authorization?.split(" ")[1] || req.cookies.token;
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
      //console.log(decoded)

      const foundAdmin = await AdminModel.findById(decoded.id).select(
        "-password"
      );
      if (!foundAdmin) {
        return res
          .status(401)
          .json({ message: "Unauthorized, admin not found" });
      }
      req.adminId = decoded.id;
      // Check if user still exists in the database
      // if (!req.adminId) {
      //   return res.status(401).json({ message: 'Unauthorized, user not found' });
      // }
      next();
    } catch (error) {
      console.error(error);
      return res.status(403).json({ message: "Forbidden, invalid token" });
    }
  }
  if (!token) {
    res.status(403).json({ message: "Unauthorized, token" });
  }
});

// Middleware to check if admin has admin role
module.exports = { protectAdmin };

