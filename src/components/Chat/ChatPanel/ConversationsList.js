import React from "react";
import { connect } from "react-redux";
import "./ChatPanel.css";
import { ChatItem } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { useHistory } from "react-router";

const ConversationsList = ({ conversations }) => {
  const history = useHistory();
  return (
    <div id="conversations-list">
      {conversations.map((conversation) => {
        return (
          <ChatItem
            key={conversation._id}
            onClick={() => history.push("/messages/" + conversation._id)}
            avatar={conversation.avatar}
            alt={""}
            title={"titre de la conversation"}
            subtitle={"descriptions "}
            date={new Date()}
            unread={0}
          />
        );
      })}
    </div>
  );
};

export default connect(null, null)(ConversationsList);
