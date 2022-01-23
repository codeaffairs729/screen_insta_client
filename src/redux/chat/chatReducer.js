import chatTypes from "./chatTypes";

export const INITIAL_STATE = {
  conversations: null,
  conversationsFetching: false,
  fetchConversationsError: null,
};

const chatReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case chatTypes.FETCH_CONVERSATIONS_START: {
      return {
        ...state,
        fetchConversationsError: false,
        conversationsFetching: true,
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
    case chatTypes.FETCH_CONVERSATIONS_ERROR: {
      return {
        ...state,
        fetchConversationsError: action.payload.error,
        conversationsFetching: false,
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
        messages: [...state.messages ? state.messages : [], ...action.payload.messages]
      };
    }
    case chatTypes.FETCH_MESSAGES_ERROR: {
      return {
        ...state,
        fetchMessagesError: action.payload.error,
        messagesFetching: false,
      };
    }
    case chatTypes.SEND_MESSAGE_START: {
      const { payload: message } = action;

      return {
        ...state,
        messages: [...state.messages, message],
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
