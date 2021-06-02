import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Link } from "react-router-dom";
import VideoThumbnail from "react-video-thumbnail"; // use npm published version

import {
  selectNotifications,
  selectNotificationState,
} from "../../../redux/notification/notificationSelectors";
import { selectToken } from "../../../redux/user/userSelectors";

import {
  fetchNotificationsStart,
  readNotificationsStart,
  clearNotifications,
} from "../../../redux/notification/notificationActions";

import UserCard from "../../UserCard/UserCard";
import UsersListSkeleton from "../../UsersList/UsersListSkeleton/UsersListSkeleton";
import Icon from "../../Icon/Icon";
import FollowButton from "../../Button/FollowButton/FollowButton";
import Divider from "../../Divider/Divider";
import Linkify from "linkifyjs/react";
import * as linkify from "linkifyjs";
import mention from "linkifyjs/plugins/mention";

import { linkifyOptions } from "../../../utils/linkifyUtils";
import { isAudio, isVideo } from "../../../validUploads";

mention(linkify);

const NotificationFeed = ({
  notifications,
  fetchNotificationsStart,
  readNotificationsStart,
  notificationState,
  clearNotifications,
  setShowNotifications,
  token,
}) => {
  useEffect(() => {
    (async function () {
      await fetchNotificationsStart(token);
      await readNotificationsStart(token);
    })();

    return () => {
      clearNotifications();
    };
  }, [
    fetchNotificationsStart,
    readNotificationsStart,
    clearNotifications,
    token,
  ]);

  const videoClicked = () => {
    console.log("video clicked");
  };

  return (
    <Fragment>
      {notificationState.fetching ? (
        <UsersListSkeleton style={{ height: "7rem" }} />
      ) : notifications.length > 0 ? (
        notifications.map((notification, idx) => {
          const userCardProps = {
            username: notification.sender.username,
            avatar: notification.sender.avatar,
            subTextDark: true,
            token: token,
            date: notification.date,
            style: { minHeight: "7rem", padding: "1rem 1.5rem" },
          };
          let userCardChild = null;

          let preview = null;
          if (
            notification &&
            notification.notificationData &&
            notification.notificationData.image
          ) {
            if (isVideo(notification.notificationData.image)) {
              preview = (
                <video
                  style={{
                    width: 70,
                    height: 70,
                  }}
                  preload="metadata"
                  onClick={videoClicked}
                >
                  <source
                    src={notification.notificationData.image}
                    type="video/mp4"
                  />
                </video>
              );
            } else if (isAudio(notification.notificationData.image)) {
              preview = (
                <span
                  className="preview-close-button"
                  onClick={() =>
                    setShowNotifications && setShowNotifications(false)
                  }
                >
                  <Icon
                    icon={"mic-outline"}
                    style={{ width: 70, height: 70 }}
                  />
                </span>
              );
            } else {
              preview = (
                <img
                  src={notification.notificationData.image}
                  style={{
                    display: "flex",
                    filter: notification.notificationData.filter,
                    width: 70,
                    height: 70,
                  }}
                  onClick={() =>
                    setShowNotifications && setShowNotifications(false)
                  }
                  alt="post commented on"
                />
              );
            }
          }

          switch (notification.notificationType) {
            case "follow": {
              userCardProps.subText = "started following you.";
              userCardChild = (
                <FollowButton
                  username={notification.sender.username}
                  avatar={notification.sender.avatar}
                  following={notification.isFollowing}
                  userId={notification.sender._id}
                />
              );
              break;
            }
            case "like": {
              userCardProps.subText = "liked your post.";
              userCardChild = (
                <Link to={`/post/${notification.notificationData.postId}`}>
                  {preview}
                </Link>
              );
              break;
            }
            default: {
              userCardProps.subText = (
                <Linkify options={linkifyOptions}>{`${
                  notification.notificationType === "comment"
                    ? "commented:"
                    : "mentioned you in a comment:"
                } ${notification.notificationData.message}`}</Linkify>
              );
              userCardChild = (
                <Link to={`/post/${notification.notificationData.postId}`}>
                  {preview}
                </Link>
              );
            }
          }

          return (
            <li key={idx}>
              <UserCard {...userCardProps}>
                {userCardChild && userCardChild}
              </UserCard>
              {notifications.length - 1 > idx && <Divider />}
            </li>
          );
        })
      ) : (
        <div className="popup-card__empty">
          <Icon className="icon--larger" icon="heart-circle-outline" />
          <h2 className="heading-2 font-medium">Activity On Your Posts</h2>
          <h4 className="heading-4 font-medium">
            When someone likes or comments on your posts, you'll see them here.
          </h4>
        </div>
      )}
    </Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  notifications: selectNotifications,
  notificationState: selectNotificationState,
  token: selectToken,
});

const mapDispatchToProps = (dispatch) => ({
  fetchNotificationsStart: (authToken) =>
    dispatch(fetchNotificationsStart(authToken)),
  readNotificationsStart: (authToken) =>
    dispatch(readNotificationsStart(authToken)),
  clearNotifications: () => dispatch(clearNotifications()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationFeed);
