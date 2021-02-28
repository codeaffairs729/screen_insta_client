import React, { useState, useEffect } from "react";

import { getPostFilters } from "../../services/postService";

import MobileHeader from "../Header/MobileHeader/MobileHeader";
import TextButton from "../Button/TextButton/TextButton";
import Icon from "../Icon/Icon";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CreatePostImageSelector from "./SubComponent/CreatePostImageSelector";

const CreatePostModal = ({ hide }) => {
  const [previewImage, setPreviewImage] = useState({
    src: null,
    crop: {},
    filter: null,
    filterName: "",
  });
  const [activeSection, setActiveSection] = useState("filter");
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    (async function () {
      try {
        const response = await getPostFilters();
        setFilters(response.filters);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

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
        <TextButton
          bold
          blue
          style={{ fontSize: "1.5rem" }}
          onClick={() => setActiveSection("details")}
        >
          Next
        </TextButton>
      </MobileHeader>
      <div style={{ backgroundColor: "#fff" }}>
        <div>
          <Tabs>
            <TabPanel>
              <CreatePostImageSelector />
            </TabPanel>
            <TabPanel>
              <h2>Any content 2</h2>
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
                <Icon icon={"videocam-outline"} />
              </Tab>
            </TabList>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default CreatePostModal;
