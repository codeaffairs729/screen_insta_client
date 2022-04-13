import React from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

import ChangeAvatarButton from "../../components/ChangeAvatarButton/ChangeAvatarButton";
import ChangeCoverPictureButton from "../../components/ChangeCoverPictureButton/ChangeCoverPictureButton";
import Avatar from "../../components/Avatar/Avatar";
import UsersList from "../../components/UsersList/UsersList";
import CoverPicture from "../../components/CoverPicture/CoverPicture";
import SettingsButton from "../../components/SettingsButton/SettingsButton";
import FollowButton from "../../components/Button/FollowButton/FollowButton";
import Button from "../../components/Button/Button";

import { sendTip } from "../../redux/user/userActions";

const ProfileHeader = ({
  currentUser,
  data,
  showModal,
}) => {
  const { avatar, username, bio, website, fullName, coverPicture } = data.user;
  const { followingsCount, followersCount, postsCount } = data;
  const params = useParams();
  const history = useHistory();
  const showUsersModal = (followersCount, followingsCount, following) => {
    showModal(
      {
        options: [],
        title: followersCount ? "Followers" : "Following",
        cancelButton: false,
        children: (
          <UsersList
            userId={data.user._id}
            followersCount={followersCount}
            followingsCount={followingsCount}
            following={following}
          />
        ),
      },
      "OptionsDialog/OptionsDialog"
    );
  };


  // const startSendTip = (amount, tipMessage) => {
  //   sendTip(amount, data.user._id, tipMessage);
  // };

  return (
    <header className="profile-header">
      <div className="profile-header__cover">
        {currentUser && currentUser.username === username ? (
          <ChangeCoverPictureButton editable={true}>
            <CoverPicture editable={true} imageSrc={currentUser.coverPicture} />
          </ChangeCoverPictureButton>
        ) : (
          <CoverPicture editable={false} imageSrc={coverPicture} />
        )}
      </div>
      {currentUser && currentUser.username === username ? (
        <ChangeAvatarButton>
          <Avatar
            style={{ zIndex: 9 }}
            className="profile-header__avatar"
            imageSrc={currentUser.avatar}
          />
        </ChangeAvatarButton>
      ) : (
        <Avatar
          style={{ zIndex: 9 }}
          className="profile-header__avatar"
          imageSrc={avatar}
        />
      )}

      <div className="profile-header__info">
        <div className="profile-buttons">
          <div className="profile-info">
            <p className="profile-username heading-1">{username}</p>
            <p className="profile-fullname heading-2 font-thin">{fullName}</p>
          </div>

          {params && params.username === currentUser.username ?
            <Button inverted onClick={() => history.push('/settings/edit')}>Edit Profile</Button> :
            <FollowButton
              profile={data.user}
            />}
          <SettingsButton />

        </div>

        <div className="profile-stats">
          <p className="heading-3">
            <b>{postsCount}</b> {postsCount === 1 ? "post" : "posts"}
          </p>
          <p
            onClick={() => showUsersModal(followersCount, null, false)}
            style={{ cursor: "pointer" }}
            className="heading-3"
          >
            <b>{followersCount}</b>{" "}
            {followersCount > 1 || followersCount === 0 ? "followers" : "follower"}
          </p>
          <p
            onClick={() => showUsersModal(null, followingsCount, true)}
            style={{ cursor: "pointer" }}
            className="heading-3"
          >
            <b>{followingsCount}</b> following
          </p>
        </div>

        <div>
          <p className="heading-3" style={{ whiteSpace: "pre-wrap" }}>
            {bio}
          </p>
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="heading-3 link font-bold"
            >
              {website}
            </a>
          )}
        </div>
      </div>

      <div className="profile-header__mobile-user-details">
        <div>
          <h3
            className="heading-3 font-medium"
            style={{ whiteSpace: "pre-wrap", textAlign: "center" }}
          >
            {bio}
          </h3>
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="heading-3 link font-bold"
            >
              <p style={{ textAlign: "center" }}>{website}</p>
            </a>
          )}
        </div>

        <div className="profile-stats">
          <h3 className="heading-3">
            <b>{postsCount}</b>
            <span className="font-medium color-grey">
              {postsCount === 1 ? "post" : "posts"}
            </span>
          </h3>
          <h3
            onClick={() => showUsersModal(followersCount, null, false)}
            style={{ cursor: "pointer" }}
            className="heading-3"
          >
            <b>{followersCount}</b>{" "}
            <span className="font-medium color-grey">
              {followersCount > 1 || followersCount === 0 ? "followers" : "follower"}
            </span>
          </h3>
          <h3
            onClick={() => showUsersModal(null, followingsCount, true)}
            style={{ cursor: "pointer" }}
            className="heading-3"
          >
            <b>{followingsCount}</b>
            <span className="font-medium color-grey">following</span>
          </h3>
        </div>
      </div>
    </header>
  );
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  sendTipDispatch: (tipAmount, userId, tipMessage) =>
    dispatch(sendTip(tipAmount, userId, tipMessage)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileHeader);
