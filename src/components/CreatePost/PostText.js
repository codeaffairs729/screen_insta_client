import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import FormTextarea from "../FormTextarea/FormTextarea";
const PostText = ({ onChange }) => {
  return (
    <Form>
      <Form.Group>
        <FormTextarea
          style={{  marginLeft: 5, marginTop: 5, width: "99%"}}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder="What's on your mind"
        />
      </Form.Group>
    </Form>
  );
};

export default PostText;
