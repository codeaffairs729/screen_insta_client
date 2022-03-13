import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  selectCurrentUser,
  selectToken,
} from '../../../redux/user/userSelectors';
import { showModal } from '../../../redux/modal/modalActions';
import { showAlert } from '../../../redux/alert/alertActions';

import Button from '../Button';
import UnfollowPrompt from '../../UnfollowPrompt/UnfollowPrompt';
import { useSocket } from "../../../providers/SocketProvider"
import { followUserStart, unfollowUserStart } from '../../../redux/chat/chatActions'
import { selectIsFollowing } from "../../../redux/chat/chatSelectors";

const FollowButton = ({

  currentUser,
  profile,
  showModal,
  style,
  isFollowingSelector,
  followUserStartDispatch,
  unfollowUserStartDispatch
}) => {
  // const [ setIsFollowing] = useState(following);
  const [loading, setLoading] = useState(false);
  const isFollowing = isFollowingSelector(profile._id)
  const socket = useSocket();


  useEffect(() => {
    setLoading(false);

  }, [isFollowing])

  const followUnFollow = () => {
    // alert(isFollowing)
    setLoading(true)
    if (!isFollowing) {
      socket.emit('follow-user-start', profile._id);
      followUserStartDispatch(profile._id);
    } else {
      socket.emit('unfollow-user-start', profile._id);
      unfollowUserStartDispatch(profile._id);
    }
  }

  if (profile.username === currentUser.username) {
    return <Button disabled>Follow</Button>;
  }

  if (isFollowing) {
    return (
      <Button
        style={style}
        loading={loading}
        onClick={() =>
          showModal(
            {
              options: [
                {
                  warning: true,
                  text: "Unfollow",
                  onClick: () => followUnFollow(),
                },
              ],
              children: <UnfollowPrompt avatar={profile.avatar} username={profile.username} />,
            },
            "OptionsDialog/OptionsDialog"
          )
        }
        inverted
      >
        Following
      </Button>
    );
  }
  return (
    <Button style={style} loading={loading} onClick={() => followUnFollow()}>
      {profile.followPrice ? `Follow (${profile.followPrice.toFixed(2)} $)` : `Follow (Free)`}
    </Button>
  );
};

const mapStateToProps = (state) => ({
  isFollowingSelector: (user_id) => selectIsFollowing(state, user_id),
  currentUser: selectCurrentUser(state),
  token: selectToken(state),
});

const mapDispatchToProps = (dispatch) => ({
  followUserStartDispatch: (user_id) => dispatch(followUserStart(user_id)),
  unfollowUserStartDispatch: (user_id) => dispatch(unfollowUserStart(user_id)),
  showModal: (props, component) => dispatch(showModal(props, component)),
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FollowButton);
