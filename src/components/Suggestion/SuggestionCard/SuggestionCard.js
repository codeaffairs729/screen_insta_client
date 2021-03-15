import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import Avatar from '../../Avatar/Avatar';

const SuggestionCard = ({ avatar, username, fullName, posts, children }) => {
  const history = useHistory();

  return (
    <div className="suggestion-card">
      <Avatar
        onClick={() => history.push("/" + username)}
        className="avatar--large mb-sm"
        imageSrc={avatar}
      />
      <h4 className="heading-4 font-bold">{username}</h4>
      <h4 className="heading-4 color-grey font-medium">{fullName}</h4>
      
      <div className="suggestion-card__footer">
        {children}
      </div>
    </div>
  );
};

export default SuggestionCard;
