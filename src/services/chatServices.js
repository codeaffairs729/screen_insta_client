import axios from "axios";
import firebase from "../firebase";
/**
 * Retrieves posts from user's feed
 * @function retrieveFeedPosts
 * @param {string} authToken A user's auth token
 * @param {number} offset The offset of posts to retrieve
 * @returns {array} Array of posts
 */
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
