import React, { useEffect, useCallback, useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectToken } from "../../redux/user/userSelectors";
import { showAlert } from "../../redux/alert/alertActions";
import { showModal } from "../../redux/modal/modalActions";
import ChatPanel from "./ChatPanel/ChatPanel";

const ChatPage = ({ token, showAlert, showModal, match }) => {
  useEffect(() => {
    document.title = "BetweenUs";
  }, []);

  return (
    <div style={{ paddingTop: 70 }}>
      <ChatPanel />
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
});

const mapDistpachToProps = (dispatch) => ({
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
  showModal: (props, component) => dispatch(showModal(props, component)),
});

export default connect(mapStateToProps, mapDistpachToProps)(ChatPage);
