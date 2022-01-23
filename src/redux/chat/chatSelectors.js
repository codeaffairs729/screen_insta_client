import { createSelector } from "reselect";


export const selectConversations = createSelector(
  (state) => state.chat,
  (chat) => chat.conversations
);


export const selectConversation = createSelector(
  [
    state => state.chat,
    (state, conversation_id) => conversation_id,
  ],
  (chat, conversation_id) => chat?.conversations?.find(conv => conv._id === conversation_id)
);
export const selectConversationMessages = createSelector(
  [
    state => state.chat,
    (state, conversation_id) => conversation_id,
  ],
  (chat, conversation_id) => chat.messages ? chat.messages.filter(message => message.conversation === conversation_id) : []
);

// export const selectConversationMessages = createSelector(
//   [
//     state => state.chat,
//     (state, conversation_id) => conversation_id,
//   ],
//   (chat, conversation_id) => chat.conversations.find(conv => conv._id === conversation_id)?.messages
// );
// export const selectAllMessages = createSelector(

//   state => state.chat.conversations,
//   conversations => conversations ? conversations.map(conv => conv.messages).flat() : []
// );


