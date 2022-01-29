import chatTypes from "./chatTypes";

export const INITIAL_STATE = {
  conversations: [],
  conversationsFetching: false,
  fetchConversationsError: null,
  messages: [],
  messagesFetching: false,
  fetchMessagesError: null,
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
      return {
        ...state,
        conversations: [payload, ...state.conversations],
        // followers: payload.followerToDelete_id ? state.followers.filter(follower => follower._id !== payload.followerToDelete_id) : state.followers
      };
    }
    case chatTypes.START_NEW_CONVERSATION_ERROR: {
      return {
        ...state,
        // fetchConversationsError: payload.error,
        // conversationsFetching: false,
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
        messages: [...payload.messages, ...state.messages ? state.messages : [],]
      };
    }
    case chatTypes.FETCH_MESSAGES_ERROR: {
      return {
        ...state,
        fetchMessagesError: payload.error,
        messagesFetching: false,
      };
    }

    /////////////////////////////////////// upload media actions ///////////////////////////////////
    case chatTypes.ADD_MESSAGE: {
      const { payload: message } = action;

      return {
        ...state,
        messages: [...state.messages, message],
      };
    }
    ///////////////////////////////////////// socket.io conversations actions ////////////////////////////////

    case chatTypes.SEND_MESSAGE_START: {
      const { payload: message } = action;

      const messageToUpdate = state.messages.find(m => {
        return m._id === message._id
      });
      let newMessages;
      if (messageToUpdate) {
        newMessages = state.messages.map(m => m._id === message._id ? message : m)
      } else {
        newMessages = [...state.messages, message];
      }
      return {
        ...state,
        messages: newMessages
      };
    }
    case chatTypes.SEND_MESSAGE_SUCCESS: {
      const { payload: message } = action;

      const messageToUpdate = state.messages.find(m => {
        return m._id === message._id
      });
      let newMessages;
      if (messageToUpdate) {
        newMessages = state.messages.map(m => m._id === message._id ? message : m)
      } else {
        newMessages = [...state.messages, message];
      }
      return {
        ...state,
        messages: newMessages
      };
    }
    case chatTypes.RECEIVE_MESSAGE_SUCCESS: {
      const { payload: message } = action;

      const messageToUpdate = state.messages.find(m => {
        return m._id === message._id
      });
      let newMessages;
      if (messageToUpdate) {
        newMessages = state.messages.map(m => m._id === message._id ? message : m)
      } else {
        newMessages = [...state.messages, message];
      }
      return {
        ...state,
        messages: newMessages
      };
    }
    case chatTypes.READ_MESSAGE_SUCCESS: {
      const { payload: message } = action;

      const messageToUpdate = state.messages.find(m => {
        return m._id === message._id
      });
      let newMessages;
      if (messageToUpdate) {
        newMessages = state.messages.map(m => m._id === message._id ? message : m)
      } else {
        newMessages = [...state.messages, message];
      }
      return {
        ...state,
        messages: newMessages
      };
    }

    default:
      return state;
  }
};

export default chatReducer;
