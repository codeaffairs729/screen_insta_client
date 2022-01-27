import React from "react";
import { connect } from "react-redux";
import "./ChatPanel.css";
import { ChatItem } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { useHistory } from "react-router";
import { selectConversationLastSentAt } from '../../../redux/chat/chatSelectors'

const ConversationsList = ({ conversations, conversationLastSentAtSelector }) => {
  const history = useHistory();
  return (
    <div id="conversations-list">
      {conversations.map((conversation) => {
        console.log(conversationLastSentAtSelector(conversation._id));
        return (
          <ChatItem
            key={conversation._id}
            onClick={() => history.push("/messages/" + conversation._id)}
            avatar={conversation.avatar}
            alt={""}
            title={"titre de la conversation"}
            subtitle={"descriptions "}
            date={conversationLastSentAtSelector(conversation._id)}
            unread={0}
          />
        );
      })}
    </div>
  );
};
const mapStateToProps = state => ({
  conversationLastSentAtSelector: (conversation_id) => selectConversationLastSentAt(state, conversation_id)
})
export default connect(mapStateToProps, null)(ConversationsList);
