import React, { Fragment } from "react";
import { NavLink, Switch } from "react-router-dom";

import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";
import Card from "../../components/Card/Card";
import ChangePasswordForm from "../../components/ChangePasswordForm/ChangePasswordForm";
import EditProfileForm from "../../components/EditProfileForm/EditProfileForm";
import MobileHeader from "../../components/Header/MobileHeader/MobileHeader";
import firebase from "../../firebase";
import { showAlert } from "../../redux/alert/alertActions";

const SettingsPage = () => {
  const uid = firebase.auth().currentUser.uid;

  let providers = [];
  for (let i in firebase.auth().currentUser.providerData) {
    const provider = firebase.auth().currentUser.providerData[i];
    providers.push(provider.providerId);
  }
  console.log("providers :  " + JSON.stringify(providers));
  let emailVerified = firebase.auth().currentUser.emailVerified;
  if (!providers.includes("password")) {
    emailVerified = true;
  }
  const resendEmail = async () => {
    try {
      await firebase.auth().currentUser.sendEmailVerification();
      alert("Email sent");
    } catch (e) {
      console.log(e);
      alert("Email failed to send, retry again later");
    }
  };
  return (
    <Fragment>
      <MobileHeader backArrow>
        <h3 className="heading-3">Edit Profile</h3>
        <div></div>
      </MobileHeader>
      <main style={{}} className="settings-page grid">
        {!emailVerified ? (
          <Card
            className="settings-card"
            style={{ lineHeight: "2.2rem", marginBottom: 10 }}
          >
            <ul className="settings-card__sidebar"></ul>
            <article className="settings-page__content">
              <h4 className="heading-4 font-medium">
                Please verify your email address before you continue and refresh
                this page.{" "}
                <a onClick={resendEmail} href="#">
                  Did not receive an email ?
                </a>
              </h4>
            </article>
          </Card>
        ) : null}
        <Card className="settings-card">
          <ul className="settings-card__sidebar">
            <NavLink
              className="sidebar-link"
              to="/settings/edit"
              activeClassName="font-bold sidebar-link--active"
            >
              <li className="sidebar-link__text">Edit Profile</li>
            </NavLink>
          </ul>
          <article className="settings-page__content">
            <Switch>
              <ProtectedRoute path="/settings/edit">
                <EditProfileForm />
              </ProtectedRoute>
            </Switch>
          </article>
        </Card>
      </main>
    </Fragment>
  );
};

export default SettingsPage;
