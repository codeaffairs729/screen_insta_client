import React, { useEffect, useCallback, useState } from "react";
import { connect } from "react-redux";
import "./ChatPanel.css";
import { Input } from "react-chat-elements";
import { MessageBox } from "react-chat-elements";
import RecipientInfo from "./RecipientInfo";
import Icon from "../../Icon/Icon";

const Messages = ({ data, recipient, onMessageSent }) => {
  const [messageText, setMessageText] = useState("");
  const onMessageReady = (e) => {
    let payload = {
      conversationId: "",
      recipient: recipient.username,
      message: {
        type: "text",
        text: messageText,
      },
    };
    if (onMessageSent) onMessageSent(payload);
    inputRef.clear();
  };
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      onMessageReady();
    }
  };

  const onMessageTextChanged = (e) => {
    setMessageText(e.target.value);
  };

  let inputRef = React.createRef();
  return (
    <div class="messages">
      <div class="messages" style={{ marginBottom: 30 }}>
        {data.map((message) => {
          return (
            <MessageBox
              position={message.incoming ? "left" : "right"}
              type={message.type}
              text={message.text}
              date={new Date(message.sentAt)}
            />
          );
        })}
      </div>
      <div class="message-input">
        <div class="wrap">
          <Input
            ref={(el) => (inputRef = el)}
            placeholder="Type here..."
            multiline={true}
            onKeyPress={onKeyPress}
            onChange={onMessageTextChanged}
            rightButtons={
              <button onClick={onMessageReady}>
                <Icon icon={"paper-plane-outline"} />
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default connect(null, null)(Messages);
