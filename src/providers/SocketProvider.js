import React, { createContext, useContext, useState, useEffect } from 'react'
import io from 'socket.io-client';
import constants from "../constants";

const SocketContext = createContext();

export function useSocket() {
    return useContext(SocketContext);
}

export function SocketProvider({ id, children }) {

    const [socket, setSocket] = useState();
    let baseURL;
    if (process.env.NODE_ENV === "development") {

        baseURL = constants.DEV_API_URL;
    } else {
        baseURL = constants.API_URL;
    }
    useEffect(() => {

        const newSocket = io(
            baseURL, {
            query: {
                id
            },
            // transports: ["websocket"],
            // headers: { authorization: "1234" },
            // withCredentials: true,
        })
        setSocket(newSocket);
        return () => newSocket.close();

    }, [id]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>)
}


export default SocketProvider;