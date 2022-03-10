import chatTypes from "./chatTypes";

export const INITIAL_STATE = {
  conversations: [],
  conversationsFetching: false,
  fetchConversationsError: null,
  messages: [],
  messagesFetching: false,
  fetchMessagesError: null,
  syncMessagesFetching: false,
  fetchSyncMessagesError: null,
  followers: [],
  followersFetching: false,
  fetchFollowersError: null
};

const chatReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case chatTypes.FETCH_FOLLOWERS_START: {
      return {
        ...state,
        fetchFollowersError: false,
        followersFetching: true,
      };
    }
    case chatTypes.FETCH_FOLLOWERS_SUCCESS: {
      return {
        ...state,
        fetchFollowersError: null,
        followersFetching: false,
        followers: payload.followers,
      };
    }
    case chatTypes.FETCH_FOLLOWERS_ERROR: {
      return {
        ...state,
        fetchFollowingsError: payload.error,
        followingsFetching: false,
      };
    }
    case chatTypes.FETCH_FOLLOWINGS_START: {
      return {
        ...state,
        fetchFollowingsError: false,
        followingsFetching: true,
      };
    }
    case chatTypes.FETCH_FOLLOWINGS_SUCCESS: {
      return {
        ...state,
        fetchFollowingsError: null,
        followingsFetching: false,
        followings: payload.followings,
      };
    }
    case chatTypes.FETCH_FOLLOWINGS_ERROR: {
      return {
        ...state,
        fetchFollowersError: payload.error,
        followersFetching: false,
      };
    }
    case chatTypes.FETCH_CONVERSATIONS_START: {
      return {
        ...state,
        fetchMessagesError: false,
        conversationsFetching: true,
      };
    }
    case chatTypes.FETCH_CONVERSATIONS_SUCCESS: {

      return {
        ...state,
        fetchConversationsError: null,
        conversationsFetching: false,
        conversations: payload.conversations,
      };
    }
    case chatTypes.FETCH_CONVERSATIONS_ERROR: {
      return {
        ...state,
        fetchConversationsError: payload.error,
        conversationsFetching: false,
      };
    }
    ///////////////////////////////////////// socket.io conversations actions ////////////////////////////////
    case chatTypes.START_NEW_CONVERSATION_START: {
      return {
        ...state,
      };
    }
    case chatTypes.START_NEW_CONVERSATION_SUCCESS: {
      const newConversations = [payload, ...state.conversations];
      return {
        ...state,
        conversations: newConversations,
        // participants: uniqueParticipants
      };
    }
    case chatTypes.START_NEW_CONVERSATION_ERROR: {
      return {
        ...state,
      };
    }
    case chatTypes.FETCH_MESSAGES_START: {
      return {
        ...state,
        fetchMessagesError: false,
        messagesFetching: true,
      };
    }

    case chatTypes.FETCH_MESSAGES_SUCCESS: {
      return {
        ...state,
        fetchMessagesError: null,
        messagesFetching: false,
        messages: [...payload.messages, ...state.messages ? state.messages : []]
      };
    }
    case chatTypes.FETCH_MESSAGES_ERROR: {
      return {
        ...state,
        fetchMessagesError: payload.error,
        messagesFetching: false,
      };
    }
    //////////////////////////////////////////////////////////////////////// SYNC MESSAGES ( when user disconnect and reconnect while styaing on same page (ex : loosing internet connection))

    case chatTypes.FETCH_SYNC_MESSAGES_START: {
      return {
        ...state,
        fetchSyncMessagesError: false,
        syncMessagesFetching: true,
      };
    }

    case chatTypes.FETCH_SYNC_MESSAGES_SUCCESS: {
      return {
        ...state,
        fetchSyncMessagesError: null,
        syncMessagesFetching: false,
        messages: [...payload.messages, ...state.messages.filter(message => message.conversation !== payload.conversation_id)]
      };
    }
    case chatTypes.FETCH_SYNC_MESSAGES_ERROR: {
      return {
        ...state,
        fetchSyncMessagesError: payload.error,
        syncMessagesFetching: false,
      };
    }

    /////////////////////////////////////// upload media actions ///////////////////////////////////
    case chatTypes.ADD_MESSAGE: {
      const { payload: message } = action;

      return {
        ...state,
        messages: [...state.messages, message],
        conversations: state.conversations.map(conv => conv._id === message.conversation ? { ...conv, lastMessageSentAt: message.sentAt } : conv)
      };
    }
    ///////////////////////////////////////// socket.io conversations actions ////////////////////////////////

    case chatTypes.FOLLOW_USER_SUCCESS: {
      const { payload: following } = action;
      const newFollowings = [...state.followings, following];
      return {
        ...state,
        followings: newFollowings

      };
    }
    case chatTypes.UNFOLLOW_USER_SUCCESS: {
      const { payload: following } = action;
      const newFollowings = state.followings.filter(fol => fol._id !== following._id);
      return {
        ...state,
        followings: newFollowings
      };
    }
    case chatTypes.ADD_FOLLOWER: {
      const { payload: follower } = action;
      const newFollowers = [...state.followers, follower];
      return {
        ...state,
        followers: newFollowers

      };
    }
    case chatTypes.REMOVE_FOLLOWER: {
      const { payload: follower } = action;
      const newFollowers = state.followers.filter(fol => fol._id !== follower._id);
      return {
        ...state,
        followers: newFollowers
      };
    }

    case chatTypes.SEND_MESSAGE_START: {
      const { payload: message } = action;

      const messageToUpdate = state.messages.find(m => {
        return m._id === message._id
      });
      let newMessages;
      let newConversation;
      if (messageToUpdate) {
        newMessages = state.messages.map(m => m._id === message._id ? message : m)
      } else {
        newMessages = [...state.messages, message];
        newConversation = state.conversations.map(conv => conv._id === message.conversation ? { ...conv, lastMessageSentAt: message.sentAt } : conv)

      }
      return {
        ...state,
        messages: newMessages,
        conversations: newConversation ? newConversation : state.conversations
      };
    }
    case chatTypes.SEND_MESSAGE_SUCCESS: {
      const { payload: message } = action;

      const messageToUpdate = state.messages.find(m => {
        return m._id === message._id
      });
      let newMessages;
      let newConversation;
      if (messageToUpdate) {
        newMessages = state.messages.map(m => m._id === message._id ? message : m)
      } else {
        newMessages = [...state.messages, message];
        newConversation = state.conversations.map(conv => conv._id === message.conversation ? { ...conv, lastMessageSentAt: message.sentAt } : conv)
      }
      return {
        ...state,
        messages: newMessages,
        conversations: newConversation ? newConversation : state.conversations
      };
    }
    case chatTypes.RECEIVE_MESSAGE_SUCCESS: {
      const { payload: message } = action;

      const messageToUpdate = state.messages.find(m => {
        return m._id === message._id
      });
      let newMessages;
      let newConversation;
      if (messageToUpdate) {
        newMessages = state.messages.map(m => m._id === message._id ? message : m)
      } else {
        newMessages = [...state.messages, message];
        newConversation = state.conversations.map(conv => conv._id === message.conversation ? { ...conv, lastMessageSentAt: message.sentAt } : conv)
      }
      return {
        ...state,
        messages: newMessages,
        conversations: newConversation ? newConversation : state.conversations

      };
    }
    case chatTypes.READ_MESSAGE_SUCCESS: {
      const { payload: message } = action;

      const messageToUpdate = state.messages.find(m => {
        return m._id === message._id
      });
      let newMessages;
      let newConversation;
      if (messageToUpdate) {
        newMessages = state.messages.map(m => m._id === message._id ? message : m)
      } else {
        newMessages = [...state.messages, message];
        newConversation = state.conversations.map(conv => conv._id === message.conversation ? { ...conv, lastMessageSentAt: message.sentAt } : conv)
      }
      return {
        ...state,
        messages: newMessages,
        conversations: newConversation ? newConversation : state.conversations
      };
    }

    case chatTypes.UPDATE_CONVERSATION_UNREAD_MESSAGES: {
      const { payload: { conversation_id, unreadMessagesCount } } = action;

      const conversation = state.conversations.find(conv => conv._id === conversation_id);
      if (!conversation) return state;

      const newConversations = state.conversations.map(conv => conv._id !== conversation_id ? conv : { ...conversation, unreadMessagesCount })
      return {
        ...state,
        conversations: newConversations,
      }
    }
    case chatTypes.UPDATE_PARTICIPANT_LAST_TIME_ONLINE_SUCCESS: {
      const { payload: { participant_id, lastTimeOnline } } = action;

      const newConversations = state.conversations.map(conv => {
        const newParticipants = conv.participants.map(part => part._id !== participant_id ? part : { ...part, lastTimeOnline })
        return { ...conv, participants: newParticipants }
      })

      return {
        ...state,
        conversations: newConversations,
      }
    }
    case chatTypes.UPDATE_CONVERSATION_PARTICIPANT_IS_TYPING_SUCCESS: {
      const { payload: { conversation_id, participant_id, isTyping } } = action;

      const newConversations = state.conversations.map(conv => {
        if (conv._id !== conversation_id) return conv;
        const newParticipants = conv.participants.map(part => part._id !== participant_id ? part : { ...part, isTyping })
        return { ...conv, participants: newParticipants }
      })

      return {
        ...state,
        conversations: newConversations,
      }
    }
    default:
      return state;
  }
};

export default chatReducer;
