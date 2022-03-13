import profileTypes from "./profileTypes";
import { getUserProfile } from "../../services/profileService";
import { getPosts } from "../../services/postService";

export const fetchProfile = (username) => async (dispatch) => {
  try {
    dispatch({ type: profileTypes.FETCH_PROFILE_START });
    const profile = await getUserProfile(username);

    dispatch({ type: profileTypes.FETCH_PROFILE_SUCCESS, payload: profile });
  } catch (err) {
    dispatch({ type: profileTypes.FETCH_PROFILE_ERROR, payload: err });
  }

}
export const fetchAdditionalPosts = (username, offset = 0) => async (dispatch) => {

  try {
    dispatch({ type: profileTypes.FETCH_ADDITIONAL_POSTS_START });
    const posts = await getPosts(username, offset);
    dispatch({ type: profileTypes.FETCH_ADDITIONAL_POSTS_SUCCESS, payload: posts });
  } catch (err) {
    dispatch({ type: profileTypes.FETCH_ADDITIONAL_POSTS_ERROR, payload: err });
  }

}

