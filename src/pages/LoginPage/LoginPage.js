import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useHistory, useLocation } from "react-router-dom";

import { selectCurrentUser } from "../../redux/user/userSelectors";

import LoginCard from "../../components/LoginCard/LoginCard";

const LoginPage = ({ currentUser }) => {
  const history = useHistory();
  const { search } = useLocation();
  if (currentUser) {
    console.log(
      "current user is set in login page, redirecting to HOME" + currentUser
    );
    history.push("/");
  }
  const params = new URLSearchParams(search);
  const code = params.get("code");
  const authState = params.get("state");

  return (
    <main data-test="page-login" className="login-page">
      <div className="login-page__showcase"></div>
      <LoginCard />
    </main>
  );
};

LoginPage.propTypes = {
  currentUser: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
