import React, { useEffect } from "react";
import { connect } from "react-redux";

import ChatPanel from "./ChatPanel/ChatPanel";

const ChatPage = () => {
  useEffect(() => {
    document.title = "BetweenUs";
  }, []);

  return (
    <div style={{ paddingTop: 70 }}>
      <ChatPanel />
    </div>
  );
};

export default connect(null, null)(ChatPage);
