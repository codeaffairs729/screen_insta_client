import React from "react";

const SenderInfo = ({ balance, fullName, avatar }) => {
  return (
    <div id="profile">
      <div className="wrap">
        <img id="profile-img" src={avatar} className="online" alt="" />
        <p style={{ fontSize: "14px" }}>Balance: {balance}$</p>
        {/* <i className="fa fa-chevron-down expand-button" aria-hidden="true">dddd</i> */}
      </div>
    </div>
  );
};

export default SenderInfo;
