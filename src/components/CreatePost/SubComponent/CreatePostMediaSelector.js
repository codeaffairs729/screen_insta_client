import { render } from "@testing-library/react";
import React, { useState, useEffect, useRef } from "react";
import Button from "../../Button/Button";
import Icon from "../../Icon/Icon";
import PostText from "../PostText";

const CreatePostMediaSelector = ({
  onMediaSelected,
  onCaptionChanged,
  selectedMedias,
}) => {
  const initialState = {
    files: selectedMedias,
    postText: "",
  };
  const fileInputRef = useRef();
  const [files, setFiles] = useState(initialState.files);
  const [postText, setPostText] = useState(initialState.postText);
  const videoRefs = React.useRef([]);

  const onFileSelected = (file) => {
    let oldFiles = [...files];
    oldFiles.push(file);
    setFiles(oldFiles);
    fileInputRef.current.value = "";
    //renderPreviews();
    onMediaSelected && onMediaSelected(oldFiles);
    console.log(files);
  };

  const deleteFile = (fileIndex) => {
    let oldFiles = [...files];
    if (fileIndex < 0) {
      alert("An error occurred");
      return;
    }
    if (videoRefs.current[fileIndex]) videoRefs.current[fileIndex].load();
    videoRefs.current.forEach((element) => {
      if (element) element.load();
    });
    oldFiles.splice(fileIndex, 1);
    setFiles(oldFiles);
    onMediaSelected && onMediaSelected(oldFiles);
  };

  const renderPreview = (file, index) => {
    if (file && file.name && file.name.endsWith(".mp4")) {
      return (
        <div className="video-preview" key={index}>
          <span className="preview-close-button">
            <Icon icon={"trash-outline"} />
          </span>
          <video
            onClick={(e) => deleteFile(index)}
            ref={(element) => (videoRefs.current[index] = element)}
            style={{
              marginLeft: 5,
              maxWidth: 120,
              maxHeight: 110,
            }}
          >
            <source src={URL.createObjectURL(file)} type="video/mp4" />
          </video>
        </div>
      );
    } else if (file && file.name && !file.name.endsWith(".mp4")) {
      return (
        <div className="image-preview" key={index}>
          <span className="preview-close-button">
            <Icon icon={"trash-outline"} />
          </span>
          <img
            onClick={(e) => deleteFile(index)}
            style={{
              marginLeft: 5,
              maxWidth: 70,
              maxHeight: 90,
              objectFit: "contain",
            }}
            src={URL.createObjectURL(file)}
          />
        </div>
      );
    }
  };

  return (
    <div>
      <PostText onChange={onCaptionChanged} />
      <input
        style={{ display: "none" }}
        onChange={(e) => onFileSelected(e.target.files[0])}
        ref={fileInputRef}
        type="file"
      />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {files.map((file, index) => {
          return renderPreview(file, index);
        })}

        <Button
          style={{ backgroundColor: "white", marginLeft: 5 }}
          onClick={() => fileInputRef.current.click()}
        >
          <Icon icon={"add-circle-outline"} />
        </Button>
      </div>
    </div>
  );
};

export default CreatePostMediaSelector;
