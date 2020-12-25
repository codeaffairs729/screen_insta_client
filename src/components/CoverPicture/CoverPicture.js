import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Icon from "../Icon/Icon";

const CoverPicture = ({
  imageSrc = require("../../assets/img/default-cover.jpg"),
  editable,
  onClick,
}) => {
  console.log("image src is : " + imageSrc);
  if (!imageSrc) {
    imageSrc = require("../../assets/img/default-cover.jpg");
  }
  return (
    <div>
      <div className="profile-header__cover" style={{ position: "relative" }}>
        {editable ? (
          <Icon
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 5,
              padding: "10px",
              backgroundColor: "white",
            }}
            icon="pencil-outline"
            className="icon--large"
          />
        ) : null}

        <img
          onClick={onclick}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 10,
            objectFit: "cover",
          }}
          src={imageSrc}
          alt="Cover picture"
        />
      </div>
    </div>
  );
};

CoverPicture.propTypes = {
  imageSrc: PropTypes.string,
  editable: PropTypes.bool,
};

export default CoverPicture;
