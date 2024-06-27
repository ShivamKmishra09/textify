import mongoose from "mongoose";

const pasteSchema = new mongoose.Schema({
  content: String,
  title: String,
  syntax: String,
  created_at: Date,
  expiry: {
    type: Date,
    default: Date.now,
  },
  creator: String,
  theme: String,
  fontSize: Number,
  lineHeight: Number,
  showGutter: Boolean,
  highlightActiveLine: Boolean,
});

const Paste = mongoose.model("Paste", pasteSchema, "Paste");

export default Paste;
