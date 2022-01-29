import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import "./ChatPanel.css";
import ConversationsList from "./ConversationsList";
import Messages from "./Messages";
import RecipientInfo from "./RecipientInfo";
import SenderInfo from "./SenderInfo";
import { useSocket } from "../../../providers/SocketProvider"

import {
  fetchConversations,
  fetchFollowers,
  fetchMessages,
  startNewConversationSuccess,
  sendMessageStart,
  sendMessageSuccess,
  receiveMessageStart,
  receiveMessageSuccess,
  readMessageStart,
  readMessageSuccess

} from "../../../redux/chat/chatActions";
import { useHistory } from "react-router-dom";
import { selectCurrentUser } from "../../../redux/user/userSelectors";
import {
  selectConversation,
  selectConversationMessages,
  selectConversationLastMessage,
  selectConversationFirstMessage
} from "../../../redux/chat/chatSelectors"


const ChatPanel = ({
  currentUser,
  conversations,
  conversationsFetching,
  startNewConversationSuccessDispatch,
  fetchConversationsError,
  fetchConversationsDispatch,
  fetchFollowersDispatch,
  messages,
  messagesFetching,
  fetchMessagesError,
  fetchMessagesDispatch,
  conversationSelector,
  conversationMessagesSelector,
  conversationFirstMessageSelector,
  sendMessageStartDispatch,
  sendMessageSuccessDispatch,
  receiveMessageStartDispatch,
  receiveMessageSuccessDispatch,
  readMessageStartDispatch,
  readMessageSuccessDispatch
}) => {
  const { conversation_id } = useParams();
  const syncLock = useRef(false);
  const history = useHistory();
  const socket = useSocket();

  ///////////////////////////////////// INIT /////////////////////////////////////////////////////////////
  useEffect(() => { //fetch all the conversations 
    if (!conversationsFetching && !fetchConversationsError) {
      fetchConversationsDispatch(0);
    }
  }, []);
  useEffect(() => { //fetch all the followers  
    if (!conversationsFetching && !fetchConversationsError) {
      fetchFollowersDispatch(0);
    }
  }, []);

  useEffect(() => { //fetch all the messages 
    if (!conversationsFetching && conversations) {
      conversations.map(conv => {
        fetchMessagesDispatch(conv._id);
        return '';
      })
    }

  }, [conversationsFetching]);


  ///////////////////////////////////////// NAVIGATION //////////////////////////////////////////////////////
  useEffect(() => {

    if (conversation_id === "all") {
      if (conversations && conversations.length > 0) {
        history.push("/messages/" + conversations[0]._id);
      }
    }
  }, [conversations, conversation_id, history]);


  ////////////////////////////////////////////////// REAL TIME SOCKET ////////////////////////////////////////
  useEffect(() => {// listening on upcoming events // real time chat
    const log = true;
    if (socket && currentUser._id && conversation_id) {
      socket.off('send-message-start');
      socket.off('send-message-success');
      socket.off('send-message-error');
      socket.off('receive-message-success');
      socket.off('read-message-success');
      socket.off('start-new-conversation-success');

      //////////////////////////////////////// conversations events /////////////////////////////////////////

      socket.on('start-new-conversation-success', conversation => {
        if (log) console.log('on start-new-conversation-success', conversation);
        startNewConversationSuccessDispatch(conversation);

        socket.emit('join-conversation-room', conversation._id);
        if (log) console.log('on join-conversation-room', conversation._id);
      });

      ///////////////////////////////////////// messages events ///////////////////////////////////////////
      socket.on('send-message-start', message => {// know when the same user is sending a message from another device (session)
        if (log) console.log('on send-message-start', message);
        sendMessageStartDispatch(message)
      });
      socket.on('send-message-success', message => {
        if (log) console.log('on send-message-success', message);
        sendMessageSuccessDispatch(message);

        if (message.sender !== currentUser._id) {
          if (message.conversation === conversation_id) {// we skip the receive event;
            if (log) console.log('emit read-message-start', message);
            socket.emit('read-message-start', { _id: message._id, readBy: currentUser._id });
            readMessageStartDispatch(message);
          } else {
            if (log) console.log('emit receive-message-start', message);
            socket.emit('receive-message-start', { _id: message._id, receivedBy: currentUser._id });
            receiveMessageStartDispatch(message);
          }

        }

      });
      socket.on('send-message-error', error => {
        if (log) console.log('on send-message-error', error)
      });

      socket.on('receive-message-success', message => {
        if (log) console.log('on receive-message-success', message);
        receiveMessageSuccessDispatch(message);
        if (message.sender !== currentUser._id) {
          if (message.conversation === conversation_id) {
            if (log) console.log('emit read-message-start', message);
            socket.emit('read-message-start', { _id: message._id, readBy: currentUser._id });
            readMessageStartDispatch(message);
          }
        }
      })

      socket.on('read-message-success', message => {
        if (log) console.log('on read-message-success', message);
        readMessageSuccessDispatch(message);
      })
    }

  }, [socket, currentUser, conversation_id]);


  ////////////////////////////////////////////////////////// EVENT SYNC ////////////////////////////////////////////////

  useEffect(() => { //Sync Messages

    if (socket && messages && !syncLock.current) {
      messages
        .filter(message => message.sender !== currentUser._id && message.status !== 'read')// only received messages
        .map(message => {
          // console.log(message);
          if (conversation_id === message.conversation) {
            socket.emit('read-message-start', { _id: message._id, readBy: currentUser._id });
            console.log('read-message-start', message)
            readMessageStartDispatch(message);
          } else if (!message.receivedBy.find(rcb => rcb === currentUser._id)) {
            socket.emit('receive-message-start', { _id: message._id, receivedBy: currentUser._id });
            console.log('receive-message-start', message)
            receiveMessageStartDispatch(message);
          }

          return '';
        })
    }

  }, [socket, messages, conversation_id,])

  ///////////////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////////
  if (!conversations || !conversationMessagesSelector(conversation_id)) {
    return <p>Loading...</p>;
  }
  const firstMessage = conversationFirstMessageSelector(conversation_id);
  const conversationMessages = conversationMessagesSelector(conversation_id);
  const conversationParticipants = conversationSelector(conversation_id)?.participants.filter(part => part._id !== currentUser._id);
  return (
    <div id="panel">
      <div id="frame">
        <div id="sidepanel">
          <SenderInfo
            fullName={currentUser.fullName}
            avatar={currentUser.avatar}
          />
          <div id="search">
            <label htmlFor="search-contact">
              <i className="fa fa-search" aria-hidden="true"></i>
            </label>
            <input id="search-contact" type="text" placeholder="Search contacts..." />
          </div>

          <ConversationsList
            currentUser={currentUser}
            conversations={conversations}
          />
        </div>
        <div className="content">
          <RecipientInfo
            avatar={conversationParticipants && conversationParticipants[0].avatar}
            fullName={conversationParticipants && conversationParticipants[0].fullName}
            username={conversationParticipants && conversationParticipants[0].username}
          />
          <Messages
            conversation_id={conversation_id}
            messages={conversationMessages}
            firstSentAt={firstMessage ? new Date(firstMessage.sentAt) : null}
            userId={currentUser._id}
            messagesFetching={messagesFetching}
          />
          <div className="message-input">
            <div className="wrap"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    currentUser: selectCurrentUser(state),
    conversations: state.chat.conversations,
    conversationsFetching: state.chat.conversationsFetching,
    fetchConversationsError: state.chat.fetchConversationsError,
    messages: state.chat.messages,
    messagesFetching: state.chat.messagesFetching,
    fetchMessagesError: state.chat.fetchMessagesError,
    conversationSelector: (conversation_id) => selectConversation(state, conversation_id),
    conversationMessagesSelector: (conversation_id) => selectConversationMessages(state, conversation_id),
    conversationLastMessageSelector: (conversation_id) => selectConversationLastMessage(state, conversation_id),
    conversationFirstMessageSelector: (conversation_id) => selectConversationFirstMessage(state, conversation_id)

  };
};

const mapDistpachToProps = (dispatch) => ({
  fetchConversationsDispatch: (offset) => dispatch(fetchConversations(offset)),
  fetchFollowersDispatch: (offset) => dispatch(fetchFollowers(offset)),
  fetchMessagesDispatch: (conversation_id, offset) => dispatch(fetchMessages(conversation_id, offset)),
  startNewConversationSuccessDispatch: (conversation) => dispatch(startNewConversationSuccess(conversation)),
  sendMessageStartDispatch: (message) => dispatch(sendMessageStart(message)),
  sendMessageSuccessDispatch: (message) => dispatch(sendMessageSuccess(message)),
  receiveMessageStartDispatch: (payload) => dispatch(receiveMessageStart(payload)),
  receiveMessageSuccessDispatch: (payload) => dispatch(receiveMessageSuccess(payload)),
  readMessageStartDispatch: (payload) => dispatch(readMessageStart(payload)),
  readMessageSuccessDispatch: (payload) => dispatch(readMessageSuccess(payload)),
});

export default connect(mapStateToProps, mapDistpachToProps)(ChatPanel);
