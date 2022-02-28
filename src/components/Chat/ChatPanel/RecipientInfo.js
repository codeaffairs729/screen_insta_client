import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import "./ChatPanel.css";
import { Link } from "react-router-dom";
// import { Avatar, Navbar } from 'react-chat-elements'
import dateFormat, { masks } from "dateformat";
const interval = 200;
const RecipientInfo = ({ fullName, avatar, username, lastTimeOnline, isTyping }) => {

  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
      // console.log('now')
    }, interval)
    return () => clearInterval(timer)
  }, [])
  return (

    <div className="contact-profile">
      <div className="left-side" >
        <Link to={`/${username}`}>
          <img src={avatar} alt="" />
        </Link>
        {/* <p>{isTyping}</p> */}
        <div className="participant-info">
          <p className="participant-name">{fullName}</p>
          <p className="participant-state">{isTyping ? 'Typing ...' : lastTimeOnline &&
            (now.getTime() - new Date(lastTimeOnline).getTime() < 4000 ? 'Online' : dateFormat(lastTimeOnline, "dddd dd/mm,  HH:MM TT"))}</p>
        </div>

      </div >
      {/* <div>middle</div>
      <div>right side</div> */}
    </div >

  );

};

export default connect(null, null)(RecipientInfo);
