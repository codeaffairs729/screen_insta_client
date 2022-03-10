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
export const selectAllUnreadMessagesCount = createSelector(
  [selectConversations],
  conversations => conversations.reduce((pv, cv) => pv + cv.unreadMessagesCount, 0)
)

export const selectConversationParticipants = createSelector(
  [selectConversation,
    (state, conversation_id, user_id) => user_id
  ],
  /// TO-DO remake when normalizing conversations 
  (conversation, user_id) => conversation?.participants.filter(part => part._id !== user_id)
)
export const selectParticipantConversation = createSelector(
  [selectConversations,
    (state, participant_id) => participant_id
  ],
  // only two participants conversation (not group conversations) 
  (conversations, participant_id) => conversations.filter(conv => conv.participants.length === 2).find(conv => conv.participants.find(part => part._id === participant_id))
)

export const selectNotParticipantsFollowersAndFollowings = createSelector(
  [
    state => state.chat.followers,
    state => state.chat.followings,
    state => state.chat.conversations
  ],
  (followers, followings, conversations) => {
    const participants = conversations.map(conversation => conversation.participants).flat();
    // if a follower is already in a conversation it should be removed
    //don't include users already in conversation (only in two participant conversation )
    const notParticipantsfollowers = followers.filter(follower => !participants.find(participant => participant._id === follower._id));
    const notParticipantsfollowings = followings.filter(following => !participants.find(participant => participant._id === following._id));

    //avoid repeated followers/followees
    const notParticipantsFollowersAndFollowingsUniqueIds = [...new Set([...notParticipantsfollowers.map(f => f._id), ...notParticipantsfollowings.map(f => f._id)])];
    // console.log(notParticipantsFollowersAndFollowingsUniqueIds)
    return notParticipantsFollowersAndFollowingsUniqueIds.map(npfu_Id => notParticipantsfollowers.find(npf => npf._id === npfu_Id) || notParticipantsfollowings.find(npf => npf._id === npfu_Id));


  })

export const selectIsFollowing = createSelector(
  [
    state => state.chat.followings,
    (state, user_id) => user_id
  ],
  (followings, user_id) => !!followings.find(following => following._id === user_id)

)