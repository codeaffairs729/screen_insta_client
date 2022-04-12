import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import "./ChatPanel.css";
import { Link } from "react-router-dom";
// import { Avatar, Navbar } from 'react-chat-elements'
import dateFormat, { masks } from "dateformat";
import Icon from './../../Icon/Icon';
import { useSocket } from '../../../providers/SocketProvider'

import { startConversationCallStart } from "../../../redux/chat/chatActions";
const interval = 200;
const RecipientInfo = ({
  conversation_id,
  fullName,
  avatar,
  username,
  lastTimeOnline,
  isTyping,
  startConversationCallStartDispatch
}) => {

  const [now, setNow] = useState(new Date())

  const socket = useSocket();
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
      // console.log('now')
    }, interval)
    return () => clearInterval(timer)
  }, [])

  const isOnline = () => now.getTime() - new Date(lastTimeOnline).getTime() < 4000
  const handleStartConversationCall = (conversation_id, type) => {
    if (!socket) return;
    startConversationCallStartDispatch(conversation_id, type)
    socket.emit('start-conversation-call-start', { conversation_id, type })
  }

  return (
    <div className="contact-profile">
      <div className="left-side" >
        <Link to={`/${username}`}>
          <img src={avatar} alt="" className={isOnline() ? "online" : ""} />
        </Link>
        {/* <p>{isTyping}</p> */}
        <div className="participant-info">
          <p className="participant-name">{fullName}</p>
          <p className="participant-state">{isTyping ? 'Typing ...' : lastTimeOnline &&
            (isOnline() ? 'Online' : dateFormat(lastTimeOnline, "dddd dd/mm,  HH:MM TT"))}</p>
        </div>

      </div >
      <div className="middle"></div>
      <div className="right-side">
        <button onClick={() => handleStartConversationCall(conversation_id, "video")}>

          <Icon icon="videocam-outline" />
        </button>
        <button onClick={() => handleStartConversationCall(conversation_id, "audio")}>
          <Icon icon="call-outline" />
        </button>
      </div>
    </div >

  );

};

const mapDispatchToProps = (dispatch) => ({
  startConversationCallStartDispatch: (conversation_id, type) => dispatch(startConversationCallStart(conversation_id, type)),
});

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(RecipientInfo);
