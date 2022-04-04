import axios from "axios";
import firebase from "../firebase";

export const getConversations = async (offset = 0) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.get(
      `/api/chat/conversations?offset=${offset}`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};
export const getCalls = async (offset = 0) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.get(
      `/api/chat/calls?offset=${offset}`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};
export const getCallById = async (_id) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.get(
      `/api/chat/calls/${_id}`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};
export const postConversation = async (participants) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.post(
      `/api/chat/conversations`,
      { participants },
      {
        headers: {
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};
export const getFollowers = async (params) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.get(
      `/api/chat/followers`,
      {
        headers: {
          authorization: token,
        },
        params
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};
export const getFollowings = async (params) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.get(
      `/api/chat/followings`,
      {
        headers: {
          authorization: token,
        },
        params
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};
export const getMessages = async (conversation, firstSentAt) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.get(
      `/api/chat/messages`,
      {
        headers: {
          authorization: token,
        },
        params: { conversation, firstSentAt }
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};
export const getSyncMessages = async (conversation, firstSentAt) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.get(
      `/api/chat/syncmessages`,
      {
        headers: {
          authorization: token,
        },
        params: { conversation, firstSentAt }
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};

export const getRecipients = async (offset = 0) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.get(
      `/api/chat/recipients?offset=${offset}`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};

export const postMessage = async (payload) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.post(`/api/chat/newMessage`, payload, {
      headers: {
        authorization: token,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};
