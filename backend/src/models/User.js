import mongoose from "mongoose";
import { Paste } from "./Schema";
const userSchema = mongoose.Schema({
  username: {
    type: String,
    default: "Unkonwn",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    default: "Example@email.com",
  },
  password: {
    type: String,
    required: true,
    default: "123456",
  },
  uid: {
    type: String,
    default: "abc123",
  },
  pasteList: {
    type: [Paste],
    default: null,
  },
  Urls: {
    type: [String],
    default: null,
  },
  Viewer: {
    type: [Number],
    default: null,
  },
});

export const User = mongoose.model("User", userSchema);
