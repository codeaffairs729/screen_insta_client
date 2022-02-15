// import React, { useEffect, useCallback, useState } from "react";
// import { connect } from "react-redux";
// import "./ChatPanel.css";
// import ConversationsList from "./ConversationsList";
// import Messages from "./Messages";
// import RecipientInfo from "./RecipientInfo";
// import SenderInfo from "./SenderInfo";
// import {
//   getConversationMessages,
//   getConversationRecipient,
// } from "./../ChatUtils";
// import { useParams } from "react-router";
// import {
//   fetchConversations,
//   sendNewMessage,
// } from "../../../redux/chat/chatActions";
// import { useHistory } from "react-router-dom";
// import { selectCurrentUser } from "../../../redux/user/userSelectors";

// const ChatPanel = ({
//   conversations,
//   fetchConversationsError,
//   conversationsFetching,
//   fetchAllConversations,
//   currentUser,
//   addMessage,
// }) => {
//   const { conversationId } = useParams();
//   const [messages, setMessages] = useState(null);
//   const [recipient, setRecipient] = useState(null);
//   const history = useHistory();

//   useEffect(() => {
//     document.title = "BetweenUs";
//   }, []);

//   useEffect(() => {
//     console.debug("fetching conversations");
//     if (!conversationsFetching && !fetchConversationsError) {
//       fetchAllConversations(0);
//     }
//   }, []);

//   useEffect(() => {
//     console.debug("getting conversations messages");
//     if (conversationId === "all") {
//       if (conversations && conversations.length > 0) {
//         history.push("/messages/" + conversations[0].conversationId);
//       }
//     }
//     if (conversations && conversationId !== "all") {
//       setMessages(getConversationMessages(conversations, conversationId));
//       setRecipient(getConversationRecipient(conversations, conversationId));
//     }
//   }, [conversations, conversationId, history]);

//   const onMessageSent = (payload) => {
//     payload.conversationId = conversationId;
//     addMessage(payload);
//     let newMessages = messages;
//     newMessages.push({
//       type: payload.message.type,
//       text: payload.message.text,
//       incoming: false,
//       sentAt: new Date(),
//     });
//     setMessages(newMessages);
//   };

//   if (!conversations || !messages) {
//     return <p>Loading...</p>;
//   }
//   return (
//     <div id="panel">
//       <div id="frame">
//         <div id="sidepanel">
//           <SenderInfo
//             fullName={currentUser.fullName}
//             avatar={currentUser.avatar}
//           />
//           <div id="search">
//             <label for="">
//               <i class="fa fa-search" aria-hidden="true"></i>
//             </label>
//             <input type="text" placeholder="Search contacts..." />
//           </div>

//           <ConversationsList data={conversations} />
//         </div>
//         <div class="content">
//           <RecipientInfo
//             avatar={recipient.avatar}
//             fullName={recipient.fullName}
//             username={recipient.username}
//           />
//           <Messages
//             data={messages}
//             recipient={recipient}
//             onMessageSent={onMessageSent}
//           />
//           <div class="message-input">
//             <div class="wrap"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const mapStateToProps = (state) => {
//   return {
//     conversations: state.chat.conversations,
//     fetchConversationsError: state.chat.fetchConversationsError,
//     conversationsFetching: state.chat.conversationsFetching,
//     currentUser: selectCurrentUser(state),
//   };
// };

// const mapDistpachToProps = (dispatch) => ({
//   fetchAllConversations: (offset) => dispatch(fetchConversations(offset)),
//   addMessage: (message) => dispatch(sendNewMessage(message)),
// });

// export default connect(mapStateToProps, mapDistpachToProps)(ChatPanel);
