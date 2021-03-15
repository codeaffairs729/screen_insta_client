import React, { useEffect, useReducer, Fragment, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import classNames from "classnames";
import { Link, useHistory } from "react-router-dom";

import { selectToken, selectCurrentUser } from "../../redux/user/userSelectors";

import { showModal, hideModal } from "./../../redux/modal/modalActions";
import { showAlert } from "../../redux/alert/alertActions";

import { getPost, deletePost } from "../../services/postService";
import { getComments } from "../../services/commentService";
import Avatar from "../Avatar/Avatar";
import Icon from "../Icon/Icon";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import Comment from "../Comment/Comment";
import PostDialogCommentForm from "./PostDialogCommentForm/PostDialogCommentForm";
import PostDialogStats from "./PostDialogStats/PostDialogStats";
import Carousel from "react-bootstrap/Carousel";
import { payPost } from "./../../services/postService";

import { INITIAL_STATE, postDialogReducer } from "./postDialogReducer";
import { isVideo } from "../../validUploads";

const PostDialog = ({
  postId,
  token,
  currentUser,
  profileDispatch,
  showModal,
  hideModal,
  showAlert,
  style,
  className,
  postData,
  loading,
  simple,
}) => {
  const commentsRef = useRef();
  const [state, dispatch] = useReducer(postDialogReducer, INITIAL_STATE);
  const history = useHistory();

  const fetching = loading !== undefined ? loading : state.fetching;

  useEffect(() => {
    if (!loading) {
      // Check if the post data is already provided by another component
      if (postData) {
        dispatch({ type: "FETCH_POST_SUCCESS", payload: postData });
      } else {
        /*window.history.pushState(
          { prevUrl: window.location.href },
          null,
          `/post/${postId}`
        );*/
        (async function () {
          try {
            const response = await getPost(postId);
            dispatch({ type: "FETCH_POST_SUCCESS", payload: response });
          } catch (err) {
            history.push("/");
            dispatch({ type: "FETCH_POST_FAILURE", payload: err });
          }
        })();
      }
    }
    
    return () => {
      if (window.history.state && window.history.state.prevUrl) {
        window.history.pushState(
          "profile",
          "Profile",
          window.history.state.prevUrl
        );
      }
    };
  }, [postId, history, loading, postData]);

  const fetchAdditionalComments = async () => {
    try {
      const commentData = await getComments(
        postId,
        state.data.comments.length,
        state.localStateComments.size
      );
      dispatch({ type: "ADD_COMMENT", payload: commentData.comments });
    } catch (err) {
      showAlert("Unable to fetch additional comments.", () =>
        fetchAdditionalComments()
      );
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(postId, token);
      profileDispatch &&
        profileDispatch({
          type: "DELETE_POST",
          payload: postId,
        });
      hideModal("PostDialog/PostDialog");
    } catch (err) {
      showAlert("Unable to delete post.", () => handleDeletePost());
    }
  };

  const payPostClicked = async (toPayPostId) => {
    const result = await payPost(toPayPostId);
    if (result) {
      let newPost = { ...state.data };
      newPost.medias = result;
      dispatch({ type: "FETCH_POST_SUCCESS", payload: newPost });
    } else {
      showAlert("An error occurred");
    }
  };

  

  const renderPostPreview = (fetching, post) => {
    if (fetching) return <SkeletonLoader animated />;
    let medias = post.medias;
    if (!medias) {
      return (
        <div
          className="d-flex align-items-center justify-content-center pay-post-div"
          style={{ height: "100%", backgroundColor: "grey" }}
          onClick={(e) => payPostClicked(post._id)}
        >
          <div className="center-div">
            <Icon style={{ margin: "auto" }} icon="lock-closed-outline" />
            <span>Get access for {post.postPrice.toFixed(2)}$</span>
          </div>
        </div>
      );
    }
    return (
      <Carousel
        interval={null}
        controls={post.medias && post.medias.length === 1 ? false : true}
        indicators={post.medias && post.medias.length === 1 ? false : true}
        touch={true}
        prevLabel= ""
        nextLabel =""
        className={"custom-responsive-carousel carousel-height"}
      >
        {post.medias &&
          post.medias.map((media, index) => (
            <Carousel.Item key={index}>
              {media && isVideo(media) && (
                <video
                  alt="Post"
                  className="responsive-img"
                  style={{
                    filter: state.data.filter,
                    width: "100%",
                    height: "fit-content",
                    maxHeight: 590,
                  }}
                  controls
                >
                  <source src={media} type="video/mp4" />
                </video>
              )}
              {media && !isVideo(media) && (
                <img
                  className="d-block w-100 responsive-img"
                  src={media}
                  style={{ width: "100%", maxHeight: 590}}
                />
              )}
            </Carousel.Item>
          ))}
      </Carousel>
    );
  };

  return (
    <div
      className={classNames({
        "post-dialog": true,
        "post-dialog--simple": simple,
        [className]: className,
      })}
      data-test="component-post-dialog"
      style={style}
    >
      <Fragment>
        <div
          className={classNames({
            "post-dialog__image": true,
            "post-dialog__image--simple": simple,
          })}
        >
          {renderPostPreview(fetching, state.data)}
        </div>
        <header
          className={classNames({
            "post-dialog__header": true,
            "post-dialog__header--simple": simple,
          })}
        >
          {fetching ? (
            <SkeletonLoader
              style={{ height: "4rem", width: "4rem", borderRadius: "100px" }}
            />
          ) : (
            <Link
              to={`/${state.data.author.username}`}
              style={{ display: "flex" }}
            >
              <Avatar
                className="avatar--small"
                imageSrc={state.data.author.avatar}
              />
            </Link>
          )}
          {fetching ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <SkeletonLoader style={{ height: "1rem", width: "10rem" }} />
              <SkeletonLoader
                style={{ height: "1rem", width: "15rem", marginTop: "5px" }}
              />
            </div>
          ) : (
            <Link
              style={{ textDecoration: "none" }}
              to={`/${state.data.author.username}`}
            >
              <p className="heading-4 heading-4--bold">
                <b>{state.data.author.username}</b>
              </p>
            </Link>
          )}

          {!fetching && (
            <div
              onClick={() => {
                
                const options = [
                  {
                    text: 'Go to post',
                    onClick: () => {
                      hideModal('PostDialog/PostDialog');
                      history.push(`/post/${postId}`);
                    },
                  },
                  {
                    text: "Copy link",
                    onClick: () => {
                      navigator.clipboard
                        .writeText(document.URL)
                        .then(() => showAlert('Link copied to clipboard.'))
                        .catch(() =>
                          showAlert('Could not copy link to clipboard.')
                        );
                    },
                  },
                ];

                showModal(
                  {
                    options:
                      currentUser &&
                      currentUser.username === state.data.author.username
                        ? [
                            ...options,
                            {
                              text: "Delete post",
                              warning: true,
                              onClick: () => {
                                handleDeletePost();
                                history.push("/" + currentUser.username);
                              },
                            },
                          ]
                        : options,
                  },
                  'OptionsDialog/OptionsDialog'
                );
              }}
              style={{ cursor: "pointer" }}
              className="post-dialog__more"
            >
              <Icon className="icon--small" icon="ellipsis-horizontal" />
            </div>
          )}
        </header>
        <div
          data-test="component-post-dialog-content"
          className={classNames({
            "post-dialog__content": true,
            "post-dialog__content--simple": simple,
          })}
        >
          <div
            ref={commentsRef}
            className={classNames({
              comments: true,
              "comments--simple": simple,
            })}
          >
            {/* Render a caption if there is one as a Comment component with the caption prop */}
            {state.data.caption && !fetching ? (
              <Comment
                comment={{
                  message: state.data.caption,
                  avatar: state.data.author.avatar,
                  username: state.data.author.username,
                }}
                currentUser={currentUser}
                token={token}
                post={state.data}
                caption
                simple={simple}
              />
            ) : null}
            {!fetching &&
              state.data.comments.map((comment, idx) => (
                <Comment
                  comment={comment}
                  currentUser={currentUser}
                  token={token}
                  post={state.data}
                  key={idx}
                  dialogDispatch={dispatch}
                  profileDispatch={profileDispatch}
                  simple={simple}
                />
              ))}
            {!postData &&
              state.data.comments.length - state.localStateComments.size <
                state.data.commentCount - state.localStateComments.size && (
                <div
                  style={{ padding: "2rem", cursor: "pointer" }}
                  onClick={() => fetchAdditionalComments()}
                >
                  <Icon
                    style={{
                      margin: "0 auto",
                    }}
                    icon="add-circle-outline"
                  />
                </div>
              )}
          </div>
          {fetching ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "2rem 2rem 6rem 2rem",
              }}
            >
              <SkeletonLoader style={{ height: "1.5rem", width: "15rem" }} />
              <SkeletonLoader
                style={{ height: "1.5rem", width: "20rem", marginTop: "1rem" }}
              />
              <SkeletonLoader
                style={{ height: "1.5rem", width: "10rem", marginTop: "1rem" }}
              />
            </div>
          ) : (
            <PostDialogStats
              currentUser={currentUser}
              post={state.data}
              dispatch={dispatch}
              profileDispatch={profileDispatch}
              simple={simple}
            />
          )}
          {!fetching && (
            <PostDialogCommentForm
              postId={postId}
              token={token}
              currentUser={currentUser}
              commentsRef={commentsRef}
              dialogDispatch={dispatch}
              profileDispatch={profileDispatch}
              replying={state.replying}
            />
          )}
        </div>
      </Fragment>
    </div>
  );
};

PostDialog.propTypes = {
  postId: PropTypes.string,
  token: PropTypes.string,
  currentUser: PropTypes.object,
  profileDispatch: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
  hideModal: (component) => dispatch(hideModal(component)),
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
});

PostDialog.whyDidYouRender = true;

export default connect(mapStateToProps, mapDispatchToProps)(PostDialog);
