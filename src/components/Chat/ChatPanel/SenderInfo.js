import React from "react";

const SenderInfo = ({ fullName, avatar }) => {
  return (
    <div id="profile">
      <div className="wrap">
        <img id="profile-img" src={avatar} className="online" alt="" />
        <p style={{ fontSize: "14px" }}>{fullName}</p>
        {/* <i className="fa fa-chevron-down expand-button" aria-hidden="true">dddd</i> */}
      </div>
    </div>
  );
};

export default SenderInfo;
