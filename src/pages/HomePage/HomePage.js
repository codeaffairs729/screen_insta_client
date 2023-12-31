import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectCurrentUser, selectToken } from "../../redux/user/userSelectors";
import {
  selectFeedPosts,
  selectHasMore,
  selectFeedFetching,
} from "../../redux/feed/feedSelectors";
import { fetchFeedPostsStart, clearPosts } from "../../redux/feed/feedActions";

import useScrollPositionThrottled from "../../hooks/useScrollPositionThrottled";

import Feed from "../../components/Feed/Feed";
import UserCard from "../../components/UserCard/UserCard";
import SmallFooter from "../../components/Footer/SmallFooter/SmallFooter";
import MobileHeader from "../../components/Header/MobileHeader/MobileHeader";
import SuggestedUsers from "../../components/Suggestion/SuggestedUsers/SuggestedUsers";


const HomePage = ({
  currentUser,
  fetchFeedPostsStart,
  clearPosts,
  token,
  feedPosts,
  hasMore,
  fetching,
}) => {
  useEffect(() => {
    document.title = `BetweenUs`;
    fetchFeedPostsStart();
    return () => {
      clearPosts();
    };
  }, [clearPosts, fetchFeedPostsStart, token]);

  useScrollPositionThrottled(
    ({ atBottom }) => {
      if (atBottom && hasMore && !fetching) {
        fetchFeedPostsStart(feedPosts.length);
      }
    },
    null,
    [hasMore, fetching]
  );

  return (
    <Fragment>
      <MobileHeader>
        <h3 style={{ fontSize: "2rem" }} className="heading-logo">
          BetweenUs
        </h3>
      </MobileHeader>
      <main data-test="page-home" className="home-page grid">
        {!fetching && feedPosts.length === 0 ? (
          <SuggestedUsers card />
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
                <SuggestedUsers max={10} style={{ width: "100%" }} />
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
  fetchFeedPostsStart: (offset) => dispatch(fetchFeedPostsStart(offset)),
  clearPosts: () => dispatch(clearPosts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
