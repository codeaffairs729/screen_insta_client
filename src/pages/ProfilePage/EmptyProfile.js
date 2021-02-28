import React, { Fragment } from 'react';

import Icon from '../../components/Icon/Icon';
import NewPostButton from '../../components/NewPost/NewPostButton/NewPostButton';
import TextButton from '../../components/Button/TextButton/TextButton';
import CreatePostButton from "../../components/CreatePost/CreatePostButton";

const EmptyProfile = ({ currentUserProfile, username }) => (
  <div className="profile-empty">
    <Icon icon="camera-outline" className="icon--larger" />
    {currentUserProfile ? (
      <Fragment>
        <h1 className="heading-1 font-thin">Share Photos</h1>
        <h3 className="heading-3 font-medium">
          When you share photos, they will appear on your profile.
        </h3>
        <CreatePostButton />
      </Fragment>
    ) : (
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
