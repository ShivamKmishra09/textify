import React, { useState,useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import { Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from '../../constants';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/mode-coffee';
import 'ace-builds/src-noconflict/mode-sass';
import 'ace-builds/src-noconflict/mode-handlebars';


import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-kuroir';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-solarized_light';

import 'ace-builds/src-noconflict/ext-language_tools'; // enable language tools
import 'ace-builds/src-noconflict/ext-beautify'; // enable beautify code



const EditPaste = (showAlert, mode) => {
  let { uid, pasteId } = useParams();
  const location = useLocation();
  const pasteData = location.state.pasteData;

  const [title, setTitle] = useState(pasteData ? pasteData.paste.title : '');
  const [content, setContent] = useState(pasteData ? pasteData.paste.content : ``);
  
  const [pastes, setPastes] = useState([]);


  const handleUpdate= async (e)  => {
    e.preventDefault();
    // Handle the create action here
    const paste = {
      title: title,
      content: content,
    };
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found");
      console.log(uid, pasteId);
      const response = await fetch( `${BACKEND_URL}/update/${uid}/${pasteId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paste),
      });

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const data = await response.json();
      setPastes([...pastes, data]);
      const url=data.url;
      window.location.href=url;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (newValue) => {
    setContent(newValue);
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
  const [expiryTime, setExpiryTime] = useState('');
  useEffect(() => {
    if (pasteData && pasteData.paste.expiry) {
      setExpiryTime(getTimeLeft(pasteData.paste.expiry));
    }
  }, [pasteData]);

  function getTimeLeft(expiryTime) {
    const currentTime = new Date();
    const expiryDate = new Date(expiryTime);
    let differenceInMinutes = (expiryDate - currentTime) / (1000 * 60);
  
    if (differenceInMinutes < 60) {
      return `${Math.round(differenceInMinutes)} {${Math.round(differenceInMinutes) === 1 ? "minute" : "minutes"}}`;
    }
  
    const hours = differenceInMinutes / 60;
    if (hours < 24) {
      return `${Math.round(hours)} {${Math.round(hours) === 1 ? "hour" : "hours"}}`;
    }
  
    const days = hours / 24;
    if (days < 7) {
      return `${Math.round(days)} {${Math.round(days) === 1 ? "day" : "days"}}`;
    }
  
    const weeks = days / 7;
    if (weeks < 4) {
      return `${Math.round(weeks)} {${Math.round(weeks) === 1 ? "week" : "weeks"}}`;
    }
  
    const months = days / 30;
    if (months < 12) {
      return `${Math.round(months)} {${Math.round(months) === 1 ? "month" : "months"}}`;
    }
  
    const years = days / 365;
    if(years < 10){
    return `${Math.round(years)} ${Math.round(years) === 1 ? "year" : "years"}`;
    }
    return "Never";
  };


  return (
    <form onSubmit={handleUpdate}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <p>{expiryTime}</p>
      <button className="mt-5" type="submit">
        Update
      </button>
      {pasteData ? (
        pasteData.paste.syntax === "text" ? (
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
        />):(
          <AceEditor
          mode={pasteData.paste.syntax}
          theme={pasteData.paste.theme}
          onChange={handleChange}
          fontSize={pasteData.paste.fontSize}
          lineHeight={pasteData.paste.lineHeight}
          showPrintMargin={true}
          showGutter={pasteData.paste.showGutter}
          highlightActiveLine={pasteData.paste.highlightActiveLine}
          placeholder="Write your code here"
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
          value={content}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 3,
          }}
        />
        )
      ) : (
        <p>Loading...</p>
      )}
      
    </form>
  );
};

export default EditPaste;