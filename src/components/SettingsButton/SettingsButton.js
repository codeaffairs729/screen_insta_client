import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import { showModal } from "../../redux/modal/modalActions";
import { signOut } from "../../redux/user/userActions";

import firebase from "../../firebase";
import Icon from "../Icon/Icon";

const SettingsButton = ({ showModal, signOut }) => {
  const history = useHistory();

  const sendChangePasswordEmail = async () => {
    try {
      await firebase
        .auth()
        .sendPasswordResetEmail(firebase.auth().currentUser.email);
      alert("Check your emails, you received a password reset link");
    } catch (e) {
      alert("Error while sending email, retry again later");
    }
  };

  let options = [
    {
      text: "Log Out",
      onClick: () => {
        signOut();
        history.push("/login");
      },
    },
    {
      text: "Bookmarks",
      onClick: () => {
        history.push("/bookmarks");
      },
    },
  ];

  let providers = [];
  for (let i in firebase.auth().currentUser.providerData) {
    const provider = firebase.auth().currentUser.providerData[i];
    providers.push(provider.providerId);
  }
  console.log("providers :  " + JSON.stringify(providers));

  if (providers.includes("password")) {
    options.unshift({
      text: "Change Password",
      onClick: () => sendChangePasswordEmail(),
    });
  }
  return (
    <Icon
      icon="aperture-outline"
      style={{ cursor: "pointer" }}
      onClick={() => {
        showModal(
          {
            options: options,
          },
          "OptionsDialog/OptionsDialog"
        );
      }}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
  signOut: () => dispatch(signOut()),
});

export default connect(null, mapDispatchToProps)(SettingsButton);
