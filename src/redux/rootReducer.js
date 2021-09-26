import { combineReducers } from "redux";

import userReducer from "./user/userReducer.js";
import modalReducer from "./modal/modalReducer";
import alertReducer from "./alert/alertReducer";
import notificationReducer from "./notification/notificationReducer";
import feedReducer from "./feed/feedReducer";
import chatReducer from "./chat/chatReducer.js";
import mediaReducer from "./media/mediaReducer";

const rootReducer = combineReducers({
  user: userReducer,
  modal: modalReducer,
  alert: alertReducer,
  notifications: notificationReducer,
  feed: feedReducer,
  chat: chatReducer,
  media: mediaReducer,
});

export default rootReducer;
