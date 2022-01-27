import mediaTypes from "./mediaTypes";

import { uploadFile } from "../../services/mediaService";

export const uploadNewFile = (file, onUploadDone) => async (dispatch) => {
  dispatch({ type: mediaTypes.UPLOAD_FILE_START });
  try {
    let response = await uploadFile(file);
    if (response && response.secure_url) {
      dispatch({
        type: mediaTypes.UPLOAD_FILE_SUCCESS,
        payload: {
          secure_url: response.secure_url,
        },
      });
      onUploadDone(response.secure_url);
    }

  } catch (err) {
    console.error("Error while sending message");
    console.error(err);
    dispatch({
      type: mediaTypes.UPLOAD_FILE_ERROR,
      payload: {
        error: "An Error occurred while uploading file",
      },
    });
  }

};
