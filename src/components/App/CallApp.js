import React, { useEffect, Suspense, useState } from "react";
import { Switch } from "react-router-dom";
import { connect } from "react-redux";
import { usePeer } from "../../providers/PeerProvider"
import { useSocket } from "../../providers/SocketProvider"


import {
  startConversationCallSuccess,
  startConversationCallError,
  joinConversationCallSuccess,
  joinConversationCallError,
  leaveConversationCallSuccess,
  leaveConversationCallError,
  endConversationCallSuccess,
  endConversationCallError
}
  from "../../redux/chat/chatActions";
import { selectAllUnreadMessagesCount } from '../../redux/chat/chatSelectors';

import { selectCurrentUser } from "../../redux/user/userSelectors";
import {
  signInFailure,
  signInStart,
  signInSuccess,
  updateBalanceSuccess,
  updateParticipantCallIdStart
} from "../../redux/user/userActions";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import WebCallModal from "../../components/Chat/WebCallModal";


import firebase from "../../firebase";

import LoadingPage from "../../pages/LoadingPage/LoadingPage";
import { login } from "../../services/authenticationServices";


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
  signInFailure,
  signInSuccess,

  currentUser,
  updateParticipantCallIdStartDispatch,
  startConversationCallSuccessDispatch,
  startConversationCallErrorDispatch,
  joinConversationCallSuccessDispatch,
  joinConversationCallErrorDispatch,
  leaveConversationCallSuccessDispatch,
  leaveConversationCallErrorDispatch,
  endConversationCallSuccessDispatch,
  endConversationCallErrorDispatch,

}) {


  const [user, setUser] = useState({ authState: "loading" });
  const peer = usePeer();
  const socket = useSocket();



  useEffect(() => {// listening on upcoming events // real time chat
    const log = false;

    if (socket && currentUser?._id) {

      socket.off('start-conversation-call-success')
      socket.off('start-conversation-call-error')
      socket.off('join-conversation-call-success')
      socket.off('join-conversation-call-error')
      socket.off('leave-conversation-call-success')
      socket.off('leave-conversation-call-error')
      socket.off('end-conversation-call-success')
      socket.off('end-conversation-call-error')

      //////////////////////////////////////////////// Calls ///////////////////////////////////////////////////
      // socket.on('start-conversation-call-success', call => {
      //   startConversationCallSuccessDispatch(call)
      //   // console.log({ participant_id, call_id })
      // })
      // socket.on('start-conversation-call-error', error => {
      //   console.log(error);
      //   startConversationCallErrorDispatch(error)
      //   // console.log({ participant_id, call_id })
      // })
      socket.on('join-conversation-call-success', call => {
        joinConversationCallSuccessDispatch(call)
        console.log(call)
      })
      socket.on('join-conversation-call-error', error => {
        console.log(error);
        joinConversationCallErrorDispatch(error)
        // console.log({ participant_id, call_id })
      })
      socket.on('leave-conversation-call-success', call => {
        leaveConversationCallSuccessDispatch(call)
        // console.log({ participant_id, call_id })
      })
      socket.on('leave-conversation-call-error', error => {
        console.log(error);
        leaveConversationCallErrorDispatch(error)
        // console.log({ participant_id, call_id })
      })
      socket.on('end-conversation-call-success', call => {
        endConversationCallSuccessDispatch(call)
        // console.log({ participant_id, call_id })
      })
      socket.on('end-conversation-call-error', error => {
        console.log(error);
        endConversationCallErrorDispatch(error)
        // console.log({ participant_id, call_id })
      })



    }
  }, [socket, currentUser]);


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
    if (peer) {

      peer.on('open', peer_id => {
        console.log('emit update-participant-call-id-start', peer_id)
        updateParticipantCallIdStartDispatch(peer_id)

      });

      peer.on('call', call => {
        console.log('new call', call)
      })


    }

  }, [peer])


  const renderApp = () => {
    if (user.authState === "loading" || !currentUser) {
      return <LoadingPage />;
    }

    return (
      <>

        <Switch>
          <ProtectedRoute
            path="/call/:_id"
            component={WebCallModal}
          />

        </Switch>
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

  updateBalanceSuccessDispatch: (balance) => dispatch(updateBalanceSuccess(balance)),

  updateParticipantCallIdStartDispatch: (call_id) => dispatch(updateParticipantCallIdStart(call_id)),
  startConversationCallSuccessDispatch: (call) => dispatch(startConversationCallSuccess(call)),
  startConversationCallErrorDispatch: (error) => dispatch(startConversationCallError(error)),
  joinConversationCallSuccessDispatch: (call) => dispatch(joinConversationCallSuccess(call)),
  joinConversationCallErrorDispatch: (error) => dispatch(joinConversationCallError(error)),
  leaveConversationCallSuccessDispatch: (call) => dispatch(leaveConversationCallSuccess(call)),
  leaveConversationCallErrorDispatch: (error) => dispatch(leaveConversationCallError(error)),
  endConversationCallSuccessDispatch: (call) => dispatch(endConversationCallSuccess(call)),
  endConversationCallErrorDispatch: (error) => dispatch(endConversationCallError(error)),




});




export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
