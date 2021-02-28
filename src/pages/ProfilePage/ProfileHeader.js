import React, { Fragment } from "react";
import { Link } from "react-router-dom";

import ChangeAvatarButton from "../../components/ChangeAvatarButton/ChangeAvatarButton";
import ChangeCoverPictureButton from "../../components/ChangeCoverPictureButton/ChangeCoverPictureButton";
import Avatar from "../../components/Avatar/Avatar";
import UsersList from "../../components/UsersList/UsersList";
import UnfollowPrompt from "../../components/UnfollowPrompt/UnfollowPrompt";
import Button from "../../components/Button/Button";
import SettingsButton from "../../components/SettingsButton/SettingsButton";
import CoverPicture from "../../components/CoverPicture/CoverPicture";

const ProfileHeader = ({
  currentUser,
  data,
  showModal,
  token,
  follow,
  loading,
}) => {
  const { avatar, username, bio, website, fullName, coverPicture } = data.user;
  const { following, followers, postCount } = data;

  const showUsersModal = (followers, following) => {
    token &&
      showModal(
        {
          options: [],
          title: followers ? "Followers" : "Following",
          cancelButton: false,
          children: (
            <UsersList
              userId={data.user._id}
              token={token}
              followersCount={followers}
              followingCount={following}
              following={following}
            />
          ),
        },
        "OptionsDialog/OptionsDialog"
      );
  };

  const renderButton = () => {
    if (currentUser) {
      if (currentUser.username === username) {
        return (
          <Fragment>
            <Link to="/settings/edit">
              <Button inverted>Edit Profile</Button>
            </Link>
            <SettingsButton />
          </Fragment>
        );
      } else if (data.isFollowing) {
        return (
          <Button
            loading={loading}
            onClick={() =>
              showModal(
                {
                  options: [
                    {
                      warning: true,
                      text: "Unfollow",
                      onClick: () => follow(),
                    },
                  ],
                  children: (
                    <UnfollowPrompt
                      avatar={data.user.avatar}
                      username={data.user.username}
                    />
                  ),
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
    }
    if (currentUser.username === username) {
      return null;
    }
    return (
      <Button loading={loading} onClick={() => follow(data.user._id, token)}>
        Follow
      </Button>
    );
  };
  const defaultCover = require("../../assets/img/default-cover.jpg");
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
          <h1 className="heading-1 font-thin">{username}</h1>
          {renderButton()}
        </div>

        <div className="profile-stats">
          <p className="heading-3">
            <b>{postCount}</b> {postCount === 1 ? "post" : "posts"}
          </p>
          <p
            onClick={() => showUsersModal(followers)}
            style={{ cursor: "pointer" }}
            className="heading-3"
          >
            <b>{followers}</b>{" "}
            {followers > 1 || followers === 0 ? "followers" : "follower"}
          </p>
          <p
            onClick={() => showUsersModal(null, following)}
            style={{ cursor: "pointer" }}
            className="heading-3"
          >
            <b>{following}</b> following
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
            <b>{postCount}</b>
            <span className="font-medium color-grey">
              {postCount === 1 ? "post" : "posts"}
            </span>
          </h3>
          <h3
            onClick={() => showUsersModal(followers)}
            style={{ cursor: "pointer" }}
            className="heading-3"
          >
            <b>{followers}</b>{" "}
            <span className="font-medium color-grey">
              {followers > 1 || followers === 0 ? "followers" : "follower"}
            </span>
          </h3>
          <h3
            onClick={() => showUsersModal(null, following)}
            style={{ cursor: "pointer" }}
            className="heading-3"
          >
            <b>{following}</b>
            <span className="font-medium color-grey">following</span>
          </h3>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
