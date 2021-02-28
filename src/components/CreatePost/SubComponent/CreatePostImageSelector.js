import React, { useState, useEffect, useRef } from "react";
import Button from "../../Button/Button";
import Icon from "../../Icon/Icon";
import PostText from "../PostText";

const CreatePostImageSelector = () => {
  const initialState = {
    files: [],
    postText: "",
  };
  const fileInputRef = useRef();
  const [files, setFiles] = useState(initialState.files);
  const [postText, setPostText] = useState(initialState.postText);
  const [previews, setPreviews] = useState(null);

  const onFileSelected = (file) => {
    let oldFiles = files;
    oldFiles.push(file);
    setFiles(oldFiles);
    fileInputRef.current.value = "";
    console.log("files are : ");
    console.log(files);
    renderPreviews();
  };

  const renderPreviews = () => {
    console.log("Rendering preview for " + files.length + " images");
    let previews = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      previews.push(
        <div style={{ display: "flex", flexDirection: "column" }}>
          <img
            style={{ maxWidth: 70, maxHeight: 70, objectFit: "contain" }}
            src={URL.createObjectURL(file)}
          />
        </div>
      );
    }
    setPreviews(previews);
  };

  return (
    <div>
      <PostText />
      <input
        style={{ display: "none" }}
        onChange={(e) => onFileSelected(e.target.files[0])}
        ref={fileInputRef}
        type="file"
      />
      <div style={{ display: "flex" }}>
        {previews}
        <Button
          style={{ backgroundColor: "white" }}
          onClick={() => fileInputRef.current.click()}
        >
          <Icon icon={"add-outline"} />
        </Button>
      </div>
    </div>
  );
};

export default CreatePostImageSelector;
