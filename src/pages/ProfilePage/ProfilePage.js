import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";


import { selectCurrentUser, selectToken } from "../../redux/user/userSelectors";

import { showModal, hideModal } from "../../redux/modal/modalActions";

import useScrollPositionThrottled from "../../hooks/useScrollPositionThrottled";
import ProfileCategory from "../../components/ProfileCategory/ProfileCategory";
import PreviewImage from "../../components/PreviewImage/PreviewImage";
import Loader from "../../components/Loader/Loader";
import SkeletonLoader from "../../components/SkeletonLoader/SkeletonLoader";
import MobileHeader from "../../components/Header/MobileHeader/MobileHeader";
import SettingsButton from "../../components/SettingsButton/SettingsButton";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import ProfileHeader from "./ProfileHeader";
import EmptyProfile from "./EmptyProfile";

import { fetchProfile, fetchAdditionalPosts } from '../../redux/profile/profileActions'
import { selectProfileUser, selectProfilePosts, selectProfileState } from '../../redux/profile/profileSelectors'
const ProfilePage = ({
  currentUser,
  showModal,
  hideModal,

  fetchProfileDispatch,
  fetchAdditionalPostsDispatch,
  profileStateSelector,
  profileUserSelector,
  profilePostsSelector

}) => {
  const { username } = useParams();
  const history = useHistory();
  const profileState = profileStateSelector();
  // const profileUser = profileUserSelector();
  const profilePosts = profilePostsSelector();
  // const [isPostCreationAllowed, setIsPostCreationAllowed] = useState(false);

  useScrollPositionThrottled(async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight &&
      profilePosts.length < profileState.data.postCount &&
      !profileState.fetchingAdditionalPosts
    ) {
      fetchAdditionalPostsDispatch(username, profilePosts.length);
    }
  }, null);


  useEffect(() => {
    document.title = `@${username} • BetweenUs photos`;
    fetchProfileDispatch(username);
    fetchAdditionalPostsDispatch(username);
  }, [username]);

  const handleClick = (postId) => {
    history.push(`/post/${postId}`);
  };

  const renderProfile = () => {
    if (profileState.fetching) {
      return <Loader />;
    }
    if (!profileState.fetching && profileState.data) {
      return (
        <Fragment>
          <ProfileHeader
            currentUser={currentUser}
            data={profileState.data}
            showModal={showModal}
            loading={profileState.following}

          />
          <ProfileCategory category="POSTS" icon="apps-outline" />
          {profilePosts && profilePosts.length > 0 ? (
            <div className="profile-images">
              {profilePosts.map((post) => {
                return (
                  <PreviewImage
                    key={post._id}
                    onClick={() => handleClick(post._id)}
                    post={post}

                  />
                );
              })}
              {profileState.fetchingAdditionalPosts && (
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
              data={profileState.data}
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

  return profileState.error ? (
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



const mapStateToProps = (state) => ({
  currentUser: selectCurrentUser(state),
  token: selectToken,
  profileStateSelector: () => selectProfileState(state),
  profilePostsSelector: () => selectProfilePosts(state),
  profileUserSelector: () => selectProfileUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
  hideModal: (component) => dispatch(hideModal(component)),

  fetchProfileDispatch: (username) => dispatch(fetchProfile(username)),
  fetchAdditionalPostsDispatch: (username) => dispatch(fetchAdditionalPosts(username)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
