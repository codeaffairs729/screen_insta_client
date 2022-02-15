import axios from "axios";
import firebase from "../firebase";

export const uploadFile = async (formData) => {
  try {
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.post(`/api/media/file`, formData, {
      headers: {
        authorization: token,
      },
      onUploadProgress: progressEvent => console.log("progress", progressEvent.loaded)
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};
