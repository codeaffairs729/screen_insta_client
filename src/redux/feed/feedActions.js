import feedTypes from './feedTypes';

import {
  retrieveFeedPosts,
  retrieveBookmarkFeedPosts,
} from "../../services/feedServices";

export const fetchFeedPostsStart = (offset) => async (dispatch) => {
  try {
    dispatch({ type: feedTypes.FETCH_POSTS_START });
    const response = await retrieveFeedPosts(offset);
    dispatch({ type: feedTypes.FETCH_POSTS_SUCCESS, payload: response });
  } catch (err) {
    dispatch({ type: feedTypes.FETCH_POSTS_FAILURE, payload: err.message });
  }
};

export const fetchBookmarkFeedStart = () => async (dispatch) => {
  try {
    dispatch({ type: feedTypes.FETCH_BOOKMARKS_START });
    const response = await retrieveBookmarkFeedPosts();
    dispatch({ type: feedTypes.FETCH_BOOKMARKS_SUCCESS, payload: response });
  } catch (err) {
    dispatch({ type: feedTypes.FETCH_BOOKMARKS_FAILURE, payload: err.message });
  }
};

export const addPost = (post) => ({
  type: feedTypes.ADD_POST,
  payload: post,
});

export const removePost = (postId) => ({
  type: feedTypes.REMOVE_POST,
  payload: postId,
});

export const clearPosts = () => ({
  type: feedTypes.CLEAR_POSTS,
});
