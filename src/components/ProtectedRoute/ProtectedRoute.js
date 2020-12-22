import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Route, Redirect, useLocation } from "react-router-dom";

import { selectCurrentUser } from "../../redux/user/userSelectors";
const ProtectedRoute = ({ currentUser, children, ...props }) => {
  const location = useLocation();
  if (
    currentUser &&
    !currentUser.acceptedTerms &&
    location.pathname != "/settings/edit"
  ) {
    return <Route {...props}>{<Redirect to="/settings/edit" />}</Route>;
  }
  return (
    <Route {...props}>
      {currentUser ? children : <Redirect to="/login" />}
    </Route>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(ProtectedRoute);
