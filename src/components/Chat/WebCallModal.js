import React, { useEffect, useState, useRef, useMemo } from "react";
import Draggable from 'react-draggable';
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { selectCurrentUser } from "../../redux/user/userSelectors";
import inputRingtone from "../../assets/audio/input-ringtone.mp3"
import outputRingtone from "../../assets/audio/output-ringtone.mp3"
// import "react-responsive-modal/styles.css";
// import { Modal } from "react-responsive-modal";
import "./WebCallModal.scss";
import Icon from "../Icon/Icon"
import { usePeer } from "../../providers/PeerProvider"
import { useSocket } from "../../providers/SocketProvider"


import {
    fetchCallById,
    startConversationCallStart,
    // connectToConversationCallStart,
    joinConversationCallStart,
    leaveConversationCallStart

}
    from "../../redux/chat/chatActions";


const volumeLevelsIcons = {
    0: "volume-off-outline",
    1: "volume-low-outline",
    2: "volume-medium-outline",
    3: "volume-high-outline",
    4: "volume-mute-outline"
}

const addVideoStream = (video, stream, target) => {
    if (!video || !stream || !target) return
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
        target.innerHTML = ""
        target.append(video);
    });
};
const WebCallModal = ({
    currentUser,
    currentCall,
    fetchCallByIdDispatch,
    connectToConversationCallStartDispatch,
    joinConversationCallStartDispatch,
    leaveConversationCallStartDispatch

}) => {
    const { _id: call_id } = useParams();
    const peer_id = currentUser?.peer_id

    //usefull memo computation;
    const isOutputCall = useMemo(() => currentUser && currentCall && currentCall.caller === currentUser._id, [currentUser, currentCall]);
    const isInputCall = useMemo(() => currentUser && currentCall && currentCall.caller !== currentUser._id, [currentUser, currentCall]);
    const joinedParticipants = useMemo(() => currentUser && currentCall && currentCall.participants.filter(part => part._id !== currentUser._id && currentCall.joinedParticipants.find(jp => part._id === jp)), [currentUser, currentCall])
    const userHasJoined = useMemo(() => currentCall?.joinedParticipants.find(jp => jp === currentUser._id), [currentCall, currentUser])
    const outputRinging = useMemo(() => isOutputCall && joinedParticipants && joinedParticipants.length === 0, [isOutputCall, joinedParticipants]);
    const inputRinging = useMemo(() => isInputCall && !userHasJoined, [isInputCall, userHasJoined])


    // console.log("isInputCall", isInputCall)
    console.log("inputRinging", inputRinging)

    // console.log("isOutputCall", isOutputCall)
    console.log("outputringing", outputRinging)

    const peer = usePeer();
    const socket = useSocket();

    const ringtoneRef = useRef();

    const [isAudio, setAudio] = useState(true);
    const [isVideo, setVideo] = useState(true);
    const [outputStream, setOutputStream] = useState(null);
    const [inputStreams, setInputStreams] = useState({});
    // console.log("inputStreams", inputStreams);


    const getMyMediaStream = (isVideo, isAudio) => {// return stream;
        return navigator.mediaDevices.getUserMedia({
            audio: isAudio,
            video: isVideo,
        })
    }


    ////////////////////////////////////////////////// init /////////////////////////////////////////

    useEffect(() => {
        if (!socket || !currentCall) return;
        const beforeunloadListener = (e) => {
            // alert();
            // socket.emit("leave-conversation-call-start", currentCall._id)
            // leaveConversationCallStartDispatch(currentCall._id)
            console.log(e)

            e.preventDefault();
            e.returnValue = '';

        }
        window.addEventListener('beforeunload', beforeunloadListener);
        window.addEventListener('unload', () => alert());

        return () => {
            window.removeEventListener('beforeunload', beforeunloadListener);
        }
    }, [socket, currentCall])
    ////////////////////////////////////////////////// Get the current call (from server) /////////////////////////////////////////

    useEffect(() => {
        call_id && fetchCallByIdDispatch(call_id)
    }, [call_id])

    ////////////////////////////////////////////////// init audio players (ringtone) /////////////////////////////////////////

    useEffect(() => {
        const ringtonePlayer = ringtoneRef.current;
        ringtonePlayer.pause();
        if (!inputRinging && !outputRinging) return;

        const loadMetadataHandler = () => ringtonePlayer.play();
        const endedHandler = () => ringtonePlayer.play();

        ringtonePlayer.addEventListener("loadedmetadata", loadMetadataHandler);
        ringtonePlayer.addEventListener('ended', endedHandler);


        return () => {
            ringtonePlayer.removeEventListener("loadedmetadata", loadMetadataHandler);
            ringtonePlayer.removeEventListener('ended', endedHandler);
        }

    }, [inputRinging, outputRinging])



    //////////////////////////////////////////////////////// the caller need to join the call automatically ////////////////
    useEffect(() => {

        if (isOutputCall && peer_id) {
            socket.emit("join-conversation-call-start", { call_id, peer_id });
            joinConversationCallStartDispatch({ call_id, peer_id })
        }
    }, [isOutputCall, peer_id]);

    useEffect(() => {
        Object.entries(peer.connections).map(([peer_id, conns]) => {// now is only one (one to one call)
            conns.map(conn => conn.on('close', () => {
                console.log('closed', conn)
            }))// really works
            return "";
        })
    }
        , [peer.connections]);

    const cancelCallHandler = () => {
        socket.emit("leave-conversation-call-start", currentCall._id)
        leaveConversationCallStartDispatch(currentCall._id)
    }
    const answerCallHandler = () => {
        if (call_id && peer_id) {
            socket.emit("join-conversation-call-start", { call_id, peer_id });
            joinConversationCallStartDispatch({ call_id, peer_id })
        }
    }

    ///////////////////////////////////////////////////////////////// Init Output Stream /////////////////////////////////////
    useEffect(() => {

        // console.log("audio", isAudio, "video", isVideo);
        const call = async () => {
            if (!isAudio && !isVideo) return console.log('impossible')

            const bigViewGrid = document.getElementById("big-view-grid");
            const myVideo = document.createElement("video");
            try {
                const stream = await getMyMediaStream(isVideo, isAudio);
                setOutputStream(stream);
                addVideoStream(myVideo, stream, bigViewGrid);

            } catch (err) {
                console.log(err);
            }

        }
        call()
    }, [isVideo, isAudio]);


    //////////////////////////////////////////////////////////////////////////////// answering peer to peer calls //////////////////////////////////////
    useEffect(() => {
        // if (!outputStream) return;
        peer.off("call")
        const listener = call => {

            call.answer();

            call.on("stream", (inputStream) => {
                setInputStreams({ ...inputStreams, [call.peer]: inputStream })
                console.log('receving call from', call.peer)
                // alert(" call received")
            });

        }
        peer.on("call", listener)

    }, [currentCall, currentUser])

    ////////////////////////////////////////////////////////////////// making peer to peer calls to joinedParticipant ////////////////////////////////////////

    useEffect(() => {
        const call = async () => {

            joinedParticipants.map(part => {
                console.log("calling", part.peer_id)
                const call = peer.call(part.peer_id, outputStream);
                return "";

            })
            // alert(" call start ");
            // Object.entries(peer.connections).map(([peer_id, conns]) => {
            //     conns.map(conn => conn.close());
            //     return "";
            // })
        }
        peer && joinedParticipants && outputStream && call()
    }, [peer, joinedParticipants, outputStream]);


    useEffect(() => {

        Object.entries(inputStreams).map(([peer_id, inputStream]) => {
            inputStream.oninactive = () => alert('inactive')
            const smallVideoGrid = document.getElementById("small-view-grid-" + peer_id);
            const video = document.createElement("video");
            if (inputStream.getVideoTracks().length === 0) video.style["display"] = "none";
            addVideoStream(video, inputStream, smallVideoGrid);
            return "";
        })

    }, [inputStreams]);

    return (
        <div className="wcm-container">
            <div className="grid-container">
                <div className="grid-item wcm-header">
                    <button className="wcm-button"><Icon icon="chevron-down" /> </button>
                    <div><span className="participant-name">{currentUser && currentUser.fullName}</span></div>
                    <div className="flex-grow-1"></div >
                    <button className="wcm-button" onClick={() => answerCallHandler()}><Icon icon="ellipsis-horizontal-outline" />  </button>
                    <button className="wcm-button red-button" onClick={() => cancelCallHandler()}><Icon icon="close-outline" /></button >
                </div>
                <div className="grid-item wcm-main" >

                    <div className="big-view" id="big-view-grid"></div>
                    {/* <Draggable ><div className="small-view" id="small-view-grid"></div></Draggable> */}
                    {userHasJoined && joinedParticipants?.map((part, i) => (<Draggable key={part._id}>

                        <div className={"small-view pos-" + i} >
                            <div className="video-container" id={"small-view-grid-" + part.peer_id}>

                            </div>
                            {inputStreams[part.peer_id]?.getVideoTracks().length === 0 && (<div className="participant-no-media-view">
                                <img className="wcm-avatar" src={part.avatar} alt="participant-avatar" />
                                <div className="wcm-participant-name">{part.fullName}</div>
                                <div className="wcm-call-time">{part.audioCallTime}</div>
                            </div>)}
                        </div>
                    </Draggable>)
                    )}

                </div>
                <div className="grid-item wcm-footer">
                    <button className="wcm-button red-button" onClick={() => setVideo(!isVideo)}><Icon icon={isVideo ? "videocam-outline" : "videocam-off-outline"} /></button >
                    <button className="wcm-button red-button" onClick={() => setAudio(!isAudio)}><Icon icon={isAudio ? "mic-outline" : "mic-off-outline"} /></button >
                    <button className="wcm-button red-button"><Icon icon={volumeLevelsIcons[0]} /></button >
                    <button className="wcm-button red-button"><Icon icon="close-outline" /></button >
                </div>
            </div>
            <audio src={outputRinging ? outputRingtone : inputRinging ? inputRingtone : null} ref={ringtoneRef}></audio>
        </div >
    );

}

const mapStateToProps = state => ({
    currentCall: state.chat.currentCall,
    currentUser: selectCurrentUser(state),
})


const mapDistpachToProps = (dispatch) => ({
    fetchCallByIdDispatch: (call_id) => dispatch(fetchCallById(call_id)),
    startConversationCallStartDispatch: (conversation_id, type) => dispatch(startConversationCallStart(conversation_id, type)),
    // connectToConversationCallStartDispatch: (call_id, peer_id) => dispatch(connectToConversationCallStart(call_id, peer_id)),
    joinConversationCallStartDispatch: (payload) => dispatch(joinConversationCallStart(payload)),
    leaveConversationCallStartDispatch: (call_id) => dispatch(leaveConversationCallStart(call_id)),
});

export default connect(mapStateToProps, mapDistpachToProps)(WebCallModal)
