import mimeTypes from "mime-types";

export const validAudioFiles = ["audio/mpeg"];
export const validImageFiles = ["image/png", "image/jpeg", "image/gif"];
export const validVideoFiles = ["video/mp4"];

export const isVideo = (link) => {
  try {
    const extension = link.split(".")[link.split(".").length - 1];
    let mimeType = mimeTypes.contentType(extension);
    if (mimeType) {
      mimeType = mimeType.toLowerCase();
      if (validVideoFiles.indexOf(mimeType) !== -1) {
        return true;
      } else {
        return false;
      }
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const isAudio = (link) => {
  try {
    const extension = link.split(".")[link.split(".").length - 1];
    let mimeType = mimeTypes.contentType(extension);
    if (mimeType) {
      mimeType = mimeType.toLowerCase();
      if (validAudioFiles.indexOf(mimeType) !== -1) {
        return true;
      } else {
        return false;
      }
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};
