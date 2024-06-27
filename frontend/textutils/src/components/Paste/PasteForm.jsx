import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function PasteForm ({  showAlert, mode, toggleMode })  {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pastes, setPastes] = useState([]);

  const handleCreate = async (paste) => {
    window.location.href = "/login";
  };

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction
      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ color: [] }, { background: [] }], // dropdown with defaults
      [{ font: [] }],
      [{ align: [] }],
      ["clean"], // remove formatting
    ],
  };
  const handleChange = (content, delta, source, editor) => {
    setContent(content);
  };

  // const handleSubmit = (event) => {
  //   console.log(onCreate);
  //   event.preventDefault();
  //   onCreate({ title, content });
  // };

  return (
    <form onSubmit={handleCreate}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <button className="mt-5" type="submit">
        Create
      </button>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleChange}
        modules={modules}
        spellCheck={true}
        style={{
          backgroundColor: mode === `dark` ? `black` : `lightgray`,
          color: mode === `dark` ? `white` : `black`,
          // fontFamily: font,
          height: "200px", // Set a fixed height
        }}
      />
    </form>
  );
};

export default PasteForm;
