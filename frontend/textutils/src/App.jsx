import "./App.css";
import Alert from "./components/Alert";
// import About from "./components/About";
import Navbar from "./components/Navbar";
// import TextForms from "./components/TextForms";
import React, { useState } from "react";
// import Textbox from "./components/Textbox";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PasteForm from "./components/Paste/PasteForm";
import PasteFormLoggedIn from "./components/Paste/PasteFormLoggedIn";
import PasteList from "./components/Paste/PasteList";
import LoginPage from "./Pages/login";
import SignUp from "./Pages/signup";
import ShowPaste from "./Pages/showPaste";
import EditPaste from "./Pages/editPaste";
import Profile from "./Pages/profile";

function App() {
  const [mode, setMode] = useState("light");
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  const toggleMode = () => {
    if (mode === "light") {
      setMode("dark");
      document.body.style.backgroundColor = "#042743";
      showAlert("Dark mode has been enabled", "success");
      document.title = "TextUtils - Dark Mode";
    } else {
      setMode("light");
      document.body.style.backgroundColor = "white";
      showAlert("Light mode has been enabled", "success");
      document.title = "TextUtils - Light Mode";
    }
  };
  const [pastes, setPastes] = useState([]);

  const handleDelete = (id) => {
    setPastes(pastes.filter((paste) => paste.id !== id));
  };

  return (
    <>
      <Router>
        <Navbar title="TextUtils" mode={mode} toggleMode={toggleMode} />
        <Alert alert={alert} />
        <div className="container my-3">
          <Routes>
            {/* <Route exact path="/about" element={<About mode={mode} />} /> */}
            <Route
              exact
              path="/"
              element={
                <>
                  <PasteForm
                    // onCreate={handleCreate}
                    showAlert={showAlert}
                    mode={mode}
                    toggleMode={toggleMode}
                  />
                  <PasteList pastes={pastes} onDelete={handleDelete} />
                </>
              }
            />
            <Route path="/loggedin/:user_id" element={
                <>
                  <PasteFormLoggedIn
                    // onCreate={handleCreate}
                    showAlert={showAlert}
                    mode={mode}
                    toggleMode={toggleMode}
                  />
                  <PasteList pastes={pastes} onDelete={handleDelete} />
                </>
              } />
            <Route path="/:uid/:pasteId" element={<ShowPaste />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/update/:uid/:pasteId" element={<EditPaste  showAlert={showAlert}
                    mode={mode}/>} />
            <Route path="/profile" element={<Profile showAlert={showAlert}
                    mode={mode} />} />
            <Route path="*" element={<h1>Not Found</h1>} />
            <Route path="/pnf" element={<h1>Paste has been expired</h1>} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
