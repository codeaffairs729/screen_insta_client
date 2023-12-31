import React, { useState, Fragment, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import { showModal, hideModal } from "../../redux/modal/modalActions";

import Button from "../Button/Button";

const CreatePostButton = ({ showModal, hideModal }) => {
  const history = useHistory();
  const openCreatePostModal = () => {
    console.log("create Post button clicked aaa");
    history.push("/new");
  };

  return <Button onClick={() => openCreatePostModal()}>create Post</Button>;
};

const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
  hideModal: (component) => dispatch(hideModal(component)),
});

export default connect(null, mapDispatchToProps)(CreatePostButton);
