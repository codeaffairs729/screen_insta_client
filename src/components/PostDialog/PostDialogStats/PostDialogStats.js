import React, { useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classNames from "classnames";

import { bookmarkPost, sendTip } from "../../../redux/user/userActions";
import { showAlert } from "../../../redux/alert/alertActions";
import { showModal, hideModal } from "../../../redux/modal/modalActions";

import { formatDate } from "../../../utils/timeUtils";
import { votePost } from "../../../services/postService";

import Icon from "../../Icon/Icon";
import PulsatingIcon from "../../Icon/PulsatingIcon/PulsatingIcon";
import LoginCard from "../../LoginCard/LoginCard";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";

const PostDialogStats = ({
  currentUser,
  post,
  token,
  dispatch,
  profileDispatch,
  bookmarkPost,
  showAlert,
  showModal,
  hideModal,
  simple,
  postId,
  sendTip,
}) => {
  const ref = useRef();
  console.log("POST");
  console.log(post);
  const handleClick = async () => {
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
    // Dispatch the action immediately to avoid a delay between the user's click and something happening

    dispatch({
      type: "VOTE_POST",
      payload: { currentUser, postId: post._id, dispatch: profileDispatch },
    });
    try {
      await votePost(post._id, token);
    } catch (err) {
      showAlert("Could not vote on the post.", () => handleClick());
    }
  };

  const postDialogStatsClassNames = classNames({
    "post-dialog__stats": true,
    "post-dialog__stats--simple": simple,
  });

  const startSendTip = (amount) => {
    console.log(
      "send tip called with amount " +
        amount +
        " and user id : " +
        post.author._id
    );
    sendTip(amount, post.author._id);
  };
  return (
    <div
      ref={ref}
      className={postDialogStatsClassNames}
      data-test="component-post-dialog-stats"
    >
      <div className="post-dialog__actions">
        {currentUser ? (
          <PulsatingIcon
            toggle={
              !!post.postVotes.find((vote) => vote.author === currentUser._id)
            }
            elementRef={ref}
            constantProps={{
              onClick: () => handleClick(),
            }}
            toggledProps={[
              {
                className: "icon--button post-dialog__like color-red",
                icon: "heart",
              },
              {
                className: "icon--button post-dialog__like",
                icon: "heart-outline",
              },
            ]}
          />
        ) : (
          <Icon
            onClick={() => handleClick()}
            icon="heart-outline"
            className="icon--button post-dialog__like"
          />
        )}
        <Icon
          onClick={() =>
            currentUser &&
            document.querySelector(".add-comment__input" + postId).focus()
          }
          className="icon--button"
          icon="chatbubble-outline"
        />

        {post && post.author && post.author.isCreator && (
          <Icon
            className="icon--button"
            icon="gift-outline"
            onClick={() => {
              showModal(
                {
                  title: "Send a tip",
                  cancelButton: false,
                  sendTip: startSendTip,
                },
                "DonationDialog/DonationDialog"
              );
            }}
          />
        )}

        {post && post.postPrice > 0 && (
          <Icon className="icon--button" icon="lock-closed-outline" />
        )}

        <Icon
          className="icon--button"
          onClick={() => bookmarkPost(post._id, token)}
          icon={
            currentUser && currentUser.bookmarks
              ? !!currentUser.bookmarks.find(
                  (bookmark) => bookmark.post === post._id
                )
                ? "bookmark"
                : "bookmark-outline"
              : "bookmark-outline"
          }
        />
      </div>
      <p className="heading-4">
        {post.postVotes.length === 0 ? (
          <span>
            Be the first to{" "}
            <b
              style={{ cursor: "pointer" }}
              onClick={(event) => {
                event.nativeEvent.stopImmediatePropagation();
                handleClick();
              }}
              data-test="component-like-button"
            >
              like this
            </b>
          </span>
        ) : (
          <span>
            <b>
              {post.postVotes.length}{" "}
              {post.postVotes.length === 1 ? "like" : "likes"}
            </b>
          </span>
        )}
      </p>
      <p className="heading-5 color-light uppercase">{formatDate(post.date)}</p>
    </div>
  );
};

PostDialogStats.propTypes = {
  currentUser: PropTypes.object,
  post: PropTypes.object.isRequired,
  token: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  profileDispatch: PropTypes.func,
  bookmarkPost: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  bookmarkPost: (postId, authToken) =>
    dispatch(bookmarkPost(postId, authToken)),
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
  showModal: (props, component) => dispatch(showModal(props, component)),
  hideModal: (component) => dispatch(hideModal(component)),
  sendTip: (tipAmount, userId) => dispatch(sendTip(tipAmount, userId)),
});

export default connect(null, mapDispatchToProps)(PostDialogStats);
