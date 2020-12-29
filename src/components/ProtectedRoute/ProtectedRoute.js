import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Route, Redirect, useLocation } from "react-router-dom";
import firebase from "../../firebase";
import { selectCurrentUser } from "../../redux/user/userSelectors";
const ProtectedRoute = ({ currentUser, children, ...props }) => {
  const location = useLocation();
  const uid = localStorage.getItem("uid");
  const acceptedTerms = localStorage.getItem("acceptedTerms");
  const currentFirebaseUser = firebase.auth().currentUser;
  console.log("protected route " + location.pathname);
  console.log("uid is : " + uid + " and terms is : " + acceptedTerms);

  if (uid && acceptedTerms != "true" && location.pathname != "/settings/edit") {
    console.log("redirecting to settings edit");
    return <Route {...props}>{<Redirect to="/settings/edit" />}</Route>;
  }
  return (
    <Route {...props}>
      {currentFirebaseUser ? children : <Redirect to="/login" />}
    </Route>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(ProtectedRoute);
