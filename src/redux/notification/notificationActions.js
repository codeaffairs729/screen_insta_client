import notificationTypes from './notificationTypes';

import {
  retrieveNotifications,
  // readNotifications,
} from '../../services/notificationServices';


export const fetchNotificationsStart = () => async (dispatch) => {
  try {
    dispatch({ type: notificationTypes.FETCH_NOTIFICATIONS_START });
    const response = await retrieveNotifications();
    dispatch({
      type: notificationTypes.FETCH_NOTIFICATIONS_SUCCESS,
      payload: response,
    });
  } catch (err) {
    dispatch({
      type: notificationTypes.FETCH_NOTIFICATIONS_FAILURE,
      payload: err.message,
    });
  }
};

// export const readNotificationsStart = (authToken) => async (dispatch) => {
//   try {
//     dispatch({ type: notificationTypes.READ_NOTIFICATIONS });
//     await readNotifications(authToken);
//   } catch (err) {
//     console.warn(err.message);
//   }
// };

//socket.io

export const addNotification = (notification) => ({
  type: notificationTypes.ADD_NOTIFICATION,
  payload: notification,
})
export const removeNotification = (notification_id) => ({
  type: notificationTypes.REMOVE_NOTIFICATION,
  payload: notification_id,
})

export const readNotificationStart = (notification_id) => ({
  type: notificationTypes.READ_NOTIFICATION_START,
  payload: notification_id,
})
export const readNotificationSuccess = (notification_id) => ({
  type: notificationTypes.READ_NOTIFICATION_SUCCESS,
  payload: notification_id,
})
export const readNotificationError = (error) => ({
  type: notificationTypes.READ_NOTIFICATION_ERROR,
  payload: error,
})

// export const clearNotifications = () => ({
//   type: notificationTypes.CLEAR_NOTIFICATIONS,
// });
