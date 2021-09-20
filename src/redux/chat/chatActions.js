import chatTypes from "./chatTypes";

import firebase from "../../firebase";
import {
  postMessage,
  retrieveConversations,
} from "../../services/chatServices";

export const fetchConversations =
  (offset = 0) =>
  async (dispatch) => {
    dispatch({ type: chatTypes.FETCH_CONVERSATIONS_STARTED });
    try {
      let conversations = await retrieveConversations(offset);
      dispatch({
        type: chatTypes.FETCH_CONVERSATIONS_SUCCESS,
        payload: {
          conversations,
        },
      });
      return;
    } catch (err) {
      console.error("Error while retrieving conversations");
      console.error(err);
    }
    dispatch({
      type: chatTypes.FETCH_CONVERSATIONS_ERROR,
      payload: {
        error: "An Error occurred while connecting to chat service",
      },
    });
  };

export const sendNewMessage = (payload) => async (dispatch) => {
  dispatch({ type: chatTypes.SEND_MESSAGE_STARTED });
  try {
    let message = await postMessage(payload);
    dispatch({
      type: chatTypes.SEND_MESSAGE_SUCCESS,
      payload: {
        message,
      },
    });
    dispatch(fetchConversations(0));
    return;
  } catch (err) {
    console.error("Error while sending message");
    console.error(err);
  }
  dispatch({
    type: chatTypes.SEND_MESSAGE_ERROR,
    payload: {
      error: "An Error occurred while connecting to chat service",
    },
  });
};
