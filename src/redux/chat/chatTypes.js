const chatTypes = {

  FETCH_CONVERSATIONS_START: "FETCH_CONVERSATIONS_START",
  FETCH_CONVERSATIONS_SUCCESS: "FETCH_CONVERSATIONS_SUCCESS",
  FETCH_CONVERSATIONS_ERROR: "FETCH_CONVERSATIONS_ERROR",

  FETCH_CONVERSATION_CALLS_START: "FETCH_CONVERSATION_CALLS_START",
  FETCH_CONVERSATION_CALLS_SUCCESS: "FETCH_CONVERSATION_CALLS_SUCCESS",
  FETCH_CONVERSATION_CALLS_ERROR: "FETCH_CONVERSATION_CALLS_ERROR",

  FETCH_CONVERSATION_CALL_BY_ID_START: "FETCH_CONVERSATION_CALL_BY_ID_START",
  FETCH_CONVERSATION_CALL_BY_ID_SUCCESS: "FETCH_CONVERSATION_CALL_BY_ID_SUCCESS",
  FETCH_CONVERSATION_CALL_BY_ID_ERROR: "FETCH_CONVERSATION_CALL_BY_ID_ERROR",


  FETCH_FOLLOWERS_START: "FETCH_FOLLOWERS_START",
  FETCH_FOLLOWERS_SUCCESS: "FETCH_FOLLOWERS_SUCCESS",
  FETCH_FOLLOWERS_ERROR: "FETCH_FOLLOWERS_ERROR",

  FETCH_FOLLOWINGS_START: "FETCH_FOLLOWINGS_START",
  FETCH_FOLLOWINGS_SUCCESS: "FETCH_FOLLOWINGS_SUCCESS",
  FETCH_FOLLOWINGS_ERROR: "FETCH_FOLLOWINGS_ERROR",

  FETCH_MESSAGES_START: "FETCH_MESSAGES_START",
  FETCH_MESSAGES_SUCCESS: "FETCH_MESSAGES_SUCCESS",
  FETCH_MESSAGES_ERROR: "FETCH_MESSAGES_ERROR",

  FETCH_SYNC_MESSAGES_START: "FETCH_SYNC_MESSAGES_START",
  FETCH_SYNC_MESSAGES_SUCCESS: "FETCH_SYNC_MESSAGES_SUCCESS",
  FETCH_SYNC_MESSAGES_ERROR: "FETCH_SYNC_MESSAGES_ERROR",

  //upload media message
  ADD_MESSAGE: "ADD_MESSAGE",


  //socket.io Follow/unfollow,

  FOLLOW_USER_START: "FOLLOW_USER_START",
  FOLLOW_USER_SUCCESS: "FOLLOW_USER_SUCCESS",
  FOLLOW_USER_ERROR: "FOLLOW_USER_ERROR",

  UNFOLLOW_USER_START: "UNFOLLOW_USER_START",
  UNFOLLOW_USER_SUCCESS: "UNFOLLOW_USER_SUCCESS",
  UNFOLLOW_USER_ERROR: "UNFOLLOW_USER_ERROR",

  ADD_FOLLOWER: "ADD_FOLLOWER",
  REMOVE_FOLLOWER: "REMOVE_FOLLOWER",


  //socket.io //messages action
  START_NEW_CONVERSATION_START: "START_NEW_CONVERSATION_START",
  START_NEW_CONVERSATION_SUCCESS: "START_NEW_CONVERSATION_SUCCESS",
  START_NEW_CONVERSATION_ERROR: "START_NEW_CONVERSATION_ERROR",

  //socket.io
  SEND_MESSAGE_START: "SEND_MESSAGE_START",
  SEND_MESSAGE_SUCCESS: "SEND_MESSAGE_SUCCESS",
  SEND_MESSAGE_ERROR: "SEND_MESSAGE_ERROR",

  RECEIVE_MESSAGE_START: "RECEIVE_MESSAGE_START",
  RECEIVE_MESSAGE_SUCCESS: "RECEIVE_MESSAGE_SUCCESS",
  RECEIVE_MESSAGE_ERROR: "RECEIVE_MESSAGE_ERROR",

  READ_MESSAGE_START: "READ_MESSAGE_START",
  READ_MESSAGE_SUCCESS: "READ_MESSAGE_SUCCESS",
  READ_MESSAGE_ERROR: "READ_MESSAGE_ERROR",

  //socket.io //conversations //
  // rename to UPDATE_CONVERSATION_UNREAD_MESSAGES_SUCCESS
  UPDATE_CONVERSATION_UNREAD_MESSAGES: "UPDATE_CONVERSATION_UNREAD_MESSAGES",

  UPDATE_PARTICIPANT_LAST_TIME_ONLINE_START: "UPDATE_PARTICIPANT_LAST_TIME_ONLINE_START",
  UPDATE_PARTICIPANT_LAST_TIME_ONLINE_SUCCESS: "UPDATE_PARTICIPANT_LAST_TIME_ONLINE_SUCCESS",


  UPDATE_CONVERSATION_PARTICIPANT_IS_TYPING_START: "UPDATE_CONVERSATION_PARTICIPANT_IS_TYPING_START",
  UPDATE_CONVERSATION_PARTICIPANT_IS_TYPING_SUCCESS: "UPDATE_CONVERSATION_PARTICIPANT_IS_TYPING_SUCCESS",

  TOGGLE_IS_MESSAGE_FREE: "TOGGLE_IS_MESSAGE_FREE",

  PAY_MESSAGE_START: "PAY_MESSAGE_START",
  PAY_MESSAGE_SUCCESS: "PAY_MESSAGE_SUCCESS",
  PAY_MESSAGE_ERROR: "PAY_MESSAGE_ERROR",

  /////////////////////// call actions ////////////////////////////////////////

  UPDATE_PARTICIPANT_CALL_ID_SUCCESS: "UPDATE_PARTICIPANT_CALL_ID_SUCCESS",

  START_CONVERSATION_CALL_START: "START_CONVERSATION_CALL_START",
  START_CONVERSATION_CALL_SUCCESS: "START_CONVERSATION_CALL_SUCCESS",
  START_CONVERSATION_CALL_ERROR: "START_CONVERSATION_CALL_ERROR",

  JOIN_CONVERSATION_CALL_START: "JOIN_CONVERSATION_CALL_START",
  JOIN_CONVERSATION_CALL_SUCCESS: "JOIN_CONVERSATION_CALL_SUCCESS",
  JOIN_CONVERSATION_CALL_ERROR: "JOIN_CONVERSATION_CALL_ERROR",

  LEAVE_CONVERSATION_CALL_START: "LEAVE_CONVERSATION_CALL_START",
  LEAVE_CONVERSATION_CALL_SUCCESS: "LEAVE_CONVERSATION_CALL_SUCCESS",
  LEAVE_CONVERSATION_CALL_ERROR: "LEAVE_CONVERSATION_CALL_ERROR",

  END_CONVERSATION_CALL_START: "END_CONVERSATION_CALL_START",
  END_CONVERSATION_CALL_SUCCESS: "END_CONVERSATION_CALL_SUCCESS",
  END_CONVERSATION_CALL_ERROR: "END_CONVERSATION_CALL_ERROR",


};

export default chatTypes;
