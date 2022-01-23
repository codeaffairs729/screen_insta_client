import React, { useState } from "react";
import { connect } from "react-redux";
import "./ChatPanel.css";
import { Input, MessageBox } from "react-chat-elements";
import Icon from "../../Icon/Icon";
import { sendMessageStart } from "../../../redux/chat/chatActions"
import { useSocket } from "../../../providers/SocketProvider"
import { ObjectID } from 'bson';


const Messages = ({ conversation_id, messages, userId, sendMessageStartDispatch, recipient, onMessageSent, onReadConversation }) => {
  const [messageText, setMessageText] = useState("hello world");
  const socket = useSocket();
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();

    }
  };
  const handleSendMessage = () => {
    const message = { _id: new ObjectID().toHexString(), conversation: conversation_id, sender: userId, receivedBy: [], readBy: [], type: "text", text: messageText, status: 'waiting', sentAt: new Date() }
    socket.emit('send-message-start', message);// TODO : use thunk instead , remove it to a parent component
    sendMessageStartDispatch(message);

  }
  const onMessageTextChanged = (e) => {
    setMessageText(e.target.value);
  };

  const renderMessageBox = (message) => {
    if (message.type === "text") {
      return (
        <MessageBox
          key={message._id}
          position={message.sender === userId ? "right" : "left"}
          type={message.type}
          text={message.text}
          status={message.sender === userId ? message.status : ""}
          date={new Date(message.sentAt)}
        />
      );
    } else if (message.type === "photo") {
      if (message.isPaid && message.userPaid) {
        return (
          <MessageBox
            key={message._id}
            position={message.sender === userId ? "right" : "left"}
            type={message.type}
            text={message.text}
            date={new Date(message.sentAt)}
            data={{
              uri: message.secure_url,
              status: {
                click: true,
                loading: 0,
              },
              width: 300,
              height: 300,
            }}
          />
        );
      }
      else {
        return (
          <MessageBox
            key={message._id}
            position={message.sender === userId ? "right" : "left"}
            type={message.type}
            text={message.text}
            date={new Date(message.sentAt)}
            data={{
              uri: message.secure_url,
              status: {
                click: true,
                loading: 0,
              },
              width: 300,
              height: 300,
            }}
          />
        );
      }
    } else if (message.type === "video") {
      return (
        <MessageBox
          key={message._id}
          position={message.sender === userId ? "right" : "left"}
          type={message.type}
          text={message.text}
          date={new Date(message.sentAt)}
          data={{
            uri: message.secure_url,
            status: {
              click: true,
              loading: 0,
              download: true,
            },
            width: 300,
            height: 300,
          }}
        />
      );
    } else {
      return null;
    }
  };


  return (
    <div >
      <div className="messages"
        tyle={{ marginBottom: 30 }}
      //  onMouseMove={onReadConversation}
      >
        {messages.slice(-7).map((message) => {
          return renderMessageBox(message);
        })}
      </div>
      <div className="message-input">
        <div className="wrap">
          {/* {renderPaidMessagePanel()} */}
          <Input
            // ref={(el) => (inputRef = el)}
            placeholder="Type here..."
            multiline={true}
            onKeyPress={onKeyPress}
            defaultValue={messageText}
            onChange={(e) => { onMessageTextChanged(e); onReadConversation(e) }}

            rightButtons={
              <div>
                <button
                  // onClick={onMessageReady}
                  onClick={handleSendMessage}
                >
                  <Icon icon={"paper-plane-outline"} />
                </button>
                <button
                //  onClick={onUploadFileClicked}
                >
                  <Icon icon={"images-outline"} />
                </button>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  sendMessageStartDispatch: (message) => dispatch(sendMessageStart(message)),

});
export default connect(null, mapDispatchToProps)(Messages);
