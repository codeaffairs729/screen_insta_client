import React, { useState, useEffect, useRef, useMemo } from "react";
import { connect } from "react-redux";
import { useLocation } from 'react-router-dom'
import "./ChatPanel.css";
import { Input, MessageBox } from "react-chat-elements";
import Icon from "../../Icon/Icon";
import { sendMessageStart, addMessage } from "../../../redux/chat/chatActions"
import { uploadNewFile } from "../../../redux/media/mediaActions"
import { useSocket } from "../../../providers/SocketProvider"
import { ObjectID } from 'bson';
import { fetchMessages, startNewConversationStart } from '../../../redux/chat/chatActions'


const minScrollTop = 1;
let timer;
const Messages = ({ conversation_id, messages, messagesFetching, userId, firstSentAt, addMessageDispatch, sendMessageStartDispatch, fetchMessagesDispatch, uploadNewFileDispatch, startNewConversationStartDispatch }) => {
  const [messageText, setMessageText] = useState("");
  const fileInputRef = useRef();
  const inputRef = useRef();
  const messagesBoxRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const socket = useSocket();

  function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
  }
  const query = useQuery();

  const scrollDown = (i = 100) => {
    const scrollHeight = messagesBoxRef.current.scrollHeight
    setTimeout(() => {
      messagesBoxRef.current.scrollTop = scrollHeight;
    }, i)
  };
  const scrollDownAlitttleBit = (i = 100) => {
    const scrollHeight = messagesBoxRef.current.scrollHeight

    setTimeout(() => {
      messagesBoxRef.current.scrollTop = scrollHeight * 0.02
    }, i)
  };

  ////////////////////////////////////////////// SCROLL DOWN  WHEN VISITING (clicking on a conversation) A CONVERSATION ///////////////////////////////////////////////////////
  useEffect(() => {
    if (conversation_id !== 'all' && conversation_id !== 'new') scrollDown(200);
  }, [conversation_id]);

  ///////////////////////////////////////// FETCH MESSAGE WHEN SCROLL UP /////////////////////////////////////////
  useEffect(() => {
    const msgref = messagesBoxRef.current;
    const scrollListener = (e) => {
      if (msgref.scrollTop < minScrollTop && !messagesFetching && conversation_id !== 'all' && conversation_id !== 'new') {
        console.log(msgref.scrollTop)
        clearTimeout(timer);
        timer = setTimeout(() => {
          fetchMessagesDispatch(conversation_id, firstSentAt);
        }, 1000);
        scrollDownAlitttleBit(200);
      }
    }
    msgref.addEventListener('scroll', scrollListener);
    return () => {
      msgref.removeEventListener('scroll', scrollListener);
    };
  }, [messagesBoxRef, firstSentAt, messagesFetching, conversation_id]);

  ///////////////////////////////////////////////////////// UPLOAD MEDIA ///////////////////////////////////////////////////////
  useEffect(() => {
    if (selectedFile && uploadNewFileDispatch) {
      const participants = query.get('participants');
      console.log('selectedFile', selectedFile);
      let formData = new FormData();
      formData.append("medias", selectedFile);

      const message = { _id: new ObjectID().toHexString(), conversation: conversation_id, sender: userId, receivedBy: [], readBy: [], type: "photo", text: messageText, status: 'waiting', sentAt: new Date() }
      addMessageDispatch(message);
      uploadNewFileDispatch(formData, (uri) => {
        const newMessage = { ...message, data: { uri } };

        if (conversation_id !== 'new') {
          socket.emit('send-message-start', newMessage);// TODO : use thunk instead , remove it to a parent component
          sendMessageStartDispatch(newMessage);
        } else {
          console.log('here', newMessage);
          socket.emit('start-new-conversation-start', { participants: [userId, participants], message: newMessage });
          startNewConversationStartDispatch(participants);
          sendMessageStartDispatch(newMessage);
        }
      });
      fileInputRef.current.value = "";
      scrollDown(200)
    }

  }, [selectedFile, uploadNewFileDispatch])


  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      inputRef.current.input.value = (inputRef.current.input.value + "").replace(/\n|\r/g, "")
      handleSendMessage();
    }
  };
  const handleSendMessage = () => {
    const text = inputRef.current.input.value;
    if (text && text.length > 0) {
      const participants = query.get('participants');

      const message = { _id: new ObjectID().toHexString(), conversation: conversation_id, sender: userId, receivedBy: [], readBy: [], type: "text", text, status: 'waiting', sentAt: new Date() }

      if (conversation_id !== 'new') {
        socket.emit('send-message-start', message);// TODO : use thunk instead , remove it to a parent component
        sendMessageStartDispatch(message);
      } else {
        socket.emit('start-new-conversation-start', { participants: [userId, participants], message });
        startNewConversationStartDispatch(participants);
        sendMessageStartDispatch(message);
      }
      inputRef.current.input.value = '';
      scrollDown(100)
      // setTimeout(() => {
      //   messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight
      // }, 100)
    }
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
          status={message.sender === userId ? message.status : ""}// TO DO correct this one
          date={new Date(message.sentAt)}
        />
      );
    } else if (message.type === "photo") {
      return (
        <MessageBox
          key={message._id}
          position={message.sender === userId ? "right" : "left"}
          type={message.type}
          text={message.text}
          date={new Date(message.sentAt)}
          data={{
            uri: message?.data?.uri,
            status: {
              click: true,
              loading: 0,
            },
            width: 300,
            height: 300,
          }}
        />
      );
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
    }
  };


  return (
    <div className="messages" style={{ height: "100%", minHeight: "calc(100% - 128px)", maxHeight: "calc(100% - 128px)", overflow: "auto", scrollBehavior: "smooth" }} ref={messagesBoxRef}>

      {messages.map((message) => {
        return renderMessageBox(message);
      })}

      {conversation_id !== 'all' && (<div className="message-input">
        <div className="wrap">
          {/* {renderPaidMessagePanel()} */}
          <Input
            ref={inputRef}
            placeholder=" Type here..."
            multiline={true}
            onKeyDown={onKeyDown}
            // defaultValue={messageText}
            // value={messageText}
            onChange={onMessageTextChanged}


            rightButtons={
              <div>
                <button
                  // onClick={onMessageReady}
                  onClick={handleSendMessage}
                  disabled={!(inputRef.current?.input.value)}
                >
                  <Icon icon={"paper-plane-outline"} />
                </button>
                <button
                  onClick={() => fileInputRef.current.click()}
                >
                  <Icon icon={"images-outline"} />
                </button>
              </div>
            }
          />
        </div>
        <input
          style={{ display: "none" }}
          onChange={(e) => setSelectedFile(e.target.files[0])}
          ref={fileInputRef}
          type="file"
        />
      </div>)}
    </div>
  );
};



const mapDispatchToProps = (dispatch) => ({
  addMessageDispatch: (message) => dispatch(addMessage(message)),
  sendMessageStartDispatch: (message) => dispatch(sendMessageStart(message)),
  uploadNewFileDispatch: (formData, onUploadDone) => dispatch(uploadNewFile(formData, onUploadDone)),
  fetchMessagesDispatch: (conversation_id, firstSentAt) => dispatch(fetchMessages(conversation_id, firstSentAt)),
  startNewConversationStartDispatch: (participants) => dispatch(startNewConversationStart(participants)),


});

export default connect(null, mapDispatchToProps)(Messages);
