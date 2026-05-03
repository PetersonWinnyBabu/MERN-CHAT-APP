import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { adminSecretKey } from "../app.js";
import { tryCatch } from "./error.js";
import { User } from "../models/user.js";

const isAuthenticated = tryCatch((req, res, next) => {
  const token = req.cookies["auth_token"];

  if (!token)
    return next(new ErrorHandler("Please Login to access this route", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decodedData._id;

  console.log(decodedData);

  next();
});

const adminOnly = (req, res, next) => {
  const token = req.cookies["auth_admin_token"];

  if (!token)
    return next(new ErrorHandler("Only Admin can Access this Route", 401));

  const secretKey = jwt.verify(token, process.env.JWT_SECRET);

  const isMatched = secretKey === adminSecretKey;

  if (!isMatched) return next(new ErrorHandler("Invalid Admin Key", 401));

  next();
};

const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);
    const authToken = socket.request.cookies["auth_token"];
    if (!authToken)
      return next(new ErrorHandler("Please Login to access this route", 401));

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User.findById(decodedData._id);

    console.log(user);

    if (!user)
      return next(new ErrorHandler("Please Login to access this route", 404));

    socket.user = user;

    // socket.user = await User.findById(decodedData._id);
    return next();
  } catch (err) {
    console.log(err);
    return next(new ErrorHandler("Please Login to access this route", 401));
  }
};

export { isAuthenticated, adminOnly, socketAuthenticator };
