import React, { useState, useEffect, useRef, useMemo } from "react";
import { connect } from "react-redux";
import { useLocation } from 'react-router-dom'
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import GreenAudioPlayer from './GreenAudioPlayer';
import GreenAudioRecorder from './GreenAudioRecorder';

import "./ChatPanel.css";
import { Input, MessageBox } from "react-chat-elements";
import Icon from "../../Icon/Icon";

import {
  sendMessageStart,
  addMessage,
  fetchMessages,
  startNewConversationStart,
  updateConversationParticipantIsTypingStart,

} from "../../../redux/chat/chatActions"

import { uploadNewFile } from "../../../redux/media/mediaActions"
import { useSocket } from "../../../providers/SocketProvider"
import { ObjectID } from 'bson';
import { } from '../../../redux/chat/chatActions'
import { selectConversation } from '../../../redux/chat/chatSelectors'
import { getFileType } from '../ChatUtils';
import getBlobDuration from 'get-blob-duration';
import ysFixWebmDuration from 'fix-webm-duration';
import FileType from 'file-type/browser';
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US');

const minScrollTop = 1;
let timer;
const conversationsTyping = {}

const Messages = ({ conversation_id,
  messages,
  messagesFetching,
  userId,
  firstSentAt,
  addMessageDispatch,
  sendMessageStartDispatch,
  fetchMessagesDispatch, uploadNewFileDispatch,
  startNewConversationStartDispatch,
  updateConversationParticipantIsTypingStartDispatch,
  onReadMessage,
  conversationSelector
}) => {
  const [messageText, setMessageText] = useState("");
  const [inputType, setInputType] = useState("text"); // values : 'text', 'audio', 'video';
  const fileInputRef = useRef();
  const inputRef = useRef();
  const messagesBoxRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const socket = useSocket();
  const messageTextRefs = useRef([]);

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
  ////////////////////////////////////////////// READING EVENTS ( READING MESSAGES) ////////////////////////
  ////////////////////////////////////////////// MessageTextBox ////////////////////////////////////////////
  useEffect(() => {
    let timer;
    const listener = (e) => {
      clearTimeout(timer);
      const messagesBoxRect = messagesBoxRef.current.getBoundingClientRect();
      timer = setTimeout(() => {
        messageTextRefs.current.map((current) => {
          if (current) {
            // console.log(current);
            const messageRect = current?.refs?.message?.getBoundingClientRect();
            // console.log(messageRect && messageRect.top >= messagesBoxRect.top && messageRect.bottom <= messagesBoxRect.bottom)
            if (messageRect && messageRect.top >= messagesBoxRect.top - 2 && messageRect.bottom <= messagesBoxRect.bottom + 2) {
              current.props.onVisible();
            }
          }
          return '';
        })
      }, 100)
    }
    const element = messagesBoxRef.current
    element.addEventListener('scroll', listener);
    element.addEventListener('mousemove', listener);
    // element.addEventListener('mousedown', listener);
    return () => {
      element.removeEventListener('scroll', listener);
      element.removeEventListener('mousemove', listener);
      // element.removeEventListener('mousedown', listener);
    }
  }, [])

  ////////////////////////////////////////////// SCROLL DOWN  WHEN VISITING (clicking on a conversation) A CONVERSATION ///////////////////////////////////////////////////////
  useEffect(() => {
    if (conversation_id !== 'all' && conversation_id !== 'new') scrollDown(200);
  }, [conversation_id]);

  ///////////////////////////////////////// FETCH MESSAGE WHEN SCROLL UP /////////////////////////////////////////
  useEffect(() => {
    if (firstSentAt) {
      const msgref = messagesBoxRef.current;
      const scrollListener = (e) => {
        if (msgref.scrollTop < minScrollTop && !messagesFetching && conversation_id !== 'all' && conversation_id !== 'new') {

          const { createdAt } = conversationSelector(conversation_id);
          if (firstSentAt.getTime() === new Date(createdAt).getTime()) return;
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
    }

  }, [messagesBoxRef, firstSentAt, messagesFetching, conversation_id]);

  ///////////////////////////////////////////////////////// UPLOAD MEDIA ///////////////////////////////////////////////////////
  useEffect(() => {
    const call = async () => {
      const text = inputRef.current?.input.value;// not inputRef when recording audio/video
      const participants = query.get('participants');
      console.log('selectedFile', selectedFile);
      const realExt = await FileType.fromBlob(selectedFile);
      const type = getFileType(selectedFile.name);
      let formData = new FormData();
      let duration; // only for audio and video
      if (type === 'audio' || type === 'video')
        duration = 1000 * await getBlobDuration(selectedFile);    // seconds we need to converted to milliseconds

      const message = { _id: new ObjectID().toHexString(), conversation: conversation_id, sender: userId, receivedBy: [], readBy: [], type, text, status: 'waiting', sentAt: new Date(), data: { duration } }
      addMessageDispatch(message);
      scrollDown(200);
      fileInputRef.current.value = "";
      if (realExt.ext === 'webm') {
        console.log(selectedFile.name.split('.')[1].toLowerCase())
        ysFixWebmDuration(selectedFile, duration, function (fixedBlob) {
          formData.append("medias", fixedBlob);
          uploadNewFileDispatch(formData, async (uri) => {
            const newMessage = { ...message, data: { uri, duration } };
            if (conversation_id !== 'new') {
              socket.emit('send-message-start', newMessage);// TODO : use thunk instead , remove it to a parent component
              sendMessageStartDispatch(newMessage);
            } else {
              socket.emit('start-new-conversation-start', { participants: [userId, participants], message: newMessage });
              startNewConversationStartDispatch(participants);
              sendMessageStartDispatch(newMessage);
            }
          });
        })
      } else {
        formData.append("medias", selectedFile);
        uploadNewFileDispatch(formData, async (uri) => {
          const newMessage = { ...message, data: { uri, duration } };
          if (conversation_id !== 'new') {
            socket.emit('send-message-start', newMessage);// TODO : use thunk instead , remove it to a parent component
            sendMessageStartDispatch(newMessage);
          } else {
            socket.emit('start-new-conversation-start', { participants: [userId, participants], message: newMessage });
            startNewConversationStartDispatch(participants);
            sendMessageStartDispatch(newMessage);
          }
        });
      }

    }
    if (selectedFile && uploadNewFileDispatch) call();
  }, [selectedFile, uploadNewFileDispatch])


  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      inputRef.current.input.value = (inputRef.current.input.value + "").replace(/\n|\r/g, "")
      handleSendMessage();
    }
  };
  const handleSendMessage = () => {

    const text = inputRef.current.input.value.replace(/\s+/g, ' ')

    if (text && text.length > 0 && text !== ' ') {
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

  /////////////////////////////////////////////////TYPING EVENT ///////////////////////////////////////////////////////////////////////
  const onMessageTextChanged = (e) => {
    setMessageText(inputRef.current?.input.value)
    if (!conversation_id || conversation_id === "new") return;

    if (!conversationsTyping[conversation_id]) {
      conversationsTyping[conversation_id] = { isTyping: true }
      socket.emit('conversation-participant-is-typing-start', { conversation_id, isTyping: true });
      updateConversationParticipantIsTypingStartDispatch({ conversation_id, isTyping: true });
    } else if (conversationsTyping[conversation_id] && !conversationsTyping[conversation_id].isTyping) {
      conversationsTyping[conversation_id].isTyping = true
      socket.emit('conversation-participant-is-typing-start', { conversation_id, isTyping: true });
      updateConversationParticipantIsTypingStartDispatch({ conversation_id, isTyping: true });
    }

    clearTimeout(conversationsTyping[conversation_id].Timer);
    conversationsTyping[conversation_id].Timer = setTimeout(() => {
      conversationsTyping[conversation_id].isTyping = false;
      socket.emit('conversation-participant-is-typing-start', { conversation_id, isTyping: false });
      updateConversationParticipantIsTypingStartDispatch({ conversation_id, isTyping: false });
    }, 1000)
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const renderMessageBox = (message) => {
    messageTextRefs.current = [];
    if (message.type === "text") {
      return (
        <MessageBox
          style={!message.readBy.find(rb => rb._id === userId) ? { backgroundColor: "#f4f4f4" } : {}}
          ref={ref => ref && messageTextRefs.current.push(ref)}
          key={message._id}
          position={message.sender === userId ? "right" : "left"}
          type={message.type}
          text={message.text}
          status={message.sender === userId ? message.status : ""}// TO DO correct this one
          date={new Date(message.sentAt)}
          // onMessageFocused={() => alert()}
          onVisible={() => message.sender !== userId && !message.readBy.find(rb => rb === userId) && onReadMessage(message)}

        />
      );
    } else if (message.type === "photo") {
      return (
        <MessageBox
          style={!message.readBy.find(rb => rb._id === userId) ? { backgroundColor: "#f4f4f4" } : {}}
          ref={ref => ref && messageTextRefs.current.push(ref)}
          key={message._id}
          position={message.sender === userId ? "right" : "left"}
          type={message.type}
          text={message.text}
          date={new Date(message.sentAt)}
          status={message.sender === userId ? message.status : ""}
          onVisible={() => message.sender !== userId && !message.readBy.find(rb => rb === userId) && onReadMessage(message)}
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
    } else if (message.type === "audio") {
      return (
        <GreenAudioPlayer
          style={!message.readBy.find(rb => rb._id === userId) ? { backgroundColor: "#f4f4f4" } : {}}
          key={message._id}
          src={message?.data?.uri}
          sentAt={new Date(message.sentAt)}
          position={message.sender === userId ? "right" : "left"}
          status={message.sender === userId ? message.status : ""}
          onPlay={() => message.sender !== userId && onReadMessage(message)}
          alreadyPlayed={message.sender === userId || message.readBy.find(rb => rb === userId)}
        />

      );
    } else if (message.type === "video") {
      return (
        <div className="rce-container-mbox" key={message._id} style={!message.readBy.find(rb => rb._id === userId) ? { backgroundColor: "#f4f4f4" } : {}}>
          <div className={`rce-mbox rce-mbox-${message.sender === userId ? "right" : "left"}`}>
            <div className="rce-mbox-body">
              <div style={{ 'paddingBottom': '16px' }} className="rce-mbox-video padding-time">
                <div className="rce-mbox-video--video" style={{ width: '300px' }}>
                  <video controls src={message?.data?.uri} onPlay={() => message.sender !== userId && !message.readBy.find(rb => rb === userId) && onReadMessage(message)} />
                </div>
              </div>
              <div className="rce-mbox-time non-copiable" data-text={timeAgo.format(new Date(message.sentAt))}>
                {message.sender === userId && (<span className="rce-mbox-status">
                  {message.status === 'waiting' && (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style={{ verticalAlign: 'middle' }}><g><path d="m20.9 11.6v8.8l7.5 4.4-1.3 2.2-8.7-5.4v-10h2.5z m-0.9 21.8q5.5 0 9.4-4t4-9.4-4-9.4-9.4-4-9.4 4-4 9.4 4 9.4 9.4 4z m0-30q6.9 0 11.8 4.8t4.8 11.8-4.8 11.8-11.8 4.8-11.8-4.8-4.8-11.8 4.8-11.8 11.8-4.8z"></path></g></svg>)}
                  {message.status === 'sent' && (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style={{ verticalAlign: 'middle' }}><g><path d="m15 27l17.7-17.7 2.3 2.3-20 20-9.3-9.3 2.3-2.3z"></path></g></svg>)}
                  {message.status === 'received' && (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style={{ verticalAlign: 'middle' }}><g><path d="m30.3 10.9l-10.9 10.9-2.4-2.4 10.9-10.9z m7.3-2.4l2.4 2.4-20.6 20.6-9.6-9.6 2.4-2.4 7.2 7.1z m-37.6 13.4l2.5-2.4 9.5 9.6-2.4 2.4z"></path></g></svg>)}
                  {message.status === 'read' && (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style={{ verticalAlign: 'middle', color: 'rgb(79, 195, 247)' }}><g><path d="m30.3 10.9l-10.9 10.9-2.4-2.4 10.9-10.9z m7.3-2.4l2.4 2.4-20.6 20.6-9.6-9.6 2.4-2.4 7.2 7.1z m-37.6 13.4l2.5-2.4 9.5 9.6-2.4 2.4z"></path> </g></svg>)}
                </span>)}
              </div>
            </div>
          </div>
        </div >
        //
      );
    }
  };

  return (
    <div
      className="messages-board"
    >
      <div className="messages" ref={messagesBoxRef}  >
        {messages.map((message) => {
          return renderMessageBox(message);
        })}
      </div>
      {
        conversation_id !== 'all' && (
          <div className="message-input" style={{ background: ' #fff' }}>
            {inputType === 'text' && (<div className="wrap">
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
                    <button
                      onClick={() => setInputType('audio')}
                    >
                      <Icon icon={"mic-outline"} />
                    </button>

                    {/* <audio src={mediaBlobUrl} controls autoPlay loop /> */}

                  </div>
                }
              />
            </div>)}
            {inputType === 'audio' && (<div className="wrap" >
              <GreenAudioRecorder
                onDelete={() => setInputType('text')}
                onSend={(file) => setSelectedFile(file)}
              />
            </div>)}
            <input
              style={{ display: "none" }}
              onChange={(e) => setSelectedFile(e.target.files[0])}
              ref={fileInputRef}
              type="file"
            />
          </div>)
      }
    </div >
  );
};

const mapDispatchToProps = (dispatch) => ({
  addMessageDispatch: (message) => dispatch(addMessage(message)),
  sendMessageStartDispatch: (message) => dispatch(sendMessageStart(message)),
  uploadNewFileDispatch: (formData, onUploadDone) => dispatch(uploadNewFile(formData, onUploadDone)),
  fetchMessagesDispatch: (conversation_id, firstSentAt) => dispatch(fetchMessages(conversation_id, firstSentAt)),
  startNewConversationStartDispatch: (participants) => dispatch(startNewConversationStart(participants)),
  updateConversationParticipantIsTypingStartDispatch: (payload) => dispatch(updateConversationParticipantIsTypingStart(payload)),
});

const mapStateToProps = (state) => ({
  conversationSelector: (conversation_id) => selectConversation(state, conversation_id),
})

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
