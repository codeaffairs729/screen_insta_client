import React, { useEffect, Suspense, lazy, useState, useRef } from "react";
import { Switch, Route, useLocation, useHistory, useParams, useRouteMatch } from "react-router-dom";
import audioNotification from "../../../src/assets/audio/audio-notification.mp3";
import { connect } from "react-redux";
import { useTransition } from "react-spring";
import { useSocket } from "../../providers/SocketProvider"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchConversations,
  fetchFollowers,
  fetchFollowings,
  fetchMessages,
  fetchSyncMessages,
  startNewConversationSuccess,
  sendMessageStart,
  sendMessageSuccess,
  receiveMessageStart,
  receiveMessageSuccess,
  readMessageStart,
  readMessageSuccess,
  updateConversationUnreadMessages,
  updateParticipantLastTimeOnlineSuccess,
  updateConversationParticipantIsTypingSuccess,
  followUserSuccess,
  unfollowUserSuccess,
  addFollower,
  removeFollower,
  payMessageSuccess,
  payMessageError,

} from "../../redux/chat/chatActions";
import { selectAllUnreadMessagesCount } from '../../redux/chat/chatSelectors';

import { fetchProfile } from '../../redux/profile/profileActions'
import { selectCurrentUser } from "../../redux/user/userSelectors";
import {
  signInFailure,
  signInStart,
  signInSuccess,
  updateMessagePriceSuccess,
  updateBalanceSuccess,
} from "../../redux/user/userActions";
import {
  fetchNotificationsStart,
  addNotification,
  removeNotification,
  readNotificationSuccess
} from "../../redux/notification/notificationActions";

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

let heartBeatTimer;
const interval = 3000;
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
  allUnreadMessagesCountSelector,
  startNewConversationSuccessDispatch,
  fetchConversationsDispatch,
  fetchFollowersDispatch,
  fetchFollowingsDispatch,
  fetchMessagesDispatch,
  fetchSyncMessagesDispatch,
  sendMessageStartDispatch,
  sendMessageSuccessDispatch,
  receiveMessageStartDispatch,
  receiveMessageSuccessDispatch,
  readMessageSuccessDispatch,
  updateConversationUnreadMessagesDispatch,
  updateParticipantLastTimeOnlineSuccessDispatch,
  updateConversationParticipantIsTypingSuccessDispatch,
  followUserSuccessDispatch,
  unfollowUserSuccessDispatch,
  addFollowerDispatch,
  removeFollowerDispatch,
  addNotificationDispatch,
  removeNotificationDispatch,
  readNotificationSuccessDispatch,
  fetchProfileDispatch,
  updateMessagePriceSuccessDispatch,
  payMessageSuccessDispatch,
  updateBalanceSuccessDispatch,
  payMessageErrorDispatch
}) {

  const location = useLocation();
  const history = useHistory();
  const { conversation_id } = useParams();
  const pathname = location.pathname;
  const [user, setUser] = useState({ authState: "loading" });
  const socket = useSocket();
  const syncLock = useRef(false);
  const messageNotificationRef = useRef();
  const matchProfilePage = useRouteMatch("/:username");

  const allUnreadMessagesCount = allUnreadMessagesCountSelector()
  ////////////////////////////////////////////////// REAL TIME CHAT SOCKET ////////////////////////////////////////

  useEffect(() => {// listening on upcoming events // real time chat
    const log = false;

    if (socket && currentUser?._id) {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('send-message-start');
      socket.off('send-message-success');
      socket.off('send-message-error');
      socket.off('receive-message-success');
      socket.off('read-message-success');
      socket.off('start-new-conversation-success');
      socket.off('conversation-unread-messages-count');
      socket.off('update-participant-last-time-online-success');
      socket.off('update-conversation-participant-is-typing-success');
      socket.off('follow-user-success');
      socket.off('unfollow-user-success');
      socket.off('add-follower');
      socket.off('remove-follower');
      socket.off('add-notification');
      socket.off('remove-notification');
      socket.off('read-notification-success');
      socket.off('update-message-price-success');
      socket.off('pay-message-success');
      socket.off('pay-message-error');
      socket.off('update-balance-success');

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

        //init or re sync the app data (converstaion (participants),messages,followers etc ...)
        fetchFollowersDispatch(0);
        fetchFollowingsDispatch(0);
        fetchNotificationsStart(currentUser?._id);

        const conversations = await fetchConversationsDispatch(0);
        conversations && conversations.map(conv => {
          if (messages.length === 0)
            fetchMessagesDispatch(conv._id);
          else
            fetchSyncMessagesDispatch(conv._id);

          return '';
        })
        clearInterval(heartBeatTimer)
        heartBeatTimer = setInterval(() => {
          socket.emit('update-participant-last-time-online-start')
          if (log) console.log('update-participant-last-time-online-start')
        }, interval);

      })
      socket.on('disconnect', () => {
        // alert('disconnect : ')
        clearInterval(heartBeatTimer)
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
      socket.on('send-message-success', async (message) => {
        if (log) console.log('on send-message-success', message);
        sendMessageSuccessDispatch(message);
        if (currentUser._id !== message.sender) {
          await messageNotificationRef.current.pause()
          messageNotificationRef.current.currentTime = 0;
          await messageNotificationRef.current.play()
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
      socket.on('conversation-unread-messages-count', ({ conversation_id, unreadMessagesCount }) => {
        if (log) console.log('on conversation-unread-messages-count', { conversation_id, unreadMessagesCount });
        updateConversationUnreadMessagesDispatch({ conversation_id, unreadMessagesCount });
      })
      socket.on('update-participant-last-time-online-success', ({ participant_id, lastTimeOnline }) => {
        if (log) console.log('on update-participant-last-time-online-success', { participant_id, lastTimeOnline });
        updateParticipantLastTimeOnlineSuccessDispatch({ participant_id, lastTimeOnline });
      })
      socket.on('update-conversation-participant-is-typing-success', ({ conversation_id, participant_id, isTyping }) => {
        if (log) console.log('on update-conversation-participant-is-typing-success', { conversation_id, participant_id, isTyping });
        updateConversationParticipantIsTypingSuccessDispatch({ conversation_id, participant_id, isTyping });
      })
      ////////////////////////////// follow un follow success actions ///////////////////////////::
      socket.on('follow-user-success', user_to_follow => {
        followUserSuccessDispatch(user_to_follow);
        if (matchProfilePage && (matchProfilePage.params.username === user_to_follow.username || matchProfilePage.params.username === currentUser.username))
          fetchProfileDispatch(matchProfilePage.params.username)

      })
      socket.on('unfollow-user-success', user_to_follow => {
        unfollowUserSuccessDispatch(user_to_follow)
        if (matchProfilePage && (matchProfilePage.params.username === user_to_follow.username || matchProfilePage.params.username === currentUser.username))
          fetchProfileDispatch(matchProfilePage.params.username)


      })
      socket.on('add-follower', follower => {
        addFollowerDispatch(follower)
      })
      socket.on('remove-follower', follower => {
        removeFollowerDispatch(follower)
      })
      socket.on('add-notification', notification => {
        addNotificationDispatch(notification)
      })
      socket.on('remove-notification', notification => {
        removeNotificationDispatch(notification)

      })
      socket.on('read-notification-success', notification_id => {
        readNotificationSuccessDispatch(notification_id)
      });
      socket.on('update-message-price-success', price => {
        updateMessagePriceSuccessDispatch(price)
      });

      socket.on('pay-message-success', message => {
        payMessageSuccessDispatch(message);
      });
      socket.on('pay-message-error', error => {
        payMessageErrorDispatch(error);
        toast.error(error, {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

      socket.on('update-balance-success', balance => {
        toast.success('Your New Balance Is ' + balance + "$", {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        updateBalanceSuccessDispatch(balance)
      });



    }
  }, [socket, currentUser, history, conversations, messages, matchProfilePage]);

  ////////////////////////////////////////////////////////// RECEIVE EVENT SYNC ////////////////////////////////////////////////

  useEffect(() => { //Sync Messages

    if (socket && messages && !syncLock.current) {
      messages
        .filter(message => message.sender !== currentUser._id && message.status !== 'read')// only received messages
        .map(message => {

          if (!message.receivedBy.find(rcb => rcb === currentUser._id)) {
            socket.emit('receive-message-start', { _id: message._id, receivedBy: currentUser._id });
            console.log('receive-message-start', message)
            receiveMessageStartDispatch(message);
          }

          return '';
        })
    }

  }, [socket, messages, conversation_id])

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
    if (user.authState === "loading" || !currentUser) {
      return <LoadingPage />;
    }

    return (
      <>
        {pathname !== "/login" &&
          pathname !== "/signup" &&
          pathname !== "/forgotPassword" && <Header allUnreadMessagesCount={allUnreadMessagesCount} />}
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
          currentUser && <MobileNav currentUser={currentUser} allUnreadMessagesCount={allUnreadMessagesCount} />}
        <ToastContainer theme="colored" />
        <audio ref={messageNotificationRef} src={audioNotification} />
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
  conversations: state.chat.conversations,
  allUnreadMessagesCountSelector: () => selectAllUnreadMessagesCount(state)
});

const mapDispatchToProps = (dispatch) => ({
  signInStart: (usernameOrEmail, password, token) => dispatch(signInStart(usernameOrEmail, password, token)),
  signInFailure: (error) => dispatch(signInFailure(error)),
  signInSuccess: (user, token) => dispatch(signInSuccess(user, token)),
  fetchConversationsDispatch: async (offset) => await dispatch(fetchConversations(offset)),
  startNewConversationSuccessDispatch: (conversation) => dispatch(startNewConversationSuccess(conversation)),
  fetchFollowersDispatch: (offset) => dispatch(fetchFollowers(offset)),
  fetchFollowingsDispatch: (offset) => dispatch(fetchFollowings(offset)),
  fetchMessagesDispatch: (conversation_id) => dispatch(fetchMessages(conversation_id)),
  fetchSyncMessagesDispatch: (conversation_id) => dispatch(fetchSyncMessages(conversation_id)),
  sendMessageStartDispatch: (message) => dispatch(sendMessageStart(message)),
  sendMessageSuccessDispatch: (message) => dispatch(sendMessageSuccess(message)),
  receiveMessageStartDispatch: (payload) => dispatch(receiveMessageStart(payload)),
  receiveMessageSuccessDispatch: (payload) => dispatch(receiveMessageSuccess(payload)),
  readMessageStartDispatch: (payload) => dispatch(readMessageStart(payload)),
  readMessageSuccessDispatch: (payload) => dispatch(readMessageSuccess(payload)),
  updateConversationUnreadMessagesDispatch: (payload) => dispatch(updateConversationUnreadMessages(payload)),
  updateParticipantLastTimeOnlineSuccessDispatch: (payload) => dispatch(updateParticipantLastTimeOnlineSuccess(payload)),
  updateConversationParticipantIsTypingSuccessDispatch: (payload) => dispatch(updateConversationParticipantIsTypingSuccess(payload)),
  followUserSuccessDispatch: (user_to_follow_id) => dispatch(followUserSuccess(user_to_follow_id)),
  unfollowUserSuccessDispatch: (user_to_unfollow_id) => dispatch(unfollowUserSuccess(user_to_unfollow_id)),
  addFollowerDispatch: (follower) => dispatch(addFollower(follower)),
  removeFollowerDispatch: (follower) => dispatch(removeFollower(follower)),
  addNotificationDispatch: (notification) => dispatch(addNotification(notification)),
  fetchNotificationsStart: () => dispatch(fetchNotificationsStart()),

  removeNotificationDispatch: (deletedNotificationFilter) => dispatch(removeNotification(deletedNotificationFilter)),
  readNotificationSuccessDispatch: (notification) => dispatch(readNotificationSuccess(notification)),
  fetchProfileDispatch: (username) => dispatch(fetchProfile(username)),

  updateMessagePriceSuccessDispatch: (price) => dispatch(updateMessagePriceSuccess(price)),
  payMessageSuccessDispatch: (message) => dispatch(payMessageSuccess(message)),
  payMessageErrorDispatch: (message) => dispatch(payMessageError(message)),
  updateBalanceSuccessDispatch: (balance) => dispatch(updateBalanceSuccess(balance)),
});




export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
