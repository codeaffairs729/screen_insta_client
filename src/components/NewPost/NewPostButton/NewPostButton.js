import React, { useState, Fragment, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import { showModal, hideModal } from '../../../redux/modal/modalActions';

import Icon from '../../Icon/Icon';

const NewPostButton = ({ onClick, showModal, hideModal, plusIcon, children, style }) => {
  const [file, setFile] = useState(undefined);
  const fileInputRef = useRef();
  const history = useHistory();

  useEffect(() => {
    
  }, [])

  useEffect(() => {
      
     
  }, [file, showModal, hideModal, history]);
  return <Fragment></Fragment>;
};
/*
 <label
        style={{ cursor: "pointer", ...style }}
        className="icon"
        htmlFor="file-upload"
      >
        {children ? (
          children
        ) : (
          <Icon icon={plusIcon ? "add-circle-outline" : "camera-outline"} />
        )}
      </label>
<input
        id="file-upload"
        type="file"
        style={{ display: 'none' }}
        accept="image/*"
        // Get the first selected file
        onChange={(event) => setFile(event.target.files[0])}
        ref={fileInputRef}
      />
*/ 

const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
  hideModal: (component) => dispatch(hideModal(component)),
});

export default connect(null, mapDispatchToProps)(NewPostButton);
