import React from "react";
import ReactDOM from "react-dom";

import MainApp from "./components/App/MainApp";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import SocketProvider from "./providers/SocketProvider"
import PeerProvider from "./providers/PeerProvider"

import store from "./redux/store";
import "./sass/main.scss";
import axios from "axios";
import constants from "./constants";

if (process.env.NODE_ENV === "development") {
  // const whyDidYouRender = require("@welldone-software/why-did-you-render");
  // whyDidYouRender(React);
  // console.log("Node development");
  axios.defaults.baseURL = constants.DEV_API_URL;
} else {
  axios.defaults.baseURL = constants.API_URL;
}

ReactDOM.render(
  <Provider store={store}>
    <PeerProvider >
      <SocketProvider >
        <BrowserRouter>
          <MainApp />
        </BrowserRouter>
      </SocketProvider>
    </PeerProvider>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
