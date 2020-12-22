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
  updateProfile,
} from "../../services/userService";
import firebase from "../../firebase";

export const signOut = () => async (dispatch) => {
  localStorage.removeItem("token");
  await firebase.auth().signOut();
  dispatch({ type: userTypes.SIGN_OUT });
};

export const signInStart = (usernameOrEmail, password, authToken) => async (
  dispatch
) => {
  if (authToken) {
    dispatch({ type: userTypes.SIGN_IN_START });
    console.log("signin start called with token");
    console.log(authToken);
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
      console.log("login user with firebase");
      const persistenceSet = await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      console.log(persistenceSet);
      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(usernameOrEmail, password);
      console.log("user logged in");
      const token = await response.user.getIdToken();
      const user = await login(token);
      if (user.error) {
        dispatch(signInFailure(user.error));
        return;
      }
      dispatch(signInSuccess(user, token));
    }
  } catch (err) {
    console.log(err);
    console.log(JSON.stringify(err));
    if (authToken) dispatch(signOut);
    dispatch(signInFailure(err.message));
  }
};

export const signInSuccess = (user, token) => {
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
    console.log("starting twitter sign");
    dispatch({ type: userTypes.TWITTER_SIGN_IN_START });
    const provider = new firebase.auth.TwitterAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    console.log("twitter result is : ");
    console.log(result);
  } catch (err) {
    console.error(err);
    if (err && err.message)
      dispatch({ type: userTypes.SIGN_IN_FAILURE, payload: err.message });
  }
};

export const googleSignInStart = () => async (dispatch) => {
  try {
    console.log("starting google sign");
    dispatch({ type: userTypes.GOOGLE_SIGN_IN_START });
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("email");
    console.log("starting google sign");
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
    console.log("starting facebook sign");
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

    console.log("response is ");
    console.log(response);
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

export const changeAvatarStart = (formData, pictureType) => async (
  dispatch
) => {
  try {
    dispatch({ type: userTypes.CHANGE_AVATAR_START });
    const response = await changeAvatar(formData, pictureType);
    if (pictureType === "cover") {
      dispatch({
        type: userTypes.CHANGE_COVER_SUCCESS,
        payload: response.coverPicture,
      });
    } else {
      dispatch({
        type: userTypes.CHANGE_AVATAR_SUCCESS,
        payload: response.avatar,
      });
    }
  } catch (err) {
    dispatch({
      type: userTypes.CHANGE_AVATAR_FAILURE,
      payload: err.message,
    });
  }
};

export const removeAvatarStart = (pictureType) => async (dispatch) => {
  try {
    dispatch({ type: userTypes.REMOVE_AVATAR_START });
    await removeAvatar(pictureType);
    dispatch({ type: userTypes.REMOVE_AVATAR_SUCCESS });
  } catch (err) {
    dispatch({ type: userTypes.REMOVE_AVATAR_FAILURE, payload: err.message });
  }
};

export const updateProfileStart = (authToken, updates) => async (dispatch) => {
  try {
    dispatch({ type: userTypes.UPDATE_PROFILE_START });
    console.log("update profile start");
    const response = await updateProfile(authToken, updates);
    dispatch({ type: userTypes.UPDATE_PROFILE_SUCCESS, payload: response });
  } catch (err) {
    dispatch({ type: userTypes.UPDATE_PROFILE_FAILURE, payload: err.message });
  }
};
