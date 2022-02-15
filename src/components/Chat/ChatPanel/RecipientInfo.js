import React from "react";
import { connect } from "react-redux";
import "./ChatPanel.css";
import { Link } from "react-router-dom";

const RecipientInfo = ({ fullName, avatar, username }) => {
  return (
    <Link to={`/${username}`}>
      <div className="contact-profile">
        <img src={avatar} alt="" />
        <p>{fullName}</p>
      </div>
    </Link>
  );
};

export default connect(null, null)(RecipientInfo);
