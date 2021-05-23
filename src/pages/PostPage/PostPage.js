import React, { Fragment, useEffect } from "react";
import { useParams } from "react-router-dom";

import PostDialog from "../../components/PostDialog/PostDialog";
import MobileHeader from "../../components/Header/MobileHeader/MobileHeader";

const PostPage = () => {
  const { postId } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);;
  }, []);
  
  return (
    <Fragment>
      <MobileHeader backArrow>
        <h3 className="heading-3">Post</h3>
        {/* Empty element to keep grid happy */}
        <div></div>
      </MobileHeader>
      <main className="post-page grid">
        <PostDialog className="border-grey-2" postId={postId} />
      </main>
    </Fragment>
  );
};

export default PostPage;
