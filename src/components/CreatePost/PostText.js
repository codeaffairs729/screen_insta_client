import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
const PostText = () => {
  return (
    <Form>
      <Form.Group>
        <Form.Control as="textarea" placeholder="What's on your mind" />
      </Form.Group>
    </Form>
  );
};

export default PostText;
