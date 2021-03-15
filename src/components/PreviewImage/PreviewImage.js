import React from "react";
import PropTypes from "prop-types";

import Icon from "../Icon/Icon";
import { isVideo } from "../../validUploads";

const PreviewImage = ({ onClick, image, likes, comments, filter, post }) => {
  if (!post.display) {
    return (
      <figure onClick={onClick} key={image} className="preview-image">
        <div
          className="d-flex align-items-center justify-content-center pay-post-div"
          style={{ height: 303, backgroundColor: "grey" }}
        >
          <div className="center-div" style={{ textAlign: "center" }}>
            <Icon style={{ margin: "auto" }} icon="lock-closed-outline" />
            <span>Get access for {post.postPrice.toFixed(2)}$</span>
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
  return (
    <figure onClick={onClick} key={image} className="preview-image">
      {isVideo(image) ? (
        <video src={image} alt="User post" style={{ filter }} />
      ) : (
        <img src={image} alt="User post" style={{ filter }} />
      )}

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
};

PreviewImage.propTypes = {
  onClick: PropTypes.func,
  image: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
};

export default PreviewImage;
