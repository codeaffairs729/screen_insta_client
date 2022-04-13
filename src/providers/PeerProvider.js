import React, { createContext, useContext, useState, useEffect } from 'react'
import Peer from 'peerjs';
import constants from "../constants";
import { connect } from "react-redux";
import { selectCurrentUser } from "../redux/user/userSelectors";

const PeerContext = createContext();

export function usePeer() {
    return useContext(PeerContext);
}

export function PeerProvider({ currentUser, children }) {
    const userId = currentUser?._id
    const [peer, setPeer] = useState();
    let baseURL;
    if (process.env.NODE_ENV === "development") {

        baseURL =
        {
            path: "/peerjs",
            host: "/",
            port: "9000",
        }
    } else {

        baseURL = {
            path: "/peerjs",
            host: "betweenus1.herokuapp.com",
            port: "",
        }
    }
    useEffect(() => {
        if (userId) {
            const peer = new Peer(undefined, baseURL);
            setPeer(peer);
            return () => peer.disconnect();
        }

    }, [userId]);

    return (
        <PeerContext.Provider value={peer}>
            {children}
        </PeerContext.Provider>)
}
const mapStateToProps = (state) => ({
    currentUser: selectCurrentUser(state),
})

export default connect(mapStateToProps, null)(PeerProvider);