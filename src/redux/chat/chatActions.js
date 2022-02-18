import chatTypes from "./chatTypes";

import {
  getConversations,
  getMessages,
  getSyncMessages,
  getRecipients,
  getFollowers,
  postConversation
} from "../../services/chatServices";

export const fetchConversations = (offset = 0) =>
  async (dispatch) => {
    dispatch({ type: chatTypes.FETCH_CONVERSATIONS_START });
    try {
      let conversations = await getConversations(offset);
      dispatch({
        type: chatTypes.FETCH_CONVERSATIONS_SUCCESS,
        payload: {
          conversations,
        },
      });
      return (conversations);
    } catch (err) {
      console.error("Error while retrieving conversations");
      dispatch({
        type: chatTypes.FETCH_CONVERSATIONS_ERROR,
        payload: {
          error: "Error while retrieving conversations",
        },
      });
    }

  };
export const startNewConversation = (participants, onStartNewConversationSuccess) =>
  async (dispatch) => {
    dispatch({ type: chatTypes.START_NEW_CONVERSATION_START });
    try {
      let conversation = await postConversation(participants);
      dispatch({
        type: chatTypes.START_NEW_CONVERSATION_SUCCESS,
        payload: {
          conversation,
        },
      });
      onStartNewConversationSuccess(conversation)
    } catch (err) {
      console.error("Error while retrieving conversations");
      dispatch({
        type: chatTypes.START_NEW_CONVERSATION_ERROR,
        payload: {
          error: "Error while retrieving conversations",
        },
      });
    }

  };
export const fetchFollowers = (offset = 0) =>
  async (dispatch) => {
    dispatch({ type: chatTypes.FETCH_FOLLOWERS_START });
    try {
      let followers = await getFollowers(offset);
      dispatch({
        type: chatTypes.FETCH_FOLLOWERS_SUCCESS,
        payload: {
          followers,
        },
      });
    } catch (err) {
      console.error("Error while retrieving followers");
      dispatch({
        type: chatTypes.FETCH_FOLLOWERS_ERROR,
        payload: {
          error: "Error while retrieving followers",
        },
      });
    }

  };
export const fetchMessages = (conversation_id, firstSentAt) =>
  async (dispatch) => {
    dispatch({ type: chatTypes.FETCH_MESSAGES_START });
    try {
      let messages = await getMessages(conversation_id, firstSentAt);
      dispatch({
        type: chatTypes.FETCH_MESSAGES_SUCCESS,
        payload: {
          conversation_id,
          messages,
        },
      });
    } catch (err) {
      console.error("Error while retrieving messages");
      console.error(err);
      dispatch({
        type: chatTypes.FETCH_MESSAGES_ERROR,
        payload: {
          error: "Error while retrieving messages",
        },
      });
    }

  };
export const fetchSyncMessages = (conversation_id) =>
  async (dispatch, getState) => {
    const messages = getState().chat.messages.filter(message => message.conversation === conversation_id);
    if (messages.length === 0) return console.error('could not start sync on empty messages');
    const firstSentAt = messages[0].sentAt;

    dispatch({ type: chatTypes.FETCH_SYNC_MESSAGES_START });
    try {
      let messages = await getSyncMessages(conversation_id, firstSentAt);
      dispatch({
        type: chatTypes.FETCH_SYNC_MESSAGES_SUCCESS,
        payload: {
          conversation_id,
          messages,
        },
      });
    } catch (err) {
      console.error("Error while retrieving messages");
      console.error(err);
      dispatch({
        type: chatTypes.FETCH_SYNC_MESSAGES_ERROR,
        payload: {
          error: "Error while retrieving messages",
        },
      });
    }

  };
export const fetchRecipients = (offset = 0) =>
  async (dispatch) => {
    dispatch({ type: chatTypes.FETCH_RECIPIENTS_START });
    try {
      let conversations = await getRecipients(offset);
      dispatch({
        type: chatTypes.FETCH_RECIPIENTS_SUCCESS,
        payload: {
          conversations,
        },
      });
    } catch (err) {
      console.error("Error while retrieving conversations");
      dispatch({
        type: chatTypes.FETCH_RECIPIENTS_ERROR,
        payload: {
          error: "Error while retrieving conversations",
        },
      });
    }

  };


export const addMessage = (message) => ({
  type: chatTypes.ADD_MESSAGE,
  payload: message,
})

//socket.io out messages actions
export const startNewConversationStart = (payload) => ({
  type: chatTypes.START_NEW_CONVERSATION_START,
  payload,
})
export const startNewConversationSuccess = (message) => ({
  type: chatTypes.START_NEW_CONVERSATION_SUCCESS,
  payload: message,
})
export const startNewConversationError = (error) => ({
  type: chatTypes.START_NEW_CONVERSATION_ERROR,
  payload: error,
})

//socket.io out messages actions
export const sendMessageStart = (message) => ({
  type: chatTypes.SEND_MESSAGE_START,
  payload: message,
})
export const sendMessageSuccess = (message) => ({
  type: chatTypes.SEND_MESSAGE_SUCCESS,
  payload: message,
})
export const receiveMessageStart = (message) => ({
  type: chatTypes.RECEIVE_MESSAGE_START,
  payload: message,
})
export const receiveMessageSuccess = (message) => ({
  type: chatTypes.RECEIVE_MESSAGE_SUCCESS,
  payload: message,
})
export const readMessageStart = (message) => ({
  type: chatTypes.READ_MESSAGE_START,
  payload: message,
})
export const readMessageSuccess = (message) => ({
  type: chatTypes.READ_MESSAGE_SUCCESS,
  payload: message,
})
