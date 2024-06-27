import React, { useState,useEffect,useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { BACKEND_URL } from '../../../constants';
// import Code from "../Code";
// import ace from 'ace-builds/src-noconflict/ace';
// ace.config.set('basePath', '/path/to/ace');
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


function PasteForm ({  showAlert, mode, toggleMode })  {
  const JSCode = ``;
  const quillRef = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(JSCode);
  const [pastes, setPastes] = useState([]);
  const [user, setUser] = useState(null);
  const [expiryTime, setExpiryTime] = useState('43200');
  const [syntax, setSyntax] = useState("text");
  const [textMode, setMode] = useState('text'); 
  const [theme, setTheme] = useState('monokai');
  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(24);
  const [showGutter, setShowGutter] = useState(true);
  const [highlightActiveLine, setHighlightActiveLine] = useState(true);

  const toggleTextMode = () => {
    setMode(prevMode => prevMode === 'text' ? 'dev' : 'text');
    setSyntax(prevSyntax => prevSyntax === 'text' ? 'javascript' : 'text');
    console.log(syntax);
  };

  
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("No token found");

        const response = await axios.get(`${BACKEND_URL}/authenticate`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUser(response.data.user);
        } else {
          throw new Error("Not authenticated");
        }
      } catch (err) {
        console.log(err);
        window.location.href = "/login";
      }
    };
    authenticateUser();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    const expiryTimeInMilliseconds = expiryTime * 60 * 1000;
    const htmlContent = quillRef.current.getEditor().root.innerHTML;

    const paste = {
      title: title,
      content: htmlContent,
      created_at: new Date(),
      syntax: syntax,
      expiryTime: expiryTimeInMilliseconds,
      theme: theme,
      fontSize: fontSize,
      lineHeight: lineHeight,
      showGutter: showGutter,
      highlightActiveLine: highlightActiveLine,
      
    };
    setExpiryTime(expiryTimeInMilliseconds);
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found");
      const response = await fetch( `${BACKEND_URL}/loggedin/${user._id}/paste`, {
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
  const handleChange = (newValue) => {
    setContent(newValue);
  };

  
  return (
    <form onSubmit={handleCreate}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        />
      

      <select onChange={(e) => setExpiryTime(e.target.value)} required>
        {/* <option value="">Choose expiry time</option> */}
        <option value="43200">1 Month</option>
        <option value="0">One Time</option>
        <option value="1">1 Minute</option>
        <option value="60">1 Hour</option>
        <option value="1440">1 Day</option>
        <option value="10080">1 Week</option>
        <option value="525600">1 Year</option>
        <option value="999999999">Never</option>
        
      </select>
      
      <button className="mt-5" type="submit">
        Create
      </button>
      <div>
      <button onClick={toggleTextMode}>
        Switch to {textMode === 'text' ? 'Dev' : 'Text'} Mode
      </button>
      {textMode === 'text' ? (
      <ReactQuill
        theme="snow"
        ref={quillRef}
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
        <div className="App">
          
      <h3>Code Editor</h3>
      <form>
        <label>
          Language:
          <select value={syntax} onChange={(e) => setSyntax(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="mysql">MySQL</option>
            <option value="ruby">Ruby</option>
            <option value="json">JSON</option>
            <option value="xml">XML</option>
            <option value="markdown">Markdown</option>
            <option value="csharp">C#</option>
            <option value="golang">Go</option>
            <option value="coffee">CoffeeScript</option>
            <option value="sass">Sass</option>
            <option value="handlebars">Handlebars</option>

          </select>
        </label>
        <label>
          Theme:
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="monokai">Monokai</option>
            <option value="github">GitHub</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="terminal">Terminal</option>
            <option value="kuroir">Kuroir</option>
            <option value="twilight">Twilight</option>
            <option value="xcode">XCode</option>
            <option value="textmate">TextMate</option>
            <option value="solarized_dark">Solarized Dark</option>
            <option value="solarized_light">Solarized Light</option>
          </select>
        </label>
        <label>
          Font Size:
          <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}>
            <option value={14}>14</option>
            <option value={18}>18</option>
            <option value={22}>24</option>
            <option value={28}>28</option>
            <option value={32}>32</option>
            <option value={40}>40</option>
            {/* Add more options as needed */}
          </select>
        </label>
        <label>
          Line Height:
          <select value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))}>
            <option value={20}>20</option>
            <option value={24}>24</option>
            <option value={28}>28</option>
            <option value={32}>32</option>
            {/* Add more options as needed */}
          </select>
        </label>
        <label>
          Show Gutter:
          <select value={showGutter} onChange={(e) => setShowGutter(e.target.value === 'true')}>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </label>
        <label>
          Highlight Active Line:
          <select value={highlightActiveLine} onChange={(e) => setHighlightActiveLine(e.target.value === 'true')}>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </label>
      </form>
        <AceEditor
        mode={syntax}
        theme={theme}
        onChange={handleChange}
        fontSize={fontSize}
        lineHeight={lineHeight}
        showPrintMargin={true}
        showGutter={showGutter}
        highlightActiveLine={highlightActiveLine}
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
      </div>
      )}
      </div>
    </form>
  );
};

export default PasteForm;
