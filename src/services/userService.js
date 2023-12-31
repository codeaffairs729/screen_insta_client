import axios from "axios";
import firebase from "../firebase";
/**
 * Searches for a username that is similar to the one supplied
 * @function searchUsers
 * @param {string} username The username to search for
 * @param {number} offset The number of documents to skip
 * @returns {array} Array of users that match the criteria
 */
export const searchUsers = async (username, offset = 0) => {
  try {
    const response = await axios.get(`/api/user/${username}/${offset}/search`);
    return response.data;
  } catch (err) {
    console.warn(err);
  }
};

/**
 * Verifies a user's email
 * @function verifyUser
 * @param {string} authToken A user's auth token
 * @param {string} confirmationToken The token to verify an emailk
 */
export const confirmUser = async (authToken, confirmationToken) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    await axios.put(
      "/api/user/confirm",
      {
        token: confirmationToken,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Uploads and changes a user's avatar
 * @function changeAvatar
 * @param {object} image The image to upload
 * @param {string} authToken A user's auth token
 * @returns {string} The new avatar url
 */
export const changeAvatar = async (image) => {
  const formData = new FormData();
  formData.append("image", image);
  const token = await firebase.auth().currentUser.getIdToken();
  let url = "/api/user/avatar";
  try {
    const response = await axios.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: token,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};

export const changeCoverPicture = async (image) => {
  const formData = new FormData();
  formData.append("image", image);
  const token = await firebase.auth().currentUser.getIdToken();
  let url = "/api/user/coverPicture";
  try {
    const response = await axios.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: token,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};

/**
 * Removes a user's current avatar
 * @function removeAvatar
 * @param {string} authToken A user's auth token
 */
export const removeAvatar = async () => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    axios.delete("/api/user/avatar", {
      headers: {
        authorization: token,
      },
    });
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};

export const removeCoverPicture = async () => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    axios.delete("/api/user/coverPicture", {
      headers: {
        authorization: token,
      },
    });
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};

/**
 * Updates the specified fields on the user
 * @function updateProfile
 * @param  {object} updates An object of the fields to update on the user model
 * @returns {object} Updated user object
 */
export const updateProfile = async (updates) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.put(
      "/api/user",
      {
        ...updates,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error(err.response.data.error);
  }
};

export const updateCreator = async (updates) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.post(
      "/api/user/upgrade",
      {
        ...updates,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error(err.response.data.error);
  }
};
/**
 * Gets random suggested users for the user to follow
 * @function getSuggestedUsers
 * @param {string} authToken A user's auth token
 * @returns {array} Array of users
 */
export const getSuggestedUsers = async (authToken, max) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.get(`/api/user/suggested/${max || ""}`, {
      headers: {
        authorization: token,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};


export const sendTipToUser = async (payload) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.post(
      "/api/user/sendTip",
      {
        ...payload,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error(err.response.data.error);
  }
};