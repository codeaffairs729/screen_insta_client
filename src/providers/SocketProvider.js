import React, { createContext, useContext, useState, useEffect } from 'react'
import io from 'socket.io-client';

const SocketContext = createContext();

export function useSocket() {
    return useContext(SocketContext);
}

export function SocketProvider({ id, children }) {

    const [socket, setSocket] = useState();
    console.log("id", id)
    useEffect(() => {

        const newSocket = io(
            'http://localhost:9000', {
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