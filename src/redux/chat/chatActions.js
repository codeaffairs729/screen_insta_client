import chatTypes from "./chatTypes";

import {
  getConversations,
  getCalls,
  getCallById,
  getMessages,
  getSyncMessages,
  getRecipients,
  getFollowers,
  getFollowings,

  // postConversation,
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
export const fetchCalls = (offset = 0) =>
  async (dispatch) => {
    dispatch({ type: chatTypes.FETCH_CONVERSATION_CALLS_START });
    try {
      let calls = await getCalls(offset);
      dispatch({
        type: chatTypes.FETCH_CONVERSATION_CALLS_SUCCESS,
        payload: {
          calls,
        },
      });
      return (calls);
    } catch (err) {
      console.error("Error while retrieving calls");
      dispatch({
        type: chatTypes.FETCH_CONVERSATION_CALLS_ERROR,
        payload: {
          error: "Error while retrieving calls",
        },
      });
    }

  };
export const fetchCallById = call_id =>

  async (dispatch) => {
    dispatch({ type: chatTypes.FETCH_CONVERSATION_CALL_BY_ID_START, payload: call_id });
    try {
      let call = await getCallById(call_id);
      dispatch({
        type: chatTypes.FETCH_CONVERSATION_CALL_BY_ID_SUCCESS,
        payload: {
          call,
        },
      });
      return (call);
    } catch (err) {
      console.error("Error while retrieving a call by id");
      dispatch({
        type: chatTypes.FETCH_CONVERSATION_CALL_BY_ID_ERROR,
        payload: {
          error: "Error while retrieving a call by id",
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
export const fetchFollowings = (offset = 0) =>
  async (dispatch) => {
    dispatch({ type: chatTypes.FETCH_FOLLOWINGS_START });
    try {
      let followings = await getFollowings(offset);
      dispatch({
        type: chatTypes.FETCH_FOLLOWINGS_SUCCESS,
        payload: {
          followings,
        },
      });
    } catch (err) {
      console.error("Error while retrieving followings");
      dispatch({
        type: chatTypes.FETCH_FOLLOWINGS_ERROR,
        payload: {
          error: "Error while retrieving followings",
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

//socket.io follow User
export const followUserStart = (user_to_follow_id) => ({
  type: chatTypes.FOLLOW_USER_START,
  payload: user_to_follow_id,
})
export const followUserSuccess = (following) => ({
  type: chatTypes.FOLLOW_USER_SUCCESS,
  payload: following,
})
export const followUserError = (error) => ({
  type: chatTypes.FOLLOW_USER_ERROR,
  payload: error,
})
//socket.io unfollow User
export const unfollowUserStart = (user_to_unfollow_id) => ({
  type: chatTypes.UNFOLLOW_USER_START,
  payload: user_to_unfollow_id,
})
export const unfollowUserSuccess = (following) => ({
  type: chatTypes.UNFOLLOW_USER_SUCCESS,
  payload: following,
})
export const unfollowUserError = (error) => ({
  type: chatTypes.UNFOLLOW_USER_ERROR,
  payload: error,
})


export const addFollower = (follower) => ({
  type: chatTypes.ADD_FOLLOWER,
  payload: follower,
})
export const removeFollower = (follower) => ({
  type: chatTypes.REMOVE_FOLLOWER,
  payload: follower,
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
export const updateConversationUnreadMessages = ({ conversation_id, unreadMessagesCount }) => ({
  type: chatTypes.UPDATE_CONVERSATION_UNREAD_MESSAGES,
  payload: { conversation_id, unreadMessagesCount },
})

export const updateParticipantLastTimeOnlineSuccess = ({ participant_id, lastTimeOnline }) => ({
  type: chatTypes.UPDATE_PARTICIPANT_LAST_TIME_ONLINE_SUCCESS,
  payload: { participant_id, lastTimeOnline },
})

export const updateConversationParticipantIsTypingStart = (payload) => ({
  type: chatTypes.UPDATE_CONVERSATION_PARTICIPANT_IS_TYPING_START,
  payload
})
export const updateConversationParticipantIsTypingSuccess = ({ conversation_id, participant_id, isTyping }) => ({
  type: chatTypes.UPDATE_CONVERSATION_PARTICIPANT_IS_TYPING_SUCCESS,
  payload: { conversation_id, participant_id, isTyping },
})

export const toggleIsMessageFree = () => ({
  type: chatTypes.TOGGLE_IS_MESSAGE_FREE
})

export const payMessageStart = (message_id) => ({
  type: chatTypes.PAY_MESSAGE_START,
  payload: message_id
})
export const payMessageSuccess = (message) => ({
  type: chatTypes.PAY_MESSAGE_SUCCESS,
  payload: message

})
export const payMessageError = (error) => ({
  type: chatTypes.PAY_MESSAGE_ERROR,
  payload: error
})

export const updateParticipantCallIdSuccess = ({ participant_id, call_id }) => ({
  type: chatTypes.UPDATE_PARTICIPANT_CALL_ID_SUCCESS,
  payload: { participant_id, call_id },
})



///////////////////////// calll actions ///////////////////
export const startConversationCallStart = (conversation_id, type = "audio") => ({
  type: chatTypes.START_CONVERSATION_CALL_START,
  payload: { conversation_id, type },
})

export const startConversationCallSuccess = call => ({
  type: chatTypes.START_CONVERSATION_CALL_SUCCESS,
  payload: call,
})


export const startConversationCallError = error => ({
  type: chatTypes.START_CONVERSATION_CALL_ERROR,
  payload: error,
})



export const connectToConversationCallStart = (call_id, peer_id) => ({
  type: chatTypes.CONNECT_TO_CONVERSATION_CALL_START,
  payload: { call_id, peer_id },
})

export const connectToConversationCallSuccess = call => ({
  type: chatTypes.CONNECT_TO_CONVERSATION_CALL_SUCCESS,
  payload: call,
})


export const connectToConversationCallError = error => ({
  type: chatTypes.CONNECT_TO_CONVERSATION_CALL_ERROR,
  payload: error,
})


export const joinConversationCallStart = ({ call_id, peer_id }) => ({
  type: chatTypes.JOIN_CONVERSATION_CALL_START,
  payload: { call_id, peer_id },
})

export const joinConversationCallSuccess = call => ({
  type: chatTypes.JOIN_CONVERSATION_CALL_SUCCESS,
  payload: call,
})


export const joinConversationCallError = error => ({
  type: chatTypes.JOIN_CONVERSATION_CALL_ERROR,
  payload: error,
})



export const leaveConversationCallStart = call_id => ({
  type: chatTypes.LEAVE_CONVERSATION_CALL_START,
  payload: call_id,
})

export const leaveConversationCallSuccess = call => ({
  type: chatTypes.LEAVE_CONVERSATION_CALL_SUCCESS,
  payload: call,
})


export const leaveConversationCallError = error => ({
  type: chatTypes.LEAVE_CONVERSATION_CALL_ERROR,
  payload: error,
})


export const endConversationCallStart = call_id => ({
  type: chatTypes.END_CONVERSATION_CALL_START,
  payload: call_id,
})

export const endConversationCallSuccess = call => ({
  type: chatTypes.END_CONVERSATION_CALL_SUCCESS,
  payload: call,
})


export const endConversationCallError = error => ({
  type: chatTypes.END_CONVERSATION_CALL_ERROR,
  payload: error,
})