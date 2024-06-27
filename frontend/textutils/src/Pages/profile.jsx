import React, { useState,useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from '../../constants';
// import { set } from "mongoose";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';


function Profile ({  showAlert, mode, toggleMode })  {
  let { id } = useParams();
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
//   const navigate = useNavigate();

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

        const pasteResponse = await fetch(`${BACKEND_URL}/user/${response.data.user.uid}`);
        const userData = await pasteResponse.json();
        setData(userData);

      } catch (err) {
        console.log(err);
        window.location.href = "/login";
      }
    };
    fetchData();
  }, []);
//   const [expiryTime, setExpiryTime] = useState('');
//   useEffect(() => {
//     if (data && data.expiry) {
//       setExpiryTime(getTimeLeft(pasteData.paste.expiry));
//     }
//   }, [pasteData]);

  function getTimeLeft(expiryTime,created_at,views) {
    const currentTime = new Date();
    const expiryDate = new Date(expiryTime);
    const created_time = new Date(created_at);
    let differenceInMinutes = (expiryDate - currentTime) / (1000 * 60);
    // console.log(differenceInMinutes);
    if(expiryDate === created_time && views<=2){
      return "One time view";
    }
    else if(expiryDate === created_time && views>2){
      return "Expired";
    }
    if (differenceInMinutes < 0) {
      return "Expired";
    }

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
    <div>
      {user && (
        <>
          <h1>{user.username}</h1>
          <p>{user.email}</p>
          <h2>Pastes:</h2>
          {user.Urls.map((url, index) => (
            <div key={index}>
              <p>{url}</p>
              <p>Title: {user.pasteList[index].title}</p>
              <p>Expiry: {getTimeLeft(user.pasteList[index].expiry,user.pasteList[index].created_at,user.Viewer[index] )}</p>
              <p>Views: {user.Viewer[index]/2}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Profile;
