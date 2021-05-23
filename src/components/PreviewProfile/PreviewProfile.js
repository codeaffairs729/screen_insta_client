import React from "react";
import PropTypes from "prop-types";

const PreviewProfile = ({ onClick, image, username, fullname }) => {
  console.log(username);
  return (
    <figure
      onClick={() => onClick(username)}
      key={image}
      className="preview-image"
      style={{ margin: "auto", width: "100%" }}
    >
      <img src={image} alt={fullname} style={{ objectFit: "cover" }} />
    </figure>
  );
};

PreviewProfile.propTypes = {
  onClick: PropTypes.func,
  image: PropTypes.string.isRequired,
};

export default PreviewProfile;
