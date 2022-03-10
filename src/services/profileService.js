import axios from "axios";
import firebase from "../firebase";
/**
 * Fetches the profile information of a specific user
 * @function getUserProfile
 * @param {string} username Username of profile to fetch
 */
export const getUserProfile = async (username) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.get(`/api/user/${username}`, {
      headers: { authorization: token },
    });
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Follows or unfollows a user with a given id depending on
 * whether they are already followed
 * @function followUser
 * @param {string} userId The id of the user to follow/unfollow
 * @param {string} authToken A user's auth token
 */
export const followUser = async (userId, authToken) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.post(`/api/user/${userId}/follow`, null, {
      headers: { authorization: token },
    });
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Retrieves who the user is following
 * @function retrieveUserFollowing
 * @param {string} userId The id of the user to retrieve following users from
 * @param {number} offset The offset of how many users to skip for the next fetch
 * @param {string} authToken A user's auth token
 */
export const retrieveUserFollowing = async (userId, offset) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.get(
      `/api/user/${userId}/${offset}/following`,
      {
        headers: { authorization: token },
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Retrieves who is following the user
 * @function retrieveUserFollowing
 * @param {string} userId The id of the user to retrieve followers from
 * @param {number} offset The offset of how many users to skip for the next fetch
 * @param {string} authToken A user's auth token
 */
export const retrieveUserFollowers = async (userId, offset, authToken) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.get(
      `/api/user/${userId}/${offset}/followers`,
      {
        headers: { authorization: token },
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};
