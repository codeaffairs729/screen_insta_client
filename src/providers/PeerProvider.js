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

        baseURL = constants.DEV_API_URL;
    } else {
        baseURL = constants.API_URL;
    }
    useEffect(() => {
        if (userId) {
            const peer = new Peer(undefined, {
                path: "/peerjs",
                host: "/",
                port: "9000",
            });
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