import mimeTypes from "mime-types";

export const validAudioFiles = [
  "audio/mpeg",
  "audio/wav",
  "audio/webm",
  "audio/ogg",
];
export const validImageFiles = ["image/png", "image/jpeg", "image/gif"];
export const validVideoFiles = [
  "video/mp4",
  "video/MP2T",
  "video/3gpp",
  "video/webm",
  "video/quicktime",
];

export const isVideo = (link) => {
  try {
    const extension = link.split(".")[link.split(".").length - 1];
    let mimeType = mimeTypes.contentType(extension);
    if (mimeType) {
      mimeType = mimeType.toLowerCase();
      if (validAudioFiles.indexOf(mimeType) !== -1) {
        return true;
      } else if (validVideoFiles.indexOf(mimeType) !== -1) {
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
