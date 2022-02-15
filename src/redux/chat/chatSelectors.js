import { createSelector } from "reselect";


export const selectConversations = createSelector(
  (state) => state.chat.conversations,
  (conversations) => conversations.slice().sort((a, b) => new Date(b.lastMessageSentAt) - new Date(a.lastMessageSentAt))

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
    // if a follower is already in a conversation it should be removed
    //don't include users already in conversation (only in two participant conversation )
    const notParticipantsfollowers = followers.filter(follower => !participants.find(participant => participant._id === follower._id));
    //avoid repeated followers/followees
    const notParticipantsfollowersUniqueIds = [...new Set(notParticipantsfollowers.map(f => f._id))];

    return notParticipantsfollowersUniqueIds.map(npfu_Id => notParticipantsfollowers.find(npf => npf._id === npfu_Id));


  }

)