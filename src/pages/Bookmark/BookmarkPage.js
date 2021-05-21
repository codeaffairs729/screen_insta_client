import React, { useState, Fragment, useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";

import { createStructuredSelector } from "reselect";
import { selectCurrentUser, selectToken } from "../../redux/user/userSelectors";
import MobileHeader from "../../components/Header/MobileHeader/MobileHeader";
import { connect } from "react-redux";
import {
  selectFeedPosts,
  selectHasMore,
  selectFeedFetching,
} from "../../redux/feed/feedSelectors";
import {
  fetchBookmarkFeedStart,
  clearPosts,
} from "../../redux/feed/feedActions";

import SuggestedUsers from "../../components/Suggestion/SuggestedUsers/SuggestedUsers";
import UserCard from "../../components/UserCard/UserCard";
import SmallFooter from "../../components/Footer/SmallFooter/SmallFooter";
import Feed from "../../components/Feed/Feed";
const BookmarkPage = ({
  currentUser,
  feedPosts,
  fetching,
  fetchBookmarkFeedStart,
  clearPosts,
}) => {
  useEffect(() => {
    document.title = `BetweenUs`;
    fetchBookmarkFeedStart();
    return () => {
      clearPosts();
    };
  }, [clearPosts, fetchBookmarkFeedStart]);
  return (
    <Fragment>
      <MobileHeader>
        <h3 style={{ fontSize: "2rem" }} className="heading-logo">
          BetweenUs
        </h3>
      </MobileHeader>
      <main data-test="page-home" className="home-page grid">
        {!fetching && feedPosts.length === 0 ? (
          <h2>You don't have any bookmarks</h2>
        ) : (
          <Fragment>
            <Feed />
            <aside className="sidebar">
              <div className="sidebar__content">
                <UserCard
                  avatar={currentUser.avatar}
                  username={currentUser.username}
                  subText={currentUser.fullName}
                  style={{ padding: "0" }}
                  avatarMedium
                />
                <SuggestedUsers max={5} style={{ width: "100%" }} />
                <SmallFooter />
              </div>
            </aside>
          </Fragment>
        )}
      </main>
    </Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  token: selectToken,
  feedPosts: selectFeedPosts,
  hasMore: selectHasMore,
  fetching: selectFeedFetching,
});

const mapDispatchToProps = (dispatch) => ({
  fetchBookmarkFeedStart: (offset) => dispatch(fetchBookmarkFeedStart(offset)),
  clearPosts: () => dispatch(clearPosts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkPage);
