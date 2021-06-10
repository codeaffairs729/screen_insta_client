import userTypes from "./userTypes";

import { bookmarkPost as bookmark } from "../../services/postService";
import {
  registerUser,
  login,
  githubAuthentication,
} from "../../services/authenticationServices";
import {
  changeAvatar,
  removeAvatar,
  changeCoverPicture,
  removeCoverPicture,
  updateProfile,
  updateCreator,
  sendTipToUser,
} from "../../services/userService";
import firebase from "../../firebase";
import { useHistory } from "react-router-dom";
import { hideAlert, showAlert } from "../alert/alertActions";

export const signOut = () => async (dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: userTypes.SIGN_OUT });
  try {
    await firebase.auth().signOut();
  } catch (e) { 
    alert("An error occurred while signing out");
  }
  localStorage.removeItem("uid");
  localStorage.removeItem("acceptedTerms");
};

export const signInStart = (usernameOrEmail, password, authToken) => async (
  dispatch
) => {
  if (authToken) {
    dispatch({ type: userTypes.SIGN_IN_START });
    const user = await login(authToken);
    if (user.error) {
      dispatch(signInFailure(user.error));
      return;
    }
    dispatch(signInSuccess(user, authToken));
    return;
  }
  try {
    dispatch({ type: userTypes.SIGN_IN_START });
    if (firebase.auth().currentUser) {
      const token = await firebase.auth().currentUser.getIdToken();
      const user = await login(token);
      if (user.error) {
        dispatch(signInFailure(user.error));
        return;
      }
      dispatch(signInSuccess(user, token));
    } else {
      const persistenceSet = await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(usernameOrEmail, password);
      const token = await response.user.getIdToken();
      const user = await login(token);
      if (user.error) {
        dispatch(signInFailure(user.error));
        return;
      }
      dispatch(signInSuccess(user, token));
    }
  } catch (err) {
    if (authToken) dispatch(signOut);
    dispatch(signInFailure(err.message));
  }
};

export const signInSuccess = (user, token) => {
  localStorage.setItem("uid", user.uid);
  if (user.acceptedTerms) {
    localStorage.setItem("acceptedTerms", user.acceptedTerms + "");
  }
  return {
    type: userTypes.SIGN_IN_SUCCESS,
    payload: {
      user,
    },
  };
};

export const signInFailure = (err) => ({
  type: userTypes.SIGN_IN_FAILURE,
  payload: err,
});

export const twitterSignInStart = () => async (dispatch) => {
  try {
    dispatch({ type: userTypes.TWITTER_SIGN_IN_START });
    const provider = new firebase.auth.TwitterAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
  } catch (err) {
    console.error(err);
    if (err && err.message)
      dispatch({ type: userTypes.SIGN_IN_FAILURE, payload: err.message });
  }
};

export const googleSignInStart = () => async (dispatch) => {
  try {
    dispatch({ type: userTypes.GOOGLE_SIGN_IN_START });
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("email");
    const result = await firebase.auth().signInWithPopup(provider);
  } catch (err) {
    console.error(err);
    if (err && err.message) {
      dispatch({
        type: userTypes.SIGN_IN_FAILURE,
        payload: err.message,
      });
    }
  }
};

export const facebookSignInStart = () => async (dispatch) => {
  try {
    dispatch({ type: userTypes.FACEBOOK_SIGN_IN_START });
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope("email");
    const result = await firebase.auth().signInWithPopup(provider);
  } catch (err) {
    console.error(err);
    if (err && err.message) {
      dispatch({ type: userTypes.SIGN_IN_FAILURE, payload: err.message });
    }
  }
};

export const signUpStart = (email, password, username) => async (dispatch) => {
  try {
    dispatch({ type: userTypes.SIGN_IN_START });
    const response = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    await response.user.updateProfile({
      displayName: username,
    });
    const sendEmailResponse = await response.user.sendEmailVerification();
    const token = await response.user.getIdToken();
    dispatch(signInStart(null, null, token));
  } catch (err) {
    dispatch({ type: userTypes.SIGN_UP_FAILURE, payload: err.message });
  }
};

export const bookmarkPost = (postId, authToken) => async (dispatch) => {
  try {
    const response = await bookmark(postId, authToken);
    dispatch({
      type: userTypes.BOOKMARK_POST,
      payload: { ...response, postId },
    });
  } catch (err) {
    return err;
  }
};

export const changeAvatarStart = (formData) => async (dispatch) => {
  try {
    dispatch({ type: userTypes.CHANGE_AVATAR_START });
    const response = await changeAvatar(formData);
    dispatch({
      type: userTypes.CHANGE_AVATAR_SUCCESS,
      payload: response.avatar,
    });
  } catch (err) {
    if (err && err.message) {
      dispatch({
        type: userTypes.CHANGE_AVATAR_FAILURE,
        payload: err.message,
      });
    } else {
      dispatch({
        type: userTypes.CHANGE_AVATAR_FAILURE,
        payload: "A network error occurred, please try again",
      });
    }
  }
};

export const removeAvatarStart = (pictureType) => async (dispatch) => {
  try {
    dispatch({ type: userTypes.REMOVE_AVATAR_START });
    await removeAvatar();
    dispatch({ type: userTypes.REMOVE_AVATAR_SUCCESS });
  } catch (err) {
    dispatch({ type: userTypes.REMOVE_AVATAR_FAILURE, payload: err.message });
  }
};

export const changeCoverPictureStart = (formData) => async (dispatch) => {
  try {
    dispatch({ type: userTypes.CHANGE_COVER_PICTURE_START });
    const response = await changeCoverPicture(formData);

    dispatch({
      type: userTypes.CHANGE_COVER_PICTURE_SUCCESS,
      payload: response.coverPicture,
    });
  } catch (err) {
    if (err && err.message) {
      dispatch({
        type: userTypes.CHANGE_COVER_PICTURE_FAILURE,
        payload: err.message,
      });
    } else {
      dispatch({
        type: userTypes.CHANGE_COVER_PICTURE_FAILURE,
        payload: "A network error occurred, please try again",
      });
    }
  }
};

export const removeCoverPictureStart = () => async (dispatch) => {
  try {
    dispatch({ type: userTypes.REMOVE_COVER_PICTURE_START });
    await removeCoverPicture();
    dispatch({ type: userTypes.REMOVE_COVER_PICTURE_SUCCESS });
  } catch (err) {
    dispatch({
      type: userTypes.REMOVE_COVER_PICTURE_FAILURE,
      payload: err.message,
    });
  }
};

export const updateProfileStart = (updates) => async (dispatch) => {
  try {
    dispatch({ type: userTypes.UPDATE_PROFILE_START });
    const response = await updateProfile(updates);

    dispatch(updateProfileSuccess(response, updates.username));
  } catch (err) {
    dispatch({ type: userTypes.UPDATE_PROFILE_FAILURE, payload: err.message });
    dispatch(showAlert(err.message));
    return false;
  }
};

export const updateCreatorStart = (updates) => async (dispatch) => {
  try {
    dispatch({ type: userTypes.UPDATE_CREATOR_START });
    const response = await updateCreator(updates);

    dispatch(updateCreatorSuccess(response));
  } catch (err) {
    dispatch({ type: userTypes.UPDATE_PROFILE_FAILURE, payload: err.message });
    dispatch(showAlert(err.message));
    return false;
  }
};

export const updateProfileSuccess = (response, username) => async (
  dispatch
) => {
  dispatch(hideAlert());
  setTimeout(() => {
    dispatch(showAlert("Profile saved."));
    dispatch({ type: userTypes.UPDATE_PROFILE_SUCCESS, payload: response });
    localStorage.setItem("acceptedTerms", "true");
    window.location.href = "/" + username;
  }, 200);
};

export const updateCreatorSuccess = (response) => async (dispatch) => {
  dispatch(hideAlert());
  setTimeout(() => {
    dispatch(showAlert("Profile saved."));
    dispatch({ type: userTypes.UPDATE_CREATOR_SUCCESS, payload: response });
    console.log("update creator success");
    console.log(response);
    window.location.href = "/" + response.username;
  }, 200);
};

export const sendTip = (tipAmount, userId) => async (dispatch) => {
  try {
    dispatch({ type: userTypes.SEND_TIP_START });
    const response = await sendTipToUser({ tipAmount, userId });

    dispatch(showAlert("Tip was sent successfully!"));
    dispatch({ type: userTypes.SEND_TIP_SUCCESS, payload: response });
  } catch (err) {
    dispatch({ type: userTypes.SEND_TIP_FAILURE, payload: err.message });
    dispatch(showAlert("An error occurred while sending the tip"));
    return false;
  }
};

