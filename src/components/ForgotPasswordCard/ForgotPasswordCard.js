import React, { Fragment } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { showAlert } from "../../redux/alert/alertActions";

import { selectError, selectFetching } from "../../redux/user/userSelectors";

import { validateEmail } from "../../utils/validation";

import Button from "../Button/Button";
import TextButton from "../Button/TextButton/TextButton";
import Divider from "../Divider/Divider";
import Card from "../Card/Card";
import FormInput from "../FormInput/FormInput";
import firebase from "./../../firebase";

const ForgotPasswordCard = ({ showAlert, error, fetching }) => {
  const validate = (values) => {
    const errors = {};
    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate,
    onSubmit: (values) => {
      console.log("submit " + JSON.stringify(values));
      firebase
        .auth()
        .sendPasswordResetEmail(values.email)
        .then(() => {
          console.log("email sent");
          showAlert("An email has been sent to the address");
        })
        .catch((err) => {
          console.log("error sending password reset email");
          console.error(err);
        });
    },
  });

  return (
    <Fragment>
      <Card className="form-card">
        <h1 className="heading-logo text-center">BetweenUs</h1>
        <h2
          style={{ fontSize: "1.7rem" }}
          className="heading-2 color-grey text-center"
        >
          Please enter your email address
        </h2>
        <form className="form-card__form" onSubmit={formik.handleSubmit}>
          <FormInput
            name="email"
            fieldProps={formik.getFieldProps("email")}
            valid={formik.touched.email && !formik.errors.email}
            placeholder="Email address"
          />

          <Button
            loading={fetching}
            disabled={
              Object.keys(formik.touched).length === 0 ? true : !formik.isValid
            }
          >
            Send
          </Button>
          <p></p>
        </form>
        <p className="error">
          {error
            ? error
            : formik.submitCount > 0 && Object.values(formik.errors)[0]}
        </p>
        <p className="heading-5 color-grey">
          You will receive a password reset email. Follow the instructions to
          reset your password
        </p>
      </Card>
      <Card>
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <h4 style={{ marginRight: "5px" }} className="heading-4 font-thin">
            Have an account?
          </h4>
          <Link to="/login">
            <TextButton medium blue bold>
              Log in
            </TextButton>
          </Link>
        </section>
      </Card>
    </Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  fetching: selectFetching,
});

const mapDispatchToProps = (dispatch) => ({
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordCard);
