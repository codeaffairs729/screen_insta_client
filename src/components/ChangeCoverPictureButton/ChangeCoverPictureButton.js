import React, { Fragment, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  changeCoverPictureStart,
  removeCoverPictureStart,
} from "../../redux/user/userActions";
import {
  selectCurrentUser,
  selectToken,
  selectFetchingAvatar,
  selectError,
} from "../../redux/user/userSelectors";
import { showModal } from "../../redux/modal/modalActions";
import { showAlert } from "../../redux/alert/alertActions";

const ChangeCoverPictureButton = ({
  children,
  changeCoverPictureStart,
  removeCoverPictureStart,
  currentUser: { coverPicture },
  showModal,
  showAlert,
  token,
  error,
}) => {
  const inputRef = useRef();

  useEffect(() => {
    if (error) {
      showAlert(error);
    }
  }, [error, showAlert]);

  const handleClick = (event) => {
    if (coverPicture) {
      event.preventDefault();
      return showModal(
        {
          options: [
            {
              text: "Upload Photo",
              className: "color-blue font-bold",
              onClick: () => {
                inputRef.current.click();
              },
            },
            {
              warning: true,
              text: "Remove Current Photo",
              onClick: () => {
                changeCoverPicture(null, true, "cover");
              },
            },
          ],
        },
        "OptionsDialog/OptionsDialog"
      );
    }
    inputRef.current.click();
  };

  const changeCoverPicture = async (event, remove, pictureType) => {
    remove
      ? await removeCoverPictureStart()
      : await changeCoverPictureStart(event.target.files[0]);
    if (!error) showAlert("Profile picture updated.");
  };

  return (
    <Fragment>
      <label
        className="color-blue font-bold heading-4"
        style={{ cursor: "pointer", position: "relative" }}
        onClick={(event) => handleClick(event)}
      >
        <Fragment>{children ? children : "Change Profile Photo"}</Fragment>
      </label>
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={inputRef}
        onChange={(event) => changeCoverPicture(event, false, "cover")}
      />
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  changeCoverPictureStart: (image) => dispatch(changeCoverPictureStart(image)),
  removeCoverPictureStart: () => dispatch(removeCoverPictureStart()),
  showModal: (props, component) => dispatch(showModal(props, component)),
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
});

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  token: selectToken,
  fetchingAvatar: selectFetchingAvatar,
  error: selectError,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeCoverPictureButton);
