import React, { useState,useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { BACKEND_URL } from '../../constants';
// import { set } from "mongoose";
import { useNavigate } from 'react-router-dom';
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




function ShowPaste ({  showAlert, mode, toggleMode })  {
  let { uid, pasteId } = useParams();
  const [pasteData, setPasteData] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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

        // Replace this with your actual fetch call
        const pasteResponse = await fetch(`${BACKEND_URL}/get/${uid}/${pasteId}`);
        const pasteData = await pasteResponse.json();
        setPasteData(pasteData);
        // console.log(pasteData);
      } catch (err) {
        console.log(err);
        // window.location.href = "/login";
      }
    };
    fetchData();
  }, []);
  const [expiryTime, setExpiryTime] = useState('');
  useEffect(() => {
    if (pasteData && pasteData.paste.expiry) {
      setExpiryTime(getTimeLeft(pasteData.paste.expiry, pasteData.paste.created_at,pasteData.views));
    }
  }, [pasteData]);

  function getTimeLeft(expiryTime,created_at,views) {
    const currentTime = new Date();
    const expiryDate = new Date(expiryTime);
    const created_time = new Date(created_at);
    let differenceInMinutes = (expiryDate - currentTime) / (1000 * 60);
    // console.log(expiryDate-created_time);
    // console.log(differenceInMinutes);
    if(expiryDate - created_time===0 && views===2){
      alert("This is a one-time snippet. It is automatically removed after the next view.");
      return "One time view";
    }
    if(expiryDate - created_time===0 && views===4){
      alert("This is a one-time snippet. It cannot be viewed again");
      return "One time view";
    }
    else if(expiryDate- created_time===0 && views>4){
      // alert("Paste has expired");
      navigate('/pnf');
      console.log(views);
      return "Expired";
    }
    else if (differenceInMinutes < 0&& expiryDate -created_time!=0) {
      // alert("Paste has expired");
      // if(user)navigate('/loggedin/'+user._id);
      console.log(expiryDate-created_time);
      console.log(views);
      navigate('/pnf');
      return "Expired";
    }
    else if (differenceInMinutes < 60) {
      return `${Math.round(differenceInMinutes)} ${Math.round(differenceInMinutes) === 1 ? "minute" : "minutes"}`;
    }
  
    const hours = differenceInMinutes / 60;
    if (hours < 24) {
      return `${Math.round(hours)} ${Math.round(hours) === 1 ? "hour" : "hours"}`;
    }
  
    const days = hours / 24;
    if (days < 7) {
      return `${Math.round(days)} ${Math.round(days) === 1 ? "day" : "days"}`;
    }
  
    const weeks = days / 7;
    if (weeks < 4) {
      return `${Math.round(weeks)} ${Math.round(weeks) === 1 ? "week" : "weeks"}`;
    }
  
    const months = days / 30;
    if (months < 12) {
      return `${Math.round(months)} ${Math.round(months) === 1 ? "month" : "months"}`;
    }
  
    const years = days / 365;
    if(years < 10){
    return `${Math.round(years)} ${Math.round(years) === 1 ? "year" : "years"}`;
    }
    return "Never";

};


  const handleEdit = () => {
    navigate('/update/'+uid+'/'+pasteId, { state: { pasteData } });
  };
  return (
    <div className="container my-3">
      {pasteData ? (
        pasteData.paste.syntax === "text" ? (
        <div>
          <p>Url:{pasteData.url}</p>
          <h2>title:{pasteData.paste.title}</h2>
          <p>{expiryTime}</p>
          <ReactQuill
          theme="snow"
          value={pasteData.paste.content}
          readOnly= {true}
          // onChange={handleChange}
          modules={{toolbar: false}}
          spellCheck={true}
          style={{
              backgroundColor: mode === `dark` ? `black` : `lightgray`,
              color: mode === `dark` ? `white` : `black`,
              // fontFamily: font,
              height: "200px", // Set a fixed height
            }}
        />
          {user.uid === pasteData.paste.creator && (
            <button onClick={handleEdit}>Edit</button>
          )}
        </div>):(
          <div>
          <p>Url:{pasteData.url}</p>
          <h2>title:{pasteData.paste.title}</h2>
          <p>{expiryTime}</p>
          {/* <p>{pasteData.paste.content}</p> */}
          {user.uid === pasteData.paste.creator && (
            <button onClick={handleEdit}>Edit</button>
          )}
          <AceEditor
          mode={pasteData.paste.syntax}
          theme={pasteData.paste.theme}
          // onChange={handleChange}
          fontSize={pasteData.paste.fontSize}
          lineHeight={pasteData.paste.lineHeight}
          showPrintMargin={true}
          showGutter={pasteData.paste.showGutter}
          highlightActiveLine={pasteData.paste.highlightActiveLine}
          placeholder="Write your code here"
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
          value={pasteData.paste.content}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 3,
          }}
          readOnly= {true}
        />
        </div>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ShowPaste;
