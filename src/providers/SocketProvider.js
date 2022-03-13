import React, { createContext, useContext, useState, useEffect } from 'react'
import io from 'socket.io-client';
import constants from "../constants";
import { connect } from "react-redux";
import { selectCurrentUser } from "../redux/user/userSelectors";

const SocketContext = createContext();

export function useSocket() {
    return useContext(SocketContext);
}

export function SocketProvider({ currentUser, children }) {
    const userId = currentUser?._id
    const [socket, setSocket] = useState();
    let baseURL;
    if (process.env.NODE_ENV === "development") {

        baseURL = constants.DEV_API_URL;
    } else {
        baseURL = constants.API_URL;
    }
    useEffect(() => {
        if (userId) {
            const newSocket = io(
                baseURL, {
                query: {
                    id: userId
                },
                // transports: ["websocket"],
                // headers: { authorization: "1234" },
                // withCredentials: true,
            })
            setSocket(newSocket);
            return () => newSocket.close();
        }

    }, [userId]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>)
}
const mapStateToProps = (state) => ({
    currentUser: selectCurrentUser(state),
})

export default connect(mapStateToProps, null)(SocketProvider);