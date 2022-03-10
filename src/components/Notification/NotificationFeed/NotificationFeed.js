import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import VideoThumbnail from "react-video-thumbnail"; // use npm published version

import {
  selectNotifications,
  selectNotificationState,
} from "../../../redux/notification/notificationSelectors";
import { selectToken } from "../../../redux/user/userSelectors";


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
import { useSocket } from "../../../providers/SocketProvider"


mention(linkify);

const NotificationFeed = ({
  notifications,
  notificationState,
  setShowNotifications,
  token,
}) => {
  const socket = useSocket();
  const videoClicked = () => {
  };
  const notificationFeedBox = useRef();
  const followNotificationRefs = useRef([]);

  useEffect(() => {
    let timer;
    const listener = (e) => {
      clearTimeout(timer);
      const notificationFeedBoxRect = notificationFeedBox.current.parentElement.getBoundingClientRect();
      // console.dir(notificationFeedBox.current.parentElement)
      timer = setTimeout(() => {
        followNotificationRefs.current.map((current) => {
          if (current) {
            // console.dir(current);
            const followNotificationRect = current.getBoundingClientRect()
            // console.log (followNotificationRect && followNotificationRect.top >= notificationFeedBoxRect.top - 2 && followNotificationRect.bottom <= notificationFeedBoxRect.bottom + 2) {
            // console.log(followNotificationRect.top, notificationFeedBoxRect.top, followNotificationRect.bottom, notificationFeedBoxRect.bottom)
            if (followNotificationRect && followNotificationRect.top >= notificationFeedBoxRect.top - 2 && followNotificationRect.bottom <= notificationFeedBoxRect.bottom + 2) {
              console.log(current.id)
              if (socket) {
                console.log('emit read-notification-start', current.id);
                socket.emit('read-notification-start', current.id)
              }
            }
          }
          return '';
        })
      }, 100)
    }
    const element = notificationFeedBox.current
    element.addEventListener('scroll', listener);
    element.addEventListener('mousemove', listener);
    return () => {
      element.removeEventListener('scroll', listener);
      element.removeEventListener('mousemove', listener);
    }
  }, [socket])

  const onReadNotificationHandler = (notification_id) => {
    console.log('emit read-notification-message');
    socket.emit('read-notification-start', notification_id);
  }

  return (
    <div ref={notificationFeedBox}>
      {notificationState.fetching ? (
        <UsersListSkeleton style={{ height: "7rem" }} />
      ) : notifications.length > 0 ? (
        notifications.map((notification, idx) => {
          followNotificationRefs.current = [];
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

          switch (notification.type) {
            case "follow": {
              userCardProps.subText = "started following you.";
              userCardChild = (
                <FollowButton
                  profile={notification.sender}
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
                <Linkify options={linkifyOptions}>{`${notification.type === "comment"
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
            <li
              key={notification._id}
              id={notification._id}
              ref={ref => ref && notification.type === "follow" && !notification.read && followNotificationRefs.current.push(ref)}
            >
              <UserCard

                {...userCardProps}

              >
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
    </div>
  );
};

const mapStateToProps = (state) => ({
  notifications: selectNotifications(state),
  notificationState: selectNotificationState(state),
  token: selectToken(state),
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationFeed);
