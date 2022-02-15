import React from "react";
import "./ChatPanel.css";

const SenderInfo = ({ fullName, avatar }) => {
  return (
    <div id="profile">
      <div className="wrap">
        <img id="profile-img" src={avatar} className="online" alt="" />
        <p>{fullName}</p>
        <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
      </div>
    </div>
  );
};

export default SenderInfo;
