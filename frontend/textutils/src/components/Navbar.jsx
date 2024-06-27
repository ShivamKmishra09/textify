import React, { useState,useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { LuLogIn } from "react-icons/lu";
import { Link } from "react-router-dom";
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
export default function Navbar(props) {
  const [user, setUser] = useState(null);
  const redirect_login = () => {
    try {
      window.location.href = "/login";
    } catch (err) {
      console.log(err);
    }
  };
  const redirect_profile = () => {
    try {
      window.location.href = "/profile";
    } catch (err) {
      console.log(err);
    }
  };

  const redirect_home = async() => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        // console.log("No token found");
        window.location.href = "/";
      }

      const response = await axios.get(`${BACKEND_URL}/authenticate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUser(response.data.user);
        window.location.href = "/loggedin/" + response.data.user._id;
      } else {
        // console.log("Not authenticated");
        window.location.href = "/";
     }
    } catch (err) {
      console.log(err);
      window.location.href = "/";
    }
  };
  return (
    <nav
      className={`navbar navbar-expand-lg navbar-${props.mode} bg-${props.mode} `}
    >
      <div className="container-fluid">
      <button className="nav-link active" onClick={redirect_home}>
          _{props.title}
        </button>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              {/* <Link className="nav-link active" aria-current="page" to="/">
                Home
              </Link> */}
              <button className="nav-link active" onClick={redirect_home}>Create Snippet </button>
            </li>
            {/* <li className="nav-item">
              <Link className="nav-link " to="/about">
                About
              </Link>
            </li> */}
          </ul>
          {/* <form className="d-flex" role="search">
          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
          <button className="btn btn-outline-primary" type="submit">Search</button>
        </form> */}
          
            <button className="navbar-button" id="darkmode" onClick={props.toggleMode}>
             { props.mode===`light`?<MdDarkMode />:<CiLight />}
            </button>
            <button className="navbar-button" id="login" onClick={redirect_login}>
          Login <LuLogIn />
        </button>
            <button className="navbar-button" id="profile" onClick={redirect_profile}>
            <CgProfile />
        </button>
            
          
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
};
Navbar.defaultProps = {
  title: "Set title here",
};
