import chatTypes from "./chatTypes";

export const INITIAL_STATE = {
  conversations: null,
  fetchConversationsError: null,
  conversationsFetching: false,
  sendMessageLoading: false,
  sendMessageError: null,
};

const chatReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case chatTypes.FETCH_CONVERSATIONS_STARTED: {
      return {
        ...state,
        fetchConversationsError: false,
        conversationsFetching: true,
      };
    }
    case chatTypes.FETCH_CONVERSATIONS_ERROR: {
      return {
        ...state,
        fetchConversationsError: action.payload.error,
        conversationsFetching: false,
      };
    }
    case chatTypes.FETCH_CONVERSATIONS_SUCCESS: {
      return {
        ...state,
        fetchConversationsError: null,
        conversationsFetching: false,
        conversations: action.payload.conversations,
      };
    }
    case chatTypes.SEND_MESSAGE_STARTED: {
      return {
        ...state,
        sendMessageLoading: true,
        sendMessageError: null,
      };
    }
    case chatTypes.SEND_MESSAGE_SUCCESS: {
      return {
        ...state,
        sendMessageLoading: false,
        sendMessageError: null,
      };
    }
    case chatTypes.SEND_MESSAGE_ERROR: {
      return {
        ...state,
        sendMessageLoading: false,
        sendMessageError: action.payload.error,
      };
    }
    default:
      return state;
  }
};

export default chatReducer;
