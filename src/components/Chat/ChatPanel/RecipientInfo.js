import React, { useEffect, useCallback, useState } from "react";
import { connect } from "react-redux";
import "./ChatPanel.css";

const RecipientInfo = ({ fullName, avatar }) => {
  return (
    <div class="contact-profile">
      <img src={avatar} alt="" />
      <p>{fullName}</p>
    </div>
  );
};

export default connect(null, null)(RecipientInfo);
