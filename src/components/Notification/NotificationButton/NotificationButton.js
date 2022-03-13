import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTransition } from 'react-spring';

import {
  selectNotifications,
  selectUnreadNotificationsCount
} from '../../../redux/notification/notificationSelectors';

import Icon from '../../Icon/Icon';
import NotificationPopup from './NotificationPopup/NotificationPopup';
import PopupCard from '../../PopupCard/PopupCard';
import NotificationFeed from '../NotificationFeed/NotificationFeed';

const NotificationButton = ({
  notifications,
  unreadNotificationsCountSelector,
  mobile,
  icon,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationPopupTimeout, setShowNotificationPopupTimeout] = useState(
    null
  );
  const unreadNotificationsCount = unreadNotificationsCountSelector();

  useEffect(() => {
    if (notificationPopupTimeout) {
      clearTimeout(notificationPopupTimeout);
    }
    if (unreadNotificationsCount > 0) {
      !showNotificationPopup && setShowNotificationPopup(true);
      setShowNotificationPopupTimeout(
        setTimeout(() => setShowNotificationPopup(false), 10000)
      );
    }
  }, [unreadNotificationsCount]);

  useEffect(() => {
    if (showNotifications) {
      clearTimeout(notificationPopupTimeout);
      setShowNotificationPopup(false);
    }
  }, [showNotifications, notificationPopupTimeout]);

  const transitions = useTransition(
    unreadNotificationsCount > 0 && showNotificationPopup
      ? { notifications }
      : false,
    null,
    {
      from: {
        transform: 'scale(0) translateX(-50%)',
        opacity: 0,
      },
      enter: {
        transform: 'scale(1) translateX(-50%)',
        opacity: 1,
      },
      leave: {
        transform: 'scale(0) translateX(-50%)',
        opacity: 0,
      },
      config: {
        tension: 280,
        friction: 20,
      },
    }
  );

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <button className="notification-button">
        <Icon
          icon={icon ? icon : showNotifications ? 'heart' : 'heart-outline'}
          className={unreadNotificationsCount > 0 ? 'icon--unread' : ''}
          onClick={() =>
            !mobile && setShowNotifications((previous) => !previous)
          }
          style={{ cursor: 'pointer' }}
        />
        {transitions.map(
          ({ item, key, props }) =>
            item && (
              <NotificationPopup
                style={props}
                notifications={item.notifications}
                key={key}
              />
            )
        )}
      </button>
      {showNotifications && !mobile && (
        <PopupCard hide={() => setShowNotifications(false)} leftAlign>
          <NotificationFeed setShowNotifications={setShowNotifications} />
        </PopupCard>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  notifications: selectNotifications(state),
  unreadNotificationsCountSelector: () => selectUnreadNotificationsCount(state)
});

export default connect(mapStateToProps)(NotificationButton);
