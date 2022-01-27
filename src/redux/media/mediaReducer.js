import mediaTypes from "./mediaTypes";

export const INITIAL_STATE = {
  uploadFileLoading: false,
  uploadFileError: null,
  uploadedFileUrl: null,
};

const mediaReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case mediaTypes.UPLOAD_FILE_START: {
      return {
        ...state,
        uploadFileLoading: true,
        uploadFileError: null,
        uploadedFileUrl: null,
      };
    }
    case mediaTypes.UPLOAD_FILE_SUCCESS: {
      return {
        ...state,
        uploadFileLoading: false,
        uploadFileError: null,
        uploadedFileUrl: action.payload.secure_url,
      };
    }
    case mediaTypes.UPLOAD_FILE_ERROR: {
      return {
        ...state,
        uploadFileLoading: false,
        uploadFileError: action.payload.error,
        uploadedFileUrl: null,
      };
    }

    default:
      return state;
  }
};

export default mediaReducer;
