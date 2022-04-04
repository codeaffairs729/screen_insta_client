import React, { useEffect, useState, useMemo } from "react";
import Draggable from 'react-draggable';
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { selectCurrentUser } from "../../redux/user/userSelectors";

// import "react-responsive-modal/styles.css";
// import { Modal } from "react-responsive-modal";
import "./WebCallModal.scss";
import Icon from "../Icon/Icon"
import { usePeer } from "../../providers/PeerProvider"
import { useSocket } from "../../providers/SocketProvider"


import {
    fetchCallById,
    joinConversationCallStart,
}
    from "../../redux/chat/chatActions";

const volumeLevelsIcons = {
    0: "volume-off-outline",
    1: "volume-low-outline",
    2: "volume-medium-outline",
    3: "volume-high-outline",
    4: "volume-mute-outline"
}
let outputStream;

const addVideoStream = (video, stream, target) => {
    if (!video || !stream || !target) return;
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
        target.innerHTML = ""
        target.append(video);
    });
};
const WebCallModal = ({ currentUser, currentCall, fetchCallByIdDispatch, joinConversationCallStartDispatch }) => {
    const { _id: call_id } = useParams();
    const isOutputCall = useMemo(() => currentUser && currentCall && currentCall.caller === currentUser._id, [currentUser, currentCall]);
    const joinedParticipants = useMemo(() => currentUser && currentCall && currentCall.participants.filter(part => part._id !== currentUser._id && currentCall.joinedParticipants.find(jp => part._id === jp)), [currentUser, currentCall])
    // console.log("isOutputCal", isOutputCall)
    // console.log("joinedParticipants", joinedParticipants)


    const peer = usePeer();
    const socket = useSocket();

    const [isAudio, setAudio] = useState(true);
    const [isVideo, setVideo] = useState(true);
    const [outputStream, setOutputStream] = useState(null);
    const [inputStreams, setInputStreams] = useState(null);
    const [peerId, setPeerId] = useState(null);

    const [switchView, setSwitchView] = useState(false);

    const [participantsList, setParticipantsList] = useState([]);


    const getMyMediaStream = () => {// return stream;
        return navigator.mediaDevices.getUserMedia({
            audio: isAudio,
            video: isVideo,
        })
    }

    ////////////////////////////////////////////////// Get the current call (from server) /////////////////////////////////////////

    useEffect(() => {
        if (call_id) {
            fetchCallByIdDispatch(call_id)
        }

    }, [call_id])

    const handleJoinCall = () => {
        if (socket && currentCall && currentUser && currentUser.peer_id) {
            socket.emit("join-conversation-call-start", { call_id: currentCall._id, peer_id: currentUser.peer_id })
            joinConversationCallStartDispatch({ call_id: currentCall._id, peer_id: currentUser.peer_id })
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
                const stream = await getMyMediaStream();
                setOutputStream(stream);
                addVideoStream(myVideo, stream, bigViewGrid);

            } catch (err) {
                console.log(err);
            }

        }
        call()
    }, [isVideo, isAudio]);


    // useEffect(() => {

    //     const myVideox = document.createElement("video");
    //     const smallVideoGrid = document.getElementById("small-view-grid");

    //     addVideoStream(myVideox, outputStream, smallVideoGrid);
    //     // console.log("here we go ", outputStream);


    // }, [outputStream]);


    //////////////////////////////////////////////////////////////////////////////// answering peer to peer calls //////////////////////////////////////
    useEffect(() => {
        if (!outputStream) return;
        const listener = (call) => {
            alert("receiving call")
            call.answer(outputStream);

            call.on("stream", (inputStream) => {
                const smallVideoGrid = document.getElementById("small-view-grid");
                const video = document.createElement("video");
                alert("receiving call stream")
                addVideoStream(video, inputStream, smallVideoGrid);
            });

        }
        peer.on("off", listener);
        peer.on("call", listener)

    }, [outputStream])

    ////////////////////////////////////////////////////////////////// making peer to peer calls to joinedParticipant ////////////////////////////////////////

    useEffect(() => {

        const call = async () => {
            joinedParticipants.map(part => {
                if (part.peer_id) {
                    const call = peer.call(part.peer_id, outputStream);
                    alert('making call')
                    call.on("stream", inputStream => {
                        const smallVideoGrid = document.getElementById("small-view-grid");
                        const video = document.createElement("video");
                        alert("receiving call stream")
                        addVideoStream(video, inputStream, smallVideoGrid);
                    })

                }
                return "";
            })

        }
        joinedParticipants && peer && outputStream && call()
    }, [joinedParticipants, peer, outputStream]);






    return (
        <div className="wcm-container">
            <div className="grid-container">
                <div className="grid-item wcm-header">
                    <button className="wcm-button"><Icon icon="chevron-down" /> </button>
                    <div><span className="participant-name">Amine Belhaj</span></div>
                    <div className="flex-grow-1"></div >
                    <button className="wcm-button"><Icon icon="ellipsis-horizontal-outline" />  </button>
                    <button className="wcm-button red-button" onClick={() => handleJoinCall()}><Icon icon="close-outline" /></button >
                </div>
                <div className="grid-item wcm-main" >

                    <div className="big-view" id="big-view-grid"></div>
                    <Draggable ><div className="small-view" id="small-view-grid"></div></Draggable>
                    {/* {joinedParticipants && joinedParticipants.map(part => (<Draggable key={part._id}>

                        <div className="small-view" id="small-view-grid">
                            <div className="participant-no-media-view">
                                <img className="wcm-avatar" src={part.avatar} alt="participant-avatar" />
                                <div className="wcm-participant-name">{part.fullName}</div>
                                <div className="wcm-call-time">50:51</div>
                            </div>
                        </div>


                    </Draggable>)
                    )} */}

                </div>
                <div className="grid-item wcm-footer">
                    <button className="wcm-button red-button" onClick={() => setVideo(!isVideo)}><Icon icon={isVideo ? "videocam-outline" : "videocam-off-outline"} /></button >
                    <button className="wcm-button red-button" onClick={() => setAudio(!isAudio)}><Icon icon={isAudio ? "mic-outline" : "mic-off-outline"} /></button >
                    <button className="wcm-button red-button"><Icon icon={volumeLevelsIcons[0]} /></button >
                    <button className="wcm-button red-button"><Icon icon="close-outline" /></button >
                </div>
            </div>
        </div >
    );

}

const mapStateToProps = state => ({
    currentCall: state.chat.currentCall,
    currentUser: selectCurrentUser(state),
})


const mapDistpachToProps = (dispatch) => ({
    fetchCallByIdDispatch: (call_id) => dispatch(fetchCallById(call_id)),
    joinConversationCallStartDispatch: (call) => dispatch(joinConversationCallStart(call)),
});

export default connect(mapStateToProps, mapDistpachToProps)(WebCallModal)
