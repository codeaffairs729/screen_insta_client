import { createSelector } from "reselect";


export const selectConversations = createSelector(
  (state) => state.chat,
  (chat) => chat.conversations
);


export const selectConversation = createSelector(
  [
    state => state.chat.conversations,
    (state, conversation_id) => conversation_id,
  ],
  (conversations, conversation_id) => conversations.find(conv => conv._id === conversation_id)
);
export const selectConversationMessages = createSelector(
  [
    state => state.chat.messages,
    (state, conversation_id) => conversation_id,
  ],
  (messages, conversation_id) => messages.filter(message => message.conversation === conversation_id)
);

export const selectConversationLastMessage = createSelector(
  [
    selectConversationMessages,
  ],
  messages => messages.length > 0 ? messages[messages.length - 1] : null

)
export const selectConversationFirstMessage = createSelector(
  [
    selectConversationMessages,
  ],
  messages => messages.length > 0 ? messages[0] : null
)
export const selectConversationUnreadMessages = createSelector(
  [
    selectConversationMessages,
    (state, conversation_id, user_id) => user_id,
  ],
  (messages, user_id) => messages.filter(message => message.sender !== user_id && message.status === 'received')

)
export const selectNotParticipantsFollowers = createSelector(
  [
    state => state.chat.followers,
    state => state.chat.conversations
  ],
  (followers, conversations) => {
    const participants = conversations.map(conversation => conversation.participants).flat();
    console.log(participants)
    // if a follower is already in a conversation it should be removed
    return followers.filter(follower => !participants.find(participant => participant._id === follower._id));

  }

)