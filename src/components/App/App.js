import React, { useEffect, Suspense, lazy, useState } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { useTransition } from "react-spring";
import SocketProvider from "../../providers/SocketProvider"

import { selectCurrentUser } from "../../redux/user/userSelectors";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userActions";
import { fetchNotificationsStart } from "../../redux/notification/notificationActions";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Header from "../Header/Header";
import Modal from "../../components/Modal/Modal";
import Alert from "../../components/Alert/Alert";
import Footer from "../../components/Footer/Footer";
import MobileNav from "../../components/MobileNav/MobileNav";

import firebase from "../../firebase";

import LoadingPage from "../../pages/LoadingPage/LoadingPage";
import { login } from "../../services/authenticationServices";
import BookmarkPage from "../../pages/Bookmark/BookmarkPage";
import ChatPage from "../Chat/ChatPage";
const TermsAndConditions = lazy(() => import("../../pages/TermsAndConditions/TermsAndConditions"));
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

// const defaultUser = { authState: "loading", email: "", loading: true };

function onAuthStateChange(callback, signInSuccess, signInFailure) {
  return firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      console.log("authstate changed APP.js" + JSON.stringify(user));
      const token = await user.getIdToken();
      const mdbUser = await login(token);
      let authState = "logged";
      if (mdbUser.error) {
        signInFailure(mdbUser.error);
        authState = "disconnected";
      } else {
        signInSuccess(mdbUser, token);
      }
      setTimeout(() => {
        callback({
          authState: authState,
          email: user.email,
          uid: user.uid,
          token: token,
          loading: false,
        });
      }, 1000);
    } else {
      localStorage.removeItem("uid");
      localStorage.removeItem("acceptedTerms");
      callback({ authState: "disconnected", loading: false, token: null });
    }
  });
}

export function UnconnectedApp({
  signInStart,
  signInFailure,
  signInSuccess,
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
    const unsubscribe = onAuthStateChange(
      setUser,
      signInSuccess,
      signInFailure
    );
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user.token) {
      //signInStart(null, null, user.token);
      // fetchNotificationsStart(user.token);
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
  function useVideoAutoplay({ threshold = 0.8 } = {}) {
    function checkScroll() {
      const videos = document.getElementsByTagName("video");

      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];

        const x = video.offsetLeft;
        const y = video.offsetTop;
        const w = video.offsetWidth;
        const h = video.offsetHeight;
        const r = x + w; // right
        const b = y + h; // bottom

        const visibleX = Math.max(
          0,
          Math.min(
            w,
            window.pageXOffset + window.innerWidth - x,
            r - window.pageXOffset
          )
        );
        const visibleY = Math.max(
          0,
          Math.min(
            h,
            window.pageYOffset + window.innerHeight - y,
            b - window.pageYOffset
          )
        );

        const visible = (visibleX * visibleY) / (w * h);

        if (visible > threshold) {
          video.play();
        } else {
          video.pause();
        }
      }
    }

    useEffect(() => {
      window.addEventListener("scroll", checkScroll, false);
      window.addEventListener("resize", checkScroll, false);
      return () => {
        window.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }, []);
  }

  //useVideoAutoplay();

  const renderApp = () => {
    // Wait for authentication
    console.log("current user is : " + JSON.stringify(currentUser));
    if (user.authState === "loading") {
      console.log(
        "Loading page " + user.authState + " loading: " + userLoading
      );
      return <LoadingPage />;
    }

    console.log(
      "rendering view " +
      pathname +
      " with authstate " +
      user.authState +
      " and isUserLoading ? " +
      userLoading
    );
    return (
      <SocketProvider id={currentUser?._id}>
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
          <Route path="/termsandconditions" component={TermsAndConditions} />
          <ProtectedRoute exact path="/" component={HomePage} />
          <ProtectedRoute
            path="/messages/:conversation_id"
            component={ChatPage}
          />
          <ProtectedRoute path="/settings" component={SettingsPage} />
          <ProtectedRoute path="/activity" component={ActivityPage} />
          <ProtectedRoute path="/new" component={NewPostPage} />
          <ProtectedRoute path="/bookmarks" component={BookmarkPage} />
          <ProtectedRoute path="/explore" component={ExplorePage} />
          <ProtectedRoute exact path="/:username" component={ProfilePage} />
          <ProtectedRoute path="/post/:postId" component={PostPage} />
          <ProtectedRoute path="/confirm/:token" component={ConfirmationPage} />
          <Route component={NotFoundPage} />
        </Switch>
        {pathname !== "/" && <Footer />}
        {pathname !== "/login" &&
          pathname !== "/signup" &&
          pathname !== "/new" &&
          currentUser && <MobileNav currentUser={currentUser} />}
      </SocketProvider>
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
  signInFailure: (error) => dispatch(signInFailure(error)),
  signInSuccess: (user, token) => dispatch(signInSuccess(user, token)),
});
export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
