import { User } from "../models/User.js";
import Paste from "../models/Schema.js";
import { ApiError } from "../utilities/ApiError.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { FRONTEND_URL } from "../../constants.js";
export const paste = asyncHandler(async (req, res) => {
  const { content, expiryTime } = req.body;
  // const user = await User.findById(req.userData.id);
  const user_id = req.userData.userId;
  // console.log(user_id);
  const user = await User.findById(user_id);
  if (!user) {
    console.log("User not found");
    throw new ApiError(404, "User not found");
  }
  // console.log(user);
  const newPaste = new Paste({
    title: req.body.title,
    content,
    expiry: new Date(Date.now() + expiryTime),
    syntax: req.body.syntax,
    created_at: new Date(),
    creator: user.uid,
    theme: req.body.theme,
    fontSize: req.body.fontSize,
    lineHeight: req.body.lineHeight,
    showGutter: req.body.showGutter,
    highlightActiveLine: req.body.highlightActiveLine,
  });
  // console.log(newPaste);
  let uid = user.uid;
  user.pasteList.push(newPaste);
  let randomstring;
  let new_url;
  do {
    randomstring = Math.random().toString(36).substring(2, 7);
    new_url = `${FRONTEND_URL}/${uid}/${randomstring}`;
  } while (await Paste.findOne({ url: new_url }));
  user.Urls.push(new_url);
  user.Viewer.push(0);
  // console.log(user);
  try {
    await User.updateOne(
      { _id: user_id },
      { $push: { pasteList: newPaste, Urls: new_url, Viewer: 0 } }
    );
    // await newPaste.save();
    console.log("Paste created"),
      res.status(201).json({
        message: "Paste created",
        url: new_url,
      });
  } catch (err) {
    console.log("Error saving paste", err);
    throw new ApiError(500, "Internal Server Error");
  }
});

export const getPaste = asyncHandler(async (req, res) => {
  const { uid, pasteId } = req.params;
  const user = await User.findOne({ uid: uid });
  if (!user) {
    console.log("User not found");
    throw new ApiError(404, "User not found");
  }
  const url = `${FRONTEND_URL}/${uid}/${pasteId}`;
  const pasteIndex = user.Urls.indexOf(url);
  if (pasteIndex === -1) {
    console.log("Paste not found");
    throw new ApiError(404, "Paste not found");
  }
  const paste = user.pasteList[pasteIndex];
  // Increment the view count for the paste
  user.Viewer[pasteIndex] = user.Viewer[pasteIndex] + 1;
  // Save the updated user document
  await user.save();
  res.status(200).json({
    message: "Paste retrieved successfully",
    paste: paste,
    url: url,
    views: user.Viewer[pasteIndex],
  });
});

export const editPaste = asyncHandler(async (req, res) => {
  //This code uses the $set operator with a computed property name to update the paste directly in the database. It also uses the findIndex method to find the index of the paste in the user's pasteList.
  const { uid, pasteId } = req.params;
  const { content, title } = req.body;

  // Find the user and the index of the paste in the user's pasteList
  const user = await User.findOne({ uid: uid });
  if (!user) {
    console.log("User not found");
    throw new ApiError(404, "User not found");
  }
  const url = `${FRONTEND_URL}/${uid}/${pasteId}`;
  const pasteIndex = user.Urls.indexOf(url);
  if (pasteIndex === -1) {
    console.log("Paste not found");
    throw new ApiError(404, "Paste not found");
  }

  // Update the paste directly in the database
  const update = {
    [`pasteList.${pasteIndex}.content`]: content,
    [`pasteList.${pasteIndex}.title`]: title,
  };

  try {
    await User.updateOne({ _id: user._id }, { $set: update });
    res.status(201).json({
      message: "Paste updated",
      url: `${FRONTEND_URL}/${uid}/${pasteId}`,
    });
  } catch (err) {
    console.error("Error updating paste", err);
    throw new ApiError(500, "Internal Server Error");
  }
});

export const getUserDetails = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const user = await User.findOne({ uid: uid });
  if (!user) {
    console.log("User not found");
    throw new ApiError(404, "User not found");
  }

  const userDetails = {
    username: user.username,
    email: user.email,
    pasteUrls: user.Urls,
    viewerCounts: user.Viewer,
  };

  res.status(200).json({
    message: "User details retrieved successfully",
    userDetails: userDetails,
  });
});
