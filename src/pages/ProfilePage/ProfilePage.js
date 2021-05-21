import React, { useReducer, useEffect, Fragment, useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useParams, useHistory } from "react-router-dom";

import { selectCurrentUser, selectToken } from "../../redux/user/userSelectors";

import { INITIAL_STATE, profileReducer } from "./ProfilePageReducer";
import { showModal, hideModal } from "../../redux/modal/modalActions";

import { getUserProfile, followUser } from "../../services/profileService";
import { getPosts } from "../../services/postService";

import useScrollPositionThrottled from "../../hooks/useScrollPositionThrottled";
import firebase from "../../firebase";
import ProfileCategory from "../../components/ProfileCategory/ProfileCategory";
import PreviewImage from "../../components/PreviewImage/PreviewImage";
import Loader from "../../components/Loader/Loader";
import SkeletonLoader from "../../components/SkeletonLoader/SkeletonLoader";
import MobileHeader from "../../components/Header/MobileHeader/MobileHeader";
import SettingsButton from "../../components/SettingsButton/SettingsButton";
import LoginCard from "../../components/LoginCard/LoginCard";
import NotFoundPage from "../../pages/NotFoundPage/NotFoundPage";
import ProfileHeader from "./ProfileHeader";
import EmptyProfile from "./EmptyProfile";
import CreatePostButton from "../../components/CreatePost/CreatePostButton";

const ProfilePage = ({ currentUser, token, showModal, hideModal }) => {
  const { username } = useParams();
  const history = useHistory();
  const [state, dispatch] = useReducer(profileReducer, INITIAL_STATE);
  const [isPostCreationAllowed, setIsPostCreationAllowed] = useState(false);

  const follow = async () => {
    if (!currentUser) {
      return showModal(
        {
          children: <LoginCard onClick={() => hideModal("Card/Card")} modal />,
          style: {
            gridColumn: "center-start / center-end",
            justifySelf: "center",
            width: "40rem",
          },
        },
        "Card/Card"
      );
    }
    try {
      dispatch({ type: "FOLLOW_USER_START" });
      const response = await followUser(state.data.user._id, token);
      dispatch({
        type: "FOLLOW_USER_SUCCESS",
        payload: response.operation,
      });
      const profile = await getUserProfile(username);
      dispatch({ type: "FETCH_PROFILE_SUCCESS", payload: profile });
    } catch (err) {
      dispatch({
        type: "FOLLOW_USER_FAILURE",
        payload: err,
      });
    }
  };

  useScrollPositionThrottled(async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight &&
      state.data.posts.length < state.data.postCount &&
      !state.fetchingAdditionalPosts
    ) {
      try {
        dispatch({ type: "FETCH_ADDITIONAL_POSTS_START" });
        const posts = await getPosts(username, state.data.posts.length);
        dispatch({ type: "FETCH_ADDITIONAL_POSTS_SUCCESS" });
        dispatch({ type: "ADD_POSTS", payload: posts });
      } catch (err) {
        dispatch({ type: "FETCH_ADDITIONAL_POSTS_FAILURE", payload: err });
      }
    }
  }, null);

  useEffect(() => {
    document.title = `@${username} • BetweenUs photos`;
    (async function () {
      try {
        dispatch({ type: "FETCH_PROFILE_START" });
        const profile = await getUserProfile(username);
        if (profile && profile.user && profile.user.uid) {
          const uid = firebase.auth().currentUser.uid;
          console.log(`User UID ${uid} and prfileUID: ${profile.user.uid}`);
          if (profile.user.uid.toLowerCase() === uid.toLowerCase()) {
            setIsPostCreationAllowed(true);
          }
        }
        dispatch({ type: "FETCH_PROFILE_SUCCESS", payload: profile });
      } catch (err) {
        dispatch({ type: "FETCH_PROFILE_FAILURE", payload: err });
      }
    })();
  }, [username]);

  const handleClick = (postId) => {
    history.push(`/post/${postId}`);
  };

  const renderProfile = () => {
    if (state.fetching) {
      return <Loader />;
    }
    if (!state.fetching && state.data) {
      return (
        <Fragment>
          <ProfileHeader
            currentUser={currentUser}
            data={state.data}
            showModal={showModal}
            token={token}
            follow={follow}
            loading={state.following}
          />
          <ProfileCategory category="POSTS" icon="apps-outline" />
          {state.data.posts && state.data.posts.length > 0 ? (
            <div className="profile-images">
              {isPostCreationAllowed && <CreatePostButton />}
              {state.data.posts.map((post, idx) => {
                return (
                  <PreviewImage
                    onClick={() => handleClick(post._id)}
                    image={post.medias ? post.medias[0] : null}
                    likes={post.postVotes}
                    comments={post.comments}
                    filter={post.filter}
                    post={post}
                    key={idx}
                  />
                );
              })}
              {state.fetchingAdditionalPosts && (
                <Fragment>
                  <div>
                    <SkeletonLoader animated />
                  </div>
                  <div>
                    <SkeletonLoader animated />
                  </div>
                  <div>
                    <SkeletonLoader animated />
                  </div>
                </Fragment>
              )}
            </div>
          ) : (
            <EmptyProfile
              data={state.data}
              currentUserProfile={
                currentUser && currentUser.username === username
              }
              username={username}
            />
          )}
        </Fragment>
      );
    }
  };

  return state.error ? (
    <NotFoundPage />
  ) : (
    <Fragment>
      {currentUser && currentUser.username === username ? (
        <MobileHeader>
          <SettingsButton />
          <h3 className="heading-3">{username}</h3>
          <div></div>
        </MobileHeader>
      ) : (
        <MobileHeader backArrow>
          <h3 className="heading-3">{username}</h3>
          <div></div>
        </MobileHeader>
      )}
      <main className="profile-page grid">{renderProfile()}</main>
    </Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  token: selectToken,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
  hideModal: (component) => dispatch(hideModal(component)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
