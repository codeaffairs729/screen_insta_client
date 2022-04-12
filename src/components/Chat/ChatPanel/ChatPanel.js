import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import "./ChatPanel.scss";
import ConversationsList from "./ConversationsList";
import Messages from "./Messages";
import RecipientInfo from "./RecipientInfo";
import SenderInfo from "./SenderInfo";
import { useSocket } from "../../../providers/SocketProvider"

import {
  readMessageStart,

} from "../../../redux/chat/chatActions";
import { useHistory } from "react-router-dom";
import { selectCurrentUser } from "../../../redux/user/userSelectors";
import {
  selectConversations,
  selectConversation,
  selectConversationMessages,
  selectConversationFirstMessage,
  selectConversationParticipants
} from "../../../redux/chat/chatSelectors"


const ChatPanel = ({
  currentUser,
  conversationsFetching,
  messagesFetching,
  conversationsSelector,
  conversationSelector,
  conversationMessagesSelector,
  conversationFirstMessageSelector,
  conversationParticipantsSelector,
  readMessageStartDispatch,
  currentCall

}) => {
  const { conversation_id } = useParams();
  // const syncLock = useRef(false);
  const history = useHistory();
  const socket = useSocket();

  const conversations = conversationsSelector();

  useEffect(() => {
    if (currentCall) {

      window.open("/call/" + currentCall._id,
        "mywindow", "menubar=1,resizable=1,width=550,height=550");
    }
  }, [currentCall])


  ///////////////////////////////////////// NAVIGATION //////////////////////////////////////////////////////
  useEffect(() => {

    if (conversation_id !== 'all' && conversation_id !== 'new' && !conversationsFetching && conversations.length > 0 && !conversationSelector(conversation_id))
      history.push("/messages/all");

  }, [conversationsFetching, conversationSelector, conversation_id, history]);



  const handleReadMessage = (message) => {
    if (socket) {
      socket.emit('read-message-start', { _id: message._id, readBy: currentUser._id });
      console.log('read-message-start', message);
      readMessageStartDispatch(message);
    }

  }
  ///////////////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////////

  const firstMessage = conversationFirstMessageSelector(conversation_id);
  const conversationMessages = conversationMessagesSelector(conversation_id);
  // const conversationParticipants = conversationSelector(conversation_id)?.participants.filter(part => part._id !== currentUser._id);
  const conversationParticipants = conversationParticipantsSelector(conversation_id, currentUser._id)

  if (!conversations || !conversationMessages) {
    return <p>Loading...</p>;
  }
  return (
    <div id="panel">
      <div id="frame">
        <div id="sidepanel">
          <SenderInfo
            fullName={currentUser.fullName}
            avatar={currentUser.avatar}
            balance={currentUser.balance}
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
          {conversationParticipants ?
            (<RecipientInfo
              conversation_id={conversation_id}
              avatar={conversationParticipants[0].avatar}
              fullName={conversationParticipants[0].fullName}
              username={conversationParticipants[0].username}
              lastTimeOnline={conversationParticipants[0].lastTimeOnline}
              isTyping={conversationParticipants[0].isTyping}
            />) :
            (<div className="contact-profile"></div>)}

          <Messages
            conversation_id={conversation_id}
            messages={conversationMessages}
            firstSentAt={firstMessage ? new Date(firstMessage.sentAt) : null}
            currentUser={currentUser}
            messagesFetching={messagesFetching}
            onReadMessage={handleReadMessage}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  currentUser: selectCurrentUser(state),
  currentCall: state.chat.currentCall,
  conversationsSelector: () => selectConversations(state),
  conversationsFetching: state.chat.conversationsFetching,
  conversationParticipantsSelector: (conversation_id, user_id) => selectConversationParticipants(state, conversation_id, user_id),
  messagesFetching: state.chat.messagesFetching,
  fetchMessagesError: state.chat.fetchMessagesError,
  conversationSelector: (conversation_id) => selectConversation(state, conversation_id),
  conversationMessagesSelector: (conversation_id) => selectConversationMessages(state, conversation_id),
  conversationFirstMessageSelector: (conversation_id) => selectConversationFirstMessage(state, conversation_id)
})


const mapDistpachToProps = (dispatch) => ({
  readMessageStartDispatch: (payload) => dispatch(readMessageStart(payload)),
});

export default connect(mapStateToProps, mapDistpachToProps)(ChatPanel);
