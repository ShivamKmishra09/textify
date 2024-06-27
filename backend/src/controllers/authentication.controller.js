import { FRONTEND_URL } from "../../constants.js";
import { User } from "../models/User.js";
import { ApiError } from "../utilities/ApiError.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || username.trim() === "")
    throw new ApiError(500, "Name is required");
  if (!email || email.trim() === "")
    throw new ApiError(501, "Email is required");
  if (!password || password.trim() === "")
    throw new ApiError(502, "Password is required");
  try {
    const existedUser = await User.findOne({
      email: email,
    });
    if (existedUser) {
      throw new ApiError(409, "Unable to create user, user already exists");
    }
    const hash = await bcrypt.hash(password, 10);
    let random_string;
    let uid_new;
    let existingUser = null;

    do {
      random_string = Math.random().toString(36).substring(2, 7);
      uid_new = random_string;
      existingUser = await User.findOne({ uid: uid_new });
    } while (existingUser);

    const user = new User({
      username: username,
      email: email,
      password: hash,
      pasteList: [],
      Urls: [],
      Viewer: [],
      uid: uid_new,
    });
    try {
      await user.save();
      res.status(201).json({
        message: "user created",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "An error occurred while creating the user",
      });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || email.trim() === "") {
    throw new ApiError(400, "Email is required");
  }
  if (!password || password.trim() === "") {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findOne({
    email: email,
  });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      throw new ApiError(401, "Invalid credentials");
    }
    if (result) {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_KEY
      );
      res.cookie("jwtToken", token, {
        sameSite: "None",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600 * 1000 * 2,
      });
      return res.status(200).send({
        message: "Auth successful",
        token: token,
        user,
      });
    }
    return res.status(401).json({
      message: "Auth failed",
    });
  });
});

export const authenticateUser = asyncHandler(async (req, res) => {
  try {
    // console.log("Starting authentication process");
    const bearerHeader = req.headers.authorization;
    if (!bearerHeader) {
      console.log("Authorization header is missing");
      return res.status(401).send({
        message: "Authorization header is missing",
      });
    }

    const token = bearerHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    if (!decodedToken || !decodedToken.userId) {
      console.log("Invalid token");
      return res.status(401).send({
        message: "Invalid token",
      });
    }

    const user = await User.findById(decodedToken.userId);
    if (!user) {
      console.log("User not found");
      return res.status(401).send({
        message: "User not found",
      });
    }
    // console.log("User authenticated successfully");
    res.status(200).json({
      user: user,
    });
  } catch (error) {
    console.log(`Authentication error: ${error.message}`);
    res.status(401).send({
      message: `Authentication error: ${error.message}`,
    });
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("jwtToken");
  res.redirect(200, `${FRONTEND_URL}`);
});
