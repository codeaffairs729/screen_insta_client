import React, { Fragment, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  changeAvatarStart,
  removeAvatarStart,
} from "../../redux/user/userActions";
import {
  selectCurrentUser,
  selectToken,
  selectFetchingAvatar,
  selectError,
} from "../../redux/user/userSelectors";
import { showModal } from "../../redux/modal/modalActions";
import { showAlert } from "../../redux/alert/alertActions";

const ChangeAvatarButton = ({
  children,
  changeAvatarStart,
  removeAvatarStart,
  currentUser: { avatar },
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
    if (avatar) {
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
                changeAvatar(null, true, "profile");
              },
            },
          ],
        },
        "OptionsDialog/OptionsDialog"
      );
    }
    inputRef.current.click();
  };

  const changeAvatar = async (event, remove, pictureType) => {
    remove
      ? await removeAvatarStart(pictureType)
      : await changeAvatarStart(event.target.files[0], pictureType);
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
        onChange={(event) => changeAvatar(event, false, "profile")}
      />
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  changeAvatarStart: (image, pictureType) =>
    dispatch(changeAvatarStart(image, pictureType)),
  removeAvatarStart: (pictureType) => dispatch(removeAvatarStart(pictureType)),
  showModal: (props, component) => dispatch(showModal(props, component)),
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
});

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  token: selectToken,
  fetchingAvatar: selectFetchingAvatar,
  error: selectError,
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeAvatarButton);
