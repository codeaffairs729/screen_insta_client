import React from "react";
import PropTypes from "prop-types";

import Icon from "../Icon/Icon";
import { isAudio, isVideo } from "../../validUploads";

const PreviewImage = ({ onClick, image, likes, comments, filter, post }) => {
  if (!post) return null;
  console.log("POST");
  console.log(post);
  if (!post.display) {
    return (
      <figure
        onClick={onClick}
        key={image}
        className="preview-image"
        style={{ width: "100%" }}
      >
        <div
          className="d-flex align-items-center justify-content-center pay-post-div"
          style={{ height: "100%", backgroundColor: "grey" }}
        >
          <div style={{ paddingTop: 200 }}>
            <div className="center-div" style={{ textAlign: "center" }}>
              <Icon icon="lock-closed-outline" />
              <span>Get access for {post.postPrice.toFixed(2)}$</span>
            </div>
          </div>
        </div>

        <div className="preview-image__overlay">
          <span className="preview-image__content">
            {likes > 0 && (
              <div className="preview-image__icon">
                <Icon icon="heart" className="icon--white" />
                <span>{likes}</span>
              </div>
            )}
            <div className="preview-image__icon">
              <Icon icon="chatbubbles" className="icon--white" />
              <span>{comments}</span>
            </div>
          </span>
        </div>
      </figure>
    );
  }
  let postContainVideo = false;
  if (post && post.medias) {
    for (let index = 0; index < post.medias.length; index++) {
      const media = post.medias[index];
      if (isVideo(media)) {
        postContainVideo = true;
        break;
      }
    }
  }
  return (
    <figure
      onClick={onClick}
      key={image}
      className="preview-image"
      style={{ margin: "auto", width: "100%" }}
    >
      {isVideo(image) && (
        <video
          src={image}
          alt="User post"
          style={{ filter, objectFit: "cover" }}
        />
      )}

      {isAudio(image) && (
        <div style={{ paddingTop: 200 }}>
          <div className="center-div icon-preview d-flex align-items-center justify-content-center pay-post-div">
            <Icon style={{ width: 60, height: 35 }} icon="mic-outline" />
          </div>
        </div>
      )}

      {!isVideo(image) && !isAudio(image) && (
        <img
          src={image}
          alt="User post"
          style={{ filter, objectFit: "cover" }}
        />
      )}

      <div className="preview-image__overlay">
        <icons className="preview-image__content">
          {likes > 0 && (
            <div className="preview-image__icon">
              <Icon icon="heart" className="icon--white" />
              <span>{likes}</span>
            </div>
          )}
          <div className="preview-image__icon">
            <Icon icon="chatbubbles" className="icon--white" />
            <span>{comments}</span>
          </div>
        </icons>
        {postContainVideo && (
          <div className="preview-image__topRightContentTwoIcons">
            {post && post.medias && post.medias.length > 0 && (
              <div className="preview-image__icon">
                <Icon icon="play" className="icon--white" />
              </div>
            )}
            {post && post.medias && post.medias.length > 1 && (
              <div className="preview-image__icon">
                <Icon icon="documents-outline" className="icon--white" />
              </div>
            )}
          </div>
        )}
        {!postContainVideo && (
          <div className="preview-image__topRightContent">
            {post && post.medias && post.medias.length > 1 && (
              <div className="preview-image__icon">
                <Icon icon="documents-outline" className="icon--white" />
              </div>
            )}
          </div>
        )}
      </div>
    </figure>
  );
};

PreviewImage.propTypes = {
  onClick: PropTypes.func,
  image: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
};

export default PreviewImage;
