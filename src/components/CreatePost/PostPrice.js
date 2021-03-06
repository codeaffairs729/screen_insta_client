import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import FormInput from "../FormInput/FormInput";
import FormTextarea from "../FormTextarea/FormTextarea";
const PostPrice = ({ onChange }) => {
  return (
    <Form style={{ width: "99%" }}>
      <Form.Group>
        <label className="heading-3 font-bold" htmlFor="price">
          Post price
        </label>
        <FormInput
          id="price"
          placeholder="Enter post price..."
          type={"number"}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      </Form.Group>
    </Form>
  );
};

export default PostPrice;
