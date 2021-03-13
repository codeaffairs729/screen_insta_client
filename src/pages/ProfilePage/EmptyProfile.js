import React, { Fragment } from 'react';

import Icon from '../../components/Icon/Icon';
import NewPostButton from '../../components/NewPost/NewPostButton/NewPostButton';
import TextButton from '../../components/Button/TextButton/TextButton';
import CreatePostButton from "../../components/CreatePost/CreatePostButton";
import StateManager from "react-select";

const EmptyProfile = ({ currentUserProfile, username, data }) => (
  <div className="profile-empty">
    <Icon icon="camera-outline" className="icon--larger" />
    {currentUserProfile && (
      <Fragment>
        <h1 className="heading-1 font-thin">Share Photos</h1>
        <h3 className="heading-3 font-medium">
          When you share photos, they will appear on your profile.
        </h3>
        <CreatePostButton />
      </Fragment>
    )}
    {!currentUserProfile && data.postCount > 0 && (
      <Fragment>
        <h1 className="heading-1 font-thin">Follow {username}</h1>
        <h3 className="heading-3 font-medium">
          You need to follow {username} to see their posts.
        </h3>
      </Fragment>
    )}
    {!currentUserProfile && data.postCount === 0 && (
      <Fragment>
        <h1 className="heading-1 font-thin">No Posts Yet</h1>
        <h3 className="heading-3 font-medium">
          When {username} posts, you'll see their photos here.
        </h3>
      </Fragment>
    )}
  </div>
);

export default EmptyProfile;
