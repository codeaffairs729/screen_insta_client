import React, { useEffect, Suspense, lazy, useState, useRef } from "react";
import { Switch, Route, useLocation, useHistory, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { useTransition } from "react-spring";
import { useSocket } from "../../providers/SocketProvider"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchConversations,
  fetchFollowers,
  fetchMessages,
  fetchSyncMessages,
  startNewConversationSuccess,
  sendMessageStart,
  sendMessageSuccess,
  receiveMessageStart,
  receiveMessageSuccess,
  readMessageStart,
  readMessageSuccess,

} from "../../redux/chat/chatActions";


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
      // console.log("authstate changed APP.js" + JSON.stringify(user));
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
  stateAlert,
  currentUser,
  fetchNotificationsStart,
  userLoading,
  conversations,
  messages,
  startNewConversationSuccessDispatch,
  fetchConversationsDispatch,
  fetchFollowersDispatch,
  fetchMessagesDispatch,
  fetchSyncMessagesDispatch,
  sendMessageStartDispatch,
  sendMessageSuccessDispatch,
  receiveMessageStartDispatch,
  receiveMessageSuccessDispatch,
  readMessageStartDispatch,
  readMessageSuccessDispatch

}) {
  const location = useLocation();
  const history = useHistory();
  const { conversation_id } = useParams();
  const pathname = location.pathname;
  const [user, setUser] = useState({ authState: "loading" });
  const socket = useSocket();
  const syncLock = useRef(false);

  ////////////////////////////////////////////////// REAL TIME CHAT SOCKET ////////////////////////////////////////

  useEffect(() => {// listening on upcoming events // real time chat
    const log = true;
    if (socket && currentUser?._id) {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('send-message-start');
      socket.off('send-message-success');
      socket.off('send-message-error');
      socket.off('receive-message-success');
      socket.off('read-message-success');
      socket.off('start-new-conversation-success');

      //////////////////////////////////////// conversations events /////////////////////////////////////////
      socket.on('connect', async () => {
        // alert('connect : ' + socket.id)

        toast.success('You Are Online!', {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        fetchFollowersDispatch(0);
        const conversations = await fetchConversationsDispatch(0);
        conversations.map(conv => {
          if (messages.length === 0)
            fetchMessagesDispatch(conv._id);
          else
            fetchSyncMessagesDispatch(conv._id);

          return '';
        })

      })
      socket.on('disconnect', () => {
        // alert('disconnect : ')
        toast.error('You Are Offline!', {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })

      ///////////////////////////////////////// messages events ///////////////////////////////////////////
      socket.on('start-new-conversation-success', ({ conversation, message }) => {
        if (log) console.log('on start-new-conversation-success', conversation);
        startNewConversationSuccessDispatch(conversation);
        sendMessageSuccessDispatch(message); /// need to be renamed to StartUpMessageDispatch in order to not create confusation;

        socket.emit('join-conversation-room', conversation._id);
        if (log) console.log('emit join-conversation-room', conversation._id);

        if (currentUser._id === conversation.participants[0]._id)
          history.push('/messages/' + conversation._id);
      });

      socket.on('send-message-start', message => {// know when the same user is sending a message from another device (session)
        if (log) console.log('on send-message-start', message);
        sendMessageStartDispatch(message)
      });
      socket.on('send-message-success', message => {
        if (log) console.log('on send-message-success', message);
        sendMessageSuccessDispatch(message);

        if (message.sender !== currentUser._id) {
          if (log) console.log('emit receive-message-start', message);
          socket.emit('receive-message-start', { _id: message._id, receivedBy: currentUser._id });
          receiveMessageStartDispatch(message);
        }

      });
      socket.on('send-message-error', error => {
        if (log) console.log('on send-message-error', error)
      });

      socket.on('receive-message-success', message => {
        if (log) console.log('on receive-message-success', message);
        receiveMessageSuccessDispatch(message);
      })

      socket.on('read-message-success', message => {
        if (log) console.log('on read-message-success', message);
        readMessageSuccessDispatch(message);
      })
    }
  }, [socket, currentUser, history, conversations, messages]);

  ////////////////////////////////////////////////////////// RECEIVE EVENT SYNC ////////////////////////////////////////////////

  useEffect(() => { //Sync Messages

    if (socket && messages && !syncLock.current) {
      messages
        .filter(message => message.sender !== currentUser._id && message.status !== 'read')// only received messages
        .map(message => {
          // console.log(message);
          if (conversation_id === message.conversation) {
            // socket.emit('read-message-start', { _id: message._id, readBy: currentUser._id });
            // console.log('read-message-start', message)
            // readMessageStartDispatch(message);
          } else if (!message.receivedBy.find(rcb => rcb === currentUser._id)) {
            socket.emit('receive-message-start', { _id: message._id, receivedBy: currentUser._id });
            console.log('receive-message-start', message)
            receiveMessageStartDispatch(message);
          }

          return '';
        })
    }

  }, [socket, messages, conversation_id,])

  useEffect(() => {
    // console.log("app useEffect");
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

  const transitions = useTransition(stateAlert.showAlert, null, {
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
  // function useVideoAutoplay({ threshold = 0.8 } = {}) {
  //   function checkScroll() {
  //     const videos = document.getElementsByTagName("video");

  //     for (let i = 0; i < videos.length; i++) {
  //       const video = videos[i];

  //       const x = video.offsetLeft;
  //       const y = video.offsetTop;
  //       const w = video.offsetWidth;
  //       const h = video.offsetHeight;
  //       const r = x + w; // right
  //       const b = y + h; // bottom

  //       const visibleX = Math.max(
  //         0,
  //         Math.min(
  //           w,
  //           window.pageXOffset + window.innerWidth - x,
  //           r - window.pageXOffset
  //         )
  //       );
  //       const visibleY = Math.max(
  //         0,
  //         Math.min(
  //           h,
  //           window.pageYOffset + window.innerHeight - y,
  //           b - window.pageYOffset
  //         )
  //       );

  //       const visible = (visibleX * visibleY) / (w * h);

  //       if (visible > threshold) {
  //         video.play();
  //       } else {
  //         video.pause();
  //       }
  //     }
  //   }

  //   useEffect(() => {
  //     window.addEventListener("scroll", checkScroll, false);
  //     window.addEventListener("resize", checkScroll, false);
  //     return () => {
  //       window.removeEventListener("scroll", checkScroll);
  //       window.removeEventListener("resize", checkScroll);
  //     };
  //   }, []);
  // }

  //useVideoAutoplay();

  const renderApp = () => {
    // Wait for authentication
    // console.log("current user is : " + JSON.stringify(currentUser));
    if (user.authState === "loading") {
      // console.log("Loading page " + user.authState + " loading: " + userLoading);
      return <LoadingPage />;
    }

    // console.log("rendering view " + pathname + " with authstate " + user.authState + " and isUserLoading ? " + userLoading);
    return (
      <>
        {pathname !== "/login" &&
          pathname !== "/signup" &&
          pathname !== "/forgotPassword" && <Header />}
        {renderModals()}
        {transitions.map(
          ({ item, props, key }) =>
            item && (
              <Alert key={key} style={props} onClick={stateAlert.onClick}>
                {stateAlert.text}
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
        <ToastContainer theme="colored" />
      </>
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
  stateAlert: state.alert,
  currentUser: selectCurrentUser(state),
  userLoading: state.user.fetching,
  messages: state.chat.messages,
  conversations: state.chat.conversations
  //     fetchConversationsError: state.chat.fetchConversationsError,
});

const mapDispatchToProps = (dispatch) => ({
  signInStart: (usernameOrEmail, password, token) => dispatch(signInStart(usernameOrEmail, password, token)),
  fetchNotificationsStart: (authToken) => dispatch(fetchNotificationsStart(authToken)),
  signInFailure: (error) => dispatch(signInFailure(error)),
  signInSuccess: (user, token) => dispatch(signInSuccess(user, token)),
  fetchConversationsDispatch: async (offset) => await dispatch(fetchConversations(offset)),
  startNewConversationSuccessDispatch: (conversation) => dispatch(startNewConversationSuccess(conversation)),
  fetchFollowersDispatch: (offset) => dispatch(fetchFollowers(offset)),
  fetchMessagesDispatch: (conversation_id) => dispatch(fetchMessages(conversation_id)),
  fetchSyncMessagesDispatch: (conversation_id) => dispatch(fetchSyncMessages(conversation_id)),
  sendMessageStartDispatch: (message) => dispatch(sendMessageStart(message)),
  sendMessageSuccessDispatch: (message) => dispatch(sendMessageSuccess(message)),
  receiveMessageStartDispatch: (payload) => dispatch(receiveMessageStart(payload)),
  receiveMessageSuccessDispatch: (payload) => dispatch(receiveMessageSuccess(payload)),
  readMessageStartDispatch: (payload) => dispatch(readMessageStart(payload)),
  readMessageSuccessDispatch: (payload) => dispatch(readMessageSuccess(payload)),
});




export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
