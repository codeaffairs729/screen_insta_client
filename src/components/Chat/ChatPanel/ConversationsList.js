import React from "react";
import { connect } from "react-redux";
import "./ChatPanel.css";
import { ChatItem } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { useHistory } from "react-router";
import { useSocket } from "../../../providers/SocketProvider"
import { selectConversationLastMessage, selectConversationUnreadMessages, selectNotParticipantsFollowers } from '../../../redux/chat/chatSelectors'
import { startNewConversationStart } from '../../../redux/chat/chatActions'
const ConversationsList = ({ currentUser, conversations, notParticipantsFollowersSelector, conversationLastMessageSelector, conversationUnreadMessagesSelector, startNewConversationStartDispatch }) => {
  const history = useHistory();
  const notParticipantsFollowers = notParticipantsFollowersSelector();
  const socket = useSocket();


  const handleStartNewConversation = (participants) => {
    if (socket) {
      socket.emit('start-new-conversation-start', participants);
      startNewConversationStartDispatch(participants);
    }
  }

  return (
    <div id="conversations-list">
      {conversations.map((conversation) => {
        const participants = conversation.participants.filter(part => part._id !== currentUser._id);// exclude current user
        const lastMessage = conversationLastMessageSelector(conversation._id);
        const unreadMessages = conversationUnreadMessagesSelector(conversation._id, currentUser._id)
        console.log(notParticipantsFollowers);

        return (
          <ChatItem
            key={conversation._id}
            onClick={() => history.push("/messages/" + conversation._id)}
            avatar={conversation.avatar}
            alt={""}
            title={participants[0].fullName}
            subtitle={lastMessage ? lastMessage.text : ''}
            date={lastMessage ? new Date(lastMessage.sentAt) : null}
            unread={unreadMessages ? unreadMessages.length : 0}
          />
        );
      })}
      <div></div>
      {
        notParticipantsFollowers.map((npFollower) => {
          return (
            <ChatItem
              key={npFollower._id}
              onClick={(e) => handleStartNewConversation([currentUser._id, npFollower._id])}
              avatar={npFollower.avatar}
              alt={""}
              title={npFollower.fullName}
              subtitle={"Click to start a conversation"}
              date={null}
            // unread={0}
            />
          );
        })}
    </div>
  );
};
const mapStateToProps = state => ({
  conversationLastMessageSelector: (conversation_id) => selectConversationLastMessage(state, conversation_id),
  conversationUnreadMessagesSelector: (conversation_id, user_id) => selectConversationUnreadMessages(state, conversation_id, user_id),
  notParticipantsFollowersSelector: () => selectNotParticipantsFollowers(state)
})
const mapDistpachToProps = (dispatch) => ({
  startNewConversationStartDispatch: (participants) => dispatch(startNewConversationStart(participants)),

});

export default connect(mapStateToProps, mapDistpachToProps)(ConversationsList);
