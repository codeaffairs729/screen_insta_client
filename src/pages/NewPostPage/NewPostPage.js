import React, { useState, Fragment } from "react";
import { useHistory, Redirect } from "react-router-dom";

import { createStructuredSelector } from "reselect";
import { selectCurrentUser, selectToken } from "../../redux/user/userSelectors";
import NewPost from "../../components/NewPost/NewPost";
import MobileHeader from "../../components/Header/MobileHeader/MobileHeader";
import TextButton from "../../components/Button/TextButton/TextButton";
import Icon from "../../components/Icon/Icon";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CreatePostMediaSelector from "../../components/CreatePost/SubComponent/CreatePostMediaSelector";
import { showAlert } from "../../redux/alert/alertActions";
import { createPost } from "../../services/postService";
import { connect } from "react-redux";
import { addPost } from "../../redux/feed/feedActions";
import PostPrice from "../../components/CreatePost/PostPrice";
import Button from "../../components/Button/Button";

const NewPostPage = ({ location, currentUser }) => {
  const history = useHistory();
  const [medias, setMedias] = useState([]);
  const [price, setPrice] = useState(0);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const onMediaSelected = (selectedMedias) => {
    setMedias(selectedMedias);
  };

  const onPriceSelected = (selectedPrice) => {
    setPrice(selectedPrice);
  };

  const onCaptionChanged = (text) => {
    setCaption(text);
  };

  const onSubmitClicked = async () => {
    console.log("onSubmit clicked");
    setLoading(true);
    const formData = new FormData();
    for (let i = 0; i < medias.length; i++) {
      const media = medias[i];
      formData.append(`medias`, media);
    }
    formData.set("caption", caption);
    formData.set("postPrice", price);
    try {
      const post = await createPost(formData);
      showAlert("Post created successfully");
      setLoading(false);
      history.push("/");
    } catch (e) {
      console.error(e);
      setLoading(false);
      showAlert(e.message);
    }
  };

  const renderForm = () => {
    return (
      <Fragment>
        <section
          style={{ display: "grid", gridColumn: "center-start / center-end" }}
        >
          <div style={{ backgroundColor: "#fff" }}>
            <div>
              <Tabs>
                <TabPanel>
                  <CreatePostMediaSelector
                    onCaptionChanged={onCaptionChanged}
                    selectedMedias={medias}
                    onMediaSelected={onMediaSelected}
                  />
                </TabPanel>
                <TabPanel>
                  <PostPrice onChange={onPriceSelected} />
                </TabPanel>
                <TabList
                  style={{ borderTop: "1px solid #000", borderBottom: "none" }}
                >
                  <Tab
                    style={{
                      borderBottomLeftRadius: "5px",
                      borderBottomRightRadius: "5px",
                      borderTopLeftRadius: "0px",
                      borderTopRightRadius: "0px",
                      borderTop: "none",
                      borderBottom: "1px solid #000",
                      borderRight: "1px solid #000",
                      borderLeft: "1px solid #000",
                    }}
                  >
                    <Icon icon={"camera-outline"} />
                  </Tab>
                  <Tab
                    style={{
                      borderBottomLeftRadius: "5px",
                      borderBottomRightRadius: "5px",
                      borderTopLeftRadius: "0px",
                      borderTopRightRadius: "0px",
                      borderTop: "none",
                      borderBottom: "1px solid #000",
                      borderRight: "1px solid #000",
                      borderLeft: "1px solid #000",
                    }}
                  >
                    <Icon icon={"wallet-outline"} />
                  </Tab>
                </TabList>
              </Tabs>
            </div>
          </div>
          <div>
            <Button
              bold
              loading={loading}
              blue
              style={{ fontSize: "1.5rem", float: "right", width: 150 }}
              onClick={(e) => onSubmitClicked()}
            >
              Post
            </Button>
          </div>
        </section>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <MobileHeader backArrow>
        <h3 className="heading-3">{currentUser.username}</h3>
        <div></div>
      </MobileHeader>

      <main className="profile-page grid">{renderForm()}</main>
    </Fragment>
  );
};
const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps, null)(NewPostPage);
