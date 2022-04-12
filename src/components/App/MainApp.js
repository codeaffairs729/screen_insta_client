import React from 'react'
import App from './App'
import CallApp from './CallApp'
import { useRouteMatch } from "react-router-dom";


export default function MainApp() {
    const matchWebCallModal = useRouteMatch("/call/:_id");
    console.log(matchWebCallModal)

    return matchWebCallModal ? <CallApp /> : <App />

}
