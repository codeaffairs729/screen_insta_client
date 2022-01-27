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
  (conversations, conversation_id) => conversations?.find(conv => conv._id === conversation_id)
);
export const selectConversationMessages = createSelector(
  [
    state => state.chat.messages,
    (state, conversation_id) => conversation_id,
  ],
  (messages, conversation_id) => messages ? messages.filter(message => message.conversation === conversation_id) : []
);

export const selectConversationLastSentAt = createSelector(
  [
    state => state.chat.messages,
    (state, conversation_id) => conversation_id,
  ],
  (messages, conversation_id) => {
    if (messages) {
      const conversationMessages = messages.filter(message => message.conversation === conversation_id);
      if (conversationMessages && conversationMessages.length > 0) {
        return new Date(conversationMessages[conversationMessages.length - 1].sentAt);
      }
    }
    return null;
  }

)
export const selectConversationFirstSentAt = createSelector(
  [
    state => state.chat.messages,
    (state, conversation_id) => conversation_id,
  ],
  (messages, conversation_id) => {
    if (messages) {
      const conversationMessages = messages.filter(message => message.conversation === conversation_id);
      if (conversationMessages && conversationMessages.length > 0) {
        return new Date(conversationMessages[0].sentAt);
      }
    }
    return null;
  }

)