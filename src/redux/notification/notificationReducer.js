import notificationTypes from './notificationTypes';

const INITIAL_STATE = {
  notifications: [],
  fetching: false,
  error: false,
};

const notificationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case notificationTypes.ADD_NOTIFICATION: {
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    }
    case notificationTypes.READ_NOTIFICATION_SUCCESS: {
      const { payload: notification_id } = action

      const newNotifications = state.notifications.map(not => not._id !== notification_id ? not : { ...not, read: true })
      return {
        ...state,
        notifications: newNotifications,
      };
    }
    case notificationTypes.REMOVE_NOTIFICATION: {
      const { payload: notification } = action;
      const newNotifications = state.notifications.filter(not => not._id !== notification._id);

      return {
        ...state,
        notifications: newNotifications,
      };
    }
    case notificationTypes.FETCH_NOTIFICATIONS_START: {
      return {
        ...state,
        fetching: true,
        error: false,
      };
    }
    case notificationTypes.FETCH_NOTIFICATIONS_FAILURE: {
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    }
    case notificationTypes.FETCH_NOTIFICATIONS_SUCCESS: {
      const unreadCount = action.payload.filter(
        (notification) => notification.read === false
      ).length;
      return {
        ...state,
        fetching: false,
        error: false,
        notifications: action.payload,
        unreadCount,
      };
    }
    case notificationTypes.READ_NOTIFICATIONS: {
      const notifications = JSON.parse(JSON.stringify(state.notifications));
      notifications.forEach((notification) => (notification.read = true));
      return {
        ...state,

        notifications,
      };
    }
    case notificationTypes.CLEAR_NOTIFICATIONS: {
      return {
        ...state,
        notifications: [],
      };
    }
    default: {
      return state;
    }
  }
};

export default notificationReducer;
