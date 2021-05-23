import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import FormInput from "../FormInput/FormInput";
import FormTextarea from "../FormTextarea/FormTextarea";
const PostPrice = ({ onChange, price }) => {

  function preventNonNumericalInput(e) {
    console.log("onkeypress");
    e = e || window.event;
    var charCode = typeof e.which == "undefined" ? e.keyCode : e.which;
    var charStr = String.fromCharCode(charCode);
    if (charStr != "." && parseInt(charStr) == NaN) {
      e.preventDefault();
    }
  }

  return (
    <Form style={{ width: "99%" }}>
      <Form.Group>
        <label className="heading-3 font-bold" htmlFor="price">
          Post price
        </label>
        <FormInput
          id="price"
          placeholder="Enter post price..."
          type={"tel"}
          defaultValue={price}
          onKeyPress={preventNonNumericalInput}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      </Form.Group>
    </Form>
  );
};

export default PostPrice;
