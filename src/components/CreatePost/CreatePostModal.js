import React, { useState, useEffect } from "react";

import MobileHeader from "../Header/MobileHeader/MobileHeader";
import TextButton from "../Button/TextButton/TextButton";
import Icon from "../Icon/Icon";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CreatePostMediaSelector from "./SubComponent/CreatePostMediaSelector";
import { showAlert } from "../../redux/alert/alertActions";
import { createPost } from '../../services/postService';
import { connect } from "react-redux";
import { addPost } from "../../redux/feed/feedActions";
import PostPrice from "./PostPrice";
import Button from "../Button/Button";

const CreatePostModal = ({ hide, showAlert, addPost}) => {
  const [medias, setMedias] = useState([]);
  const [price, setPrice] = useState(0);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const onMediaSelected = (selectedMedias) => {
    setMedias(selectedMedias);
  }

  const onPriceSelected = (selectedPrice) => {
    setPrice(selectedPrice);
  }

  const onCaptionChanged = (text) => {
    setCaption(text);
  }

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
      setLoading(false)
      hide();
      window.location.reload();
    } catch (e) {
      console.error(e);
      setLoading(false);
      showAlert(e.message);
    }
    
  }
  
  return (
    <section
      style={{ display: "grid", gridColumn: "center-start / center-end" }}
    >
      <MobileHeader show>
        <Icon
          icon="close-outline"
          onClick={() => hide()}
          style={{ cursor: "pointer" }}
        />
        <h3 className="heading-3">New Post</h3>
        <Button
          bold
          loading={loading}
          blue
          style={{ fontSize: "1.5rem" }}
          onClick ={(e) => onSubmitClicked()}
        >
          Post
        </Button>
      </MobileHeader>
      <div style={{ backgroundColor: "#fff" }}>
        <div>
          <Tabs>
            <TabPanel>
              <CreatePostMediaSelector onCaptionChanged={onCaptionChanged} selectedMedias={medias} onMediaSelected={onMediaSelected} />
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
    </section>
  );
};

const mapDispatchToProps = (dispatch) => ({
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
  addPost: (post) => dispatch(addPost(post)),
});


export default connect(null, mapDispatchToProps)(CreatePostModal);
