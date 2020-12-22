import React, { useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useHistory } from "react-router-dom";

import { selectCurrentUser } from "../../redux/user/userSelectors";

import ForgotPasswordCard from "../../components/ForgotPasswordCard/ForgotPasswordCard";

const ForgotPasswordPage = ({ currentUser }) => {
  const history = useHistory();
  useEffect(() => {
    if (currentUser) history.push("/");
  }, [currentUser, history]);
  return (
    <main className="sign-up-page">
      <ForgotPasswordCard />
    </main>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(ForgotPasswordPage);
