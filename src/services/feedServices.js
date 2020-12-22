import axios from "axios";
import firebase from "../firebase";
/**
 * Retrieves posts from user's feed
 * @function retrieveFeedPosts
 * @param {string} authToken A user's auth token
 * @param {number} offset The offset of posts to retrieve
 * @returns {array} Array of posts
 */
export const retrieveFeedPosts = async (authToken, offset = 0) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.get(`/api/post/feed/${offset}`, {
      headers: {
        authorization: token,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};
