import React, { useEffect, useCallback, useState } from "react";
import { connect } from "react-redux";
import "./ChatPanel.css";
import { ChatItem } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { useHistory } from "react-router";

const ConversationsList = ({ data }) => {
  useEffect(() => {
    document.title = "BetweenUs";
  }, []);

  const history = useHistory();
  console.log(data);
  return (
    <div id="conversations-list">
      {data.map((conversation) => {
        return (
          <ChatItem
            onClick={() =>
              history.push("/messages/" + conversation.conversationId)
            }
            avatar={conversation.avatar}
            alt={""}
            title={conversation.fullName}
            subtitle={conversation.lastMessage}
            date={new Date(conversation.lastMessageAt)}
            unread={0}
          />
        );
      })}
    </div>
  );
};

export default connect(null, null)(ConversationsList);
