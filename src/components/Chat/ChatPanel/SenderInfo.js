import React, { useEffect, useCallback, useState } from "react";
import { connect } from "react-redux";
import "./ChatPanel.css";

const SenderInfo = ({ fullName, avatar }) => {
  return (
    <div id="profile">
      <div class="wrap">
        <img id="profile-img" src={avatar} class="online" alt="" />
        <p>{fullName}</p>
        <i class="fa fa-chevron-down expand-button" aria-hidden="true"></i>
      </div>
    </div>
  );
};

export default connect(null, null)(SenderInfo);
