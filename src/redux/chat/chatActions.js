import chatTypes from "./chatTypes";

import {
  getConversations,
  getMessages,
  getRecipients
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
export const fetchMessages = (conversation_id, offset = 0) =>
  async (dispatch) => {
    dispatch({ type: chatTypes.FETCH_MESSAGES_START });
    try {
      let messages = await getMessages(conversation_id, offset);
      dispatch({
        type: chatTypes.FETCH_MESSAGES_SUCCESS,
        payload: {
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

// export const sendNewMessage = (payload) => async (dispatch) => {
//   dispatch({ type: chatTypes.SEND_MESSAGE_START });
//   try {
//     let message = await postMessage(payload);
//     dispatch({
//       type: chatTypes.SEND_MESSAGE_SUCCESS,
//       payload: {
//         message,
//       },
//     });
//   } catch (err) {
//     console.error("Error while sending message");
//     console.error(err);
//   }
//   dispatch({
//     type: chatTypes.SEND_MESSAGE_ERROR,
//     payload: {
//       error: "An Error occurred while connecting to chat service",
//     },
//   });
// };
//socket.io in 

//socket.io out
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
