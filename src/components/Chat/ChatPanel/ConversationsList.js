import React from "react";
import { connect } from "react-redux";
// import "./ChatPanel.css";
import { ChatItem } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { useHistory } from "react-router";

import { selectConversationLastMessage, selectNotParticipantsFollowersAndFollowings } from '../../../redux/chat/chatSelectors'

function formatTime(time) { //time in seconds
  var min = Math.floor(time / 60);
  var sec = Math.floor(time % 60);
  return min + ':' + ((sec < 10) ? ('0' + sec) : sec);
}
const ConversationsList = ({ currentUser, conversations, notParticipantsFollowersAndFollowingsSelector, conversationLastMessageSelector }) => {
  const history = useHistory();
  const notParticipantsFollowers = notParticipantsFollowersAndFollowingsSelector();
  // console.log(notParticipantsFollowers)
  return (
    <div id="conversations-list">
      {conversations.map((conversation) => {
        const participants = conversation.participants.filter(part => part._id !== currentUser._id);// exclude current user
        const lastMessage = conversationLastMessageSelector(conversation._id);
        return (
          <ChatItem
            key={conversation._id}
            onClick={() => history.push("/messages/" + conversation._id)}
            avatar={participants[0].avatar}
            alt={""}
            // title={'@' + participants[0].username}
            title={participants[0].username}
            subtitle={lastMessage && (<>
              {lastMessage.type === 'text' ?
                (<span className="rce-mbox-status">{lastMessage.text}</span>) :
                (<span className="rce-mbox-status">
                  {lastMessage.type === 'audio' && (<ion-icon name="mic-outline" style={{ verticalAlign: 'middle' }}></ion-icon>)}
                  {lastMessage.type === 'video' && (<ion-icon name="videocam-outline" style={{ verticalAlign: 'middle' }}></ion-icon>)}
                  {lastMessage.type === 'photo' && (<ion-icon name="camera-outline" style={{ verticalAlign: 'middle' }}></ion-icon>)}
                </span>)}
              {(lastMessage?.data?.duration) && (
                <span className="rce-mbox-status">
                  {formatTime(lastMessage.data.duration / 1000)}
                </span>)}
              {lastMessage.sender === currentUser._id && (
                <span className="rce-mbox-status">
                  {lastMessage.status === 'waiting' && (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style={{ verticalAlign: 'middle' }}><g><path d="m20.9 11.6v8.8l7.5 4.4-1.3 2.2-8.7-5.4v-10h2.5z m-0.9 21.8q5.5 0 9.4-4t4-9.4-4-9.4-9.4-4-9.4 4-4 9.4 4 9.4 9.4 4z m0-30q6.9 0 11.8 4.8t4.8 11.8-4.8 11.8-11.8 4.8-11.8-4.8-4.8-11.8 4.8-11.8 11.8-4.8z"></path></g></svg>)}
                  {lastMessage.status === 'sent' && (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style={{ verticalAlign: 'middle' }}><g><path d="m15 27l17.7-17.7 2.3 2.3-20 20-9.3-9.3 2.3-2.3z"></path></g></svg>)}
                  {lastMessage.status === 'received' && (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style={{ verticalAlign: 'middle' }}><g><path d="m30.3 10.9l-10.9 10.9-2.4-2.4 10.9-10.9z m7.3-2.4l2.4 2.4-20.6 20.6-9.6-9.6 2.4-2.4 7.2 7.1z m-37.6 13.4l2.5-2.4 9.5 9.6-2.4 2.4z"></path></g></svg>)}
                  {lastMessage.status === 'read' && (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style={{ verticalAlign: 'middle', color: 'rgb(79, 195, 247)' }}><g><path d="m30.3 10.9l-10.9 10.9-2.4-2.4 10.9-10.9z m7.3-2.4l2.4 2.4-20.6 20.6-9.6-9.6 2.4-2.4 7.2 7.1z m-37.6 13.4l2.5-2.4 9.5 9.6-2.4 2.4z"></path> </g></svg>)}
                </span>)}
            </>)}
            // date={lastMessage ? new Date(lastMessage.sentAt) : null}
            date={lastMessage ? new Date(lastMessage.sentAt) : null}
            // unread={unreadMessages ? unreadMessages.length : 0}
            unread={conversation.unreadMessagesCount}
          />
        );
      })}
      <div></div>
      {
        notParticipantsFollowers.map((npFollower) => {
          return (
            <ChatItem
              key={npFollower._id}
              // onClick={(e) => handleStartNewConversation([currentUser._id, npFollower._id])}
              onClick={() => history.push("/messages/new?participants=" + npFollower._id)}
              avatar={npFollower.avatar}
              alt={""}
              title={npFollower.fullName}
              subtitle="Start a new conversation"
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
  notParticipantsFollowersAndFollowingsSelector: () => selectNotParticipantsFollowersAndFollowings(state),

})


export default connect(mapStateToProps, null)(ConversationsList);
