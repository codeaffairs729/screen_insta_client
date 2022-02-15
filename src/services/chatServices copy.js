import axios from "axios";
import firebase from "../firebase";
/**
 * Retrieves posts from user's feed
 * @function retrieveFeedPosts
 * @param {string} authToken A user's auth token
 * @param {number} offset The offset of posts to retrieve
 * @returns {array} Array of posts
 */
export const retrieveConversations = async (offset = 0) => {
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
