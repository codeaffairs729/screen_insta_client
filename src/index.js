import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App/App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./sass/main.scss";
import axios from "axios";
import constants from "./constants";

if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React);
  console.log("Node development");
  axios.defaults.baseURL = constants.DEV_API_URL;
} else {
  axios.defaults.baseURL = constants.API_URL;
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
