import React, { useEffect, Fragment, Suspense, lazy, useState } from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { useTransition } from "react-spring";

import { selectCurrentUser } from "../../redux/user/userSelectors";
import { signInStart } from "../../redux/user/userActions";
import { fetchNotificationsStart } from "../../redux/notification/notificationActions";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Header from "../Header/Header";
import Modal from "../../components/Modal/Modal";
import Alert from "../../components/Alert/Alert";
import Footer from "../../components/Footer/Footer";
import MobileNav from "../../components/MobileNav/MobileNav";

import firebase from "../../firebase";

import LoadingPage from "../../pages/LoadingPage/LoadingPage";
const ProfilePage = lazy(() => import("../../pages/ProfilePage/ProfilePage"));
const PostPage = lazy(() => import("../../pages/PostPage/PostPage"));
const ConfirmationPage = lazy(() =>
  import("../../pages/ConfirmationPage/ConfirmationPage")
);
const SettingsPage = lazy(() =>
  import("../../pages/SettingsPage/SettingsPage")
);
const ActivityPage = lazy(() =>
  import("../../pages/ActivityPage/ActivityPage")
);
const LoginPage = lazy(() => import("../../pages/LoginPage/LoginPage"));
const SignUpPage = lazy(() => import("../../pages/SignUpPage/SignUpPage"));
const HomePage = lazy(() => import("../../pages/HomePage/HomePage"));
const NewPostPage = lazy(() => import("../../pages/NewPostPage/NewPostPage"));
const ExplorePage = lazy(() => import("../../pages/ExplorePage/ExplorePage"));
const NotFoundPage = lazy(() =>
  import("../../pages/NotFoundPage/NotFoundPage")
);
const ForgotPasswordPage = lazy(() =>
  import("../../pages/ForgotPasswordPage/ForgotPasswordPage")
);

const defaultUser = { authState: "loading", email: "", loading: true };

function onAuthStateChange(callback) {
  return firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      console.log("authstate changed APP.js" + JSON.stringify(user));
      const token = await user.getIdToken();
      setTimeout(() => {
        callback({
          authState: "logged",
          email: user.email,
          username: user.displayName,
          uid: user.uid,
          token: token,
          loading: false,
        });
      }, 1000);
    } else {
      callback({ authState: "disconnected", loading: false, token: null });
    }
  });
}

export function UnconnectedApp({
  signInStart,
  modal,
  alert,
  currentUser,
  fetchNotificationsStart,
  userLoading,
}) {
  const location = useLocation();
  const pathname = location.pathname;
  const [user, setUser] = useState({ authState: "loading" });

  useEffect(() => {
    console.log("app useEffect");
    const unsubscribe = onAuthStateChange(setUser);
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("user logged in");
    if (user.token) {
      console.log("found token" + user.token);
      signInStart(null, null, user.token);
      fetchNotificationsStart(user.token);
    }
  }, [signInStart, fetchNotificationsStart, user]);

  const renderModals = () => {
    if (modal.modals.length > 0) {
      // Disable scrolling on the body while a modal is active
      document.querySelector("body").setAttribute("style", "overflow: hidden;");
      return modal.modals.map((modal, idx) => (
        <Modal key={idx} component={modal.component} {...modal.props} />
      ));
    } else {
      document.querySelector("body").setAttribute("style", "");
    }
  };

  const transitions = useTransition(alert.showAlert, null, {
    from: {
      transform: "translateY(4rem)",
    },
    enter: {
      transform: "translateY(0rem)",
    },
    leave: {
      transform: "translateY(4rem)",
    },
    config: {
      tension: 500,
      friction: 50,
    },
  });

  const renderApp = () => {
    // Wait for authentication

    console.log("current user is : " + JSON.stringify(currentUser));
    if (user.authState == "loading" || userLoading) {
      console.log("Loading page");
      return <LoadingPage />;
    }

    console.log("render app " + pathname);
    console.log(user.authState + " /// " + userLoading);
    return (
      <Fragment>
        {pathname !== "/login" &&
          pathname !== "/signup" &&
          pathname !== "/forgotPassword" && <Header />}
        {renderModals()}
        {transitions.map(
          ({ item, props, key }) =>
            item && (
              <Alert key={key} style={props} onClick={alert.onClick}>
                {alert.text}
              </Alert>
            )
        )}
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/forgotPassword" component={ForgotPasswordPage} />
          <ProtectedRoute exact path="/" component={HomePage} />
          <ProtectedRoute path="/settings" component={SettingsPage} />
          <ProtectedRoute path="/activity" component={ActivityPage} />
          <ProtectedRoute path="/new" component={NewPostPage} />
          <ProtectedRoute path="/explore" component={ExplorePage} />
          <Route exact path="/:username" component={ProfilePage} />
          <Route path="/post/:postId" component={PostPage} />
          <ProtectedRoute path="/confirm/:token" component={ConfirmationPage} />
          <Route component={NotFoundPage} />
        </Switch>
        {pathname !== "/" && <Footer />}
        {pathname !== "/login" &&
          pathname !== "/signup" &&
          pathname !== "/new" &&
          currentUser && <MobileNav currentUser={currentUser} />}
      </Fragment>
    );
  };

  return (
    <div className="app" data-test="component-app">
      <Suspense fallback={<LoadingPage />}>{renderApp()}</Suspense>
    </div>
  );
}

const mapStateToProps = (state) => ({
  modal: state.modal,
  alert: state.alert,
  currentUser: selectCurrentUser(state),
  userLoading: state.user.fetching,
});

const mapDispatchToProps = (dispatch) => ({
  signInStart: (usernameOrEmail, password, token) =>
    dispatch(signInStart(usernameOrEmail, password, token)),
  fetchNotificationsStart: (authToken) =>
    dispatch(fetchNotificationsStart(authToken)),
});
export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
