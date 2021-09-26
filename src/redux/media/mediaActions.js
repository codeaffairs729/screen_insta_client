import mediaTypes from "./mediaTypes";

import { uploadFile } from "../../services/mediaService";

export const uploadNewFile = (payload, onImageUploaded) => async (dispatch) => {
  dispatch({ type: mediaTypes.UPLOAD_FILE_STARTED });
  try {
    let response = await uploadFile(payload);
    if (response && response.secure_url) {
      dispatch({
        type: mediaTypes.UPLOAD_FILE_FINISHED,
        payload: {
          secure_url: response.secure_url,
        },
      });
      if (onImageUploaded) {
        onImageUploaded(response.secure_url);
      }
    }
    return;
  } catch (err) {
    console.error("Error while sending message");
    console.error(err);
  }
  dispatch({
    type: mediaTypes.UPLOAD_FILE_ERROR,
    payload: {
      error: "An Error occurred while uploading file",
    },
  });
};
