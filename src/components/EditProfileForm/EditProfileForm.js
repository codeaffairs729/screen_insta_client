import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useFormik } from "formik";
import { createStructuredSelector } from "reselect";

import {
  selectCurrentUser,
  selectToken,
  selectUpdatingProfile,
} from "../../redux/user/userSelectors";
import { updateProfileStart } from "../../redux/user/userActions";
import { showAlert } from "../../redux/alert/alertActions";
import firebase from "../../firebase";

import {
  validateEmail,
  validateFullName,
  validateUsername,
  validateBio,
  validateWebsite,
} from "../../utils/validation";

import Avatar from "../Avatar/Avatar";
import FormInput from "../FormInput/FormInput";
import FormTextarea from "../FormTextarea/FormTextarea";
import Button from "../Button/Button";
import SettingsForm from "../SettingsForm/SettingsForm";
import SettingsFormGroup from "../SettingsForm/SettingsFormGroup/SettingsFormGroup";
import ChangeAvatarButton from "../ChangeAvatarButton/ChangeAvatarButton";
import { useHistory } from "react-router-dom";

const EditProfileForm = ({
  currentUser,
  showAlert,
  updateProfileStart,
  updatingProfile,
}) => {
  const uid = firebase.auth().currentUser.uid;

  const emailVerified = firebase.auth().currentUser.emailVerified;

  const validate = (values) => {
    const errors = {};
    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;

    const fullNameError = validateFullName(values.fullName);
    if (fullNameError) errors.fullName = fullNameError;

    const usernameError = validateUsername(values.username);
    if (usernameError) errors.username = usernameError;

    const bioError = validateBio(values.bio);
    if (bioError) errors.bio = bioError;

    const websiteError = validateWebsite(values.website);
    if (websiteError) errors.website = websiteError;

    if (values.acceptedTerms === false) {
      errors.acceptedTerms = "Please accept the terms and conditions";
    }
    return errors;
  };
  let currentUserUsername = "";
  if (
    currentUser &&
    currentUser.username &&
    currentUser.username.toLowerCase() != uid.toLowerCase()
  ) {
    currentUserUsername = currentUser.username;
  }

  let history = useHistory();
  const formik = useFormik({
    initialValues: {
      email: currentUser.email,
      fullName: currentUser.fullName,
      username: currentUserUsername,
      bio: currentUser.bio || "",
      website: currentUser.website || "",
      acceptedTerms: currentUser.acceptedTerms || false,
    },
    validate,
    onSubmit: async (values) => {
      const updateRes = await updateProfileStart(values);
    },
  });

  useEffect(() => {
    document.title = "Edit Profile • Between Us";
  });

  const resendEmail = async () => {
    await firebase.auth().currentUser.sendEmailVerification();
  };

  return (
    <SettingsForm onSubmit={formik.handleSubmit}>
      {!emailVerified ? (
        <SettingsFormGroup>
          <div></div>
          <div style={{ lineHeight: "2.2rem" }}>
            <h4 className="heading-4 font-medium">
              Please verify your email address before you continue and refresh
              this page.{" "}
              <a onClick={resendEmail} href="#">
                Did not receive an email ?
              </a>
            </h4>
          </div>
        </SettingsFormGroup>
      ) : null}
      <SettingsFormGroup>
        <ChangeAvatarButton>
          <Avatar
            className="avatar--small"
            imageSrc={currentUser.avatar}
            style={{ alignSelf: "start" }}
          />
        </ChangeAvatarButton>
        <div style={{ lineHeight: "2.2rem" }}>
          <h3 className="heading-2 font-medium">{formik.values.username}</h3>
          <ChangeAvatarButton />
        </div>
      </SettingsFormGroup>
      <SettingsFormGroup>
        <label className="heading-3 font-bold">Full name</label>
        <FormInput
          name="fullName"
          fieldProps={formik.getFieldProps("fullName")}
        />
      </SettingsFormGroup>
      <SettingsFormGroup>
        <label className="heading-3 font-bold">Username (handle)</label>
        <FormInput
          name="username"
          fieldProps={formik.getFieldProps("username")}
        />
      </SettingsFormGroup>
      <SettingsFormGroup>
        <label className="heading-3 font-bold">Website</label>
        <FormInput
          name="website"
          fieldProps={formik.getFieldProps("website")}
        />
      </SettingsFormGroup>
      <SettingsFormGroup>
        <label className="heading-3 font-bold">Bio</label>
        <FormTextarea name="bio" fieldProps={formik.getFieldProps("bio")} />
      </SettingsFormGroup>
      <SettingsFormGroup>
        <label className="heading-3 font-bold">Email</label>
        <FormInput
          name="email"
          fieldProps={formik.getFieldProps("email")}
          disabled
        />
      </SettingsFormGroup>
      {!currentUser.acceptedTerms ? (
        <SettingsFormGroup>
          <label className="heading-3 font-bold"></label>
          <div style={{ display: "flex" }}>
            <FormInput
              name="acceptedTerms"
              type={"checkbox"}
              fieldProps={formik.getFieldProps("acceptedTerms")}
            />
            <p style={{ marginLeft: 10 }}>
              By checking this box I certify that I am more than 18 years old
              and accept the{" "}
              <a href="/terms" target="blank">
                terms and conditions
              </a>
            </p>
          </div>
        </SettingsFormGroup>
      ) : null}

      <SettingsFormGroup>
        <label></label>
        <Button
          style={{ width: "10rem" }}
          disabled={Object.keys(formik.touched).length === 0}
          loading={updatingProfile}
          onClick={() => {
            if (!formik.isValid) {
              showAlert(Object.values(formik.errors)[0]);
            }
          }}
        >
          Submit
        </Button>
      </SettingsFormGroup>
    </SettingsForm>
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateProfileStart: (updates) => dispatch(updateProfileStart(updates)),
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
});

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  updatingProfile: selectUpdatingProfile,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileForm);
