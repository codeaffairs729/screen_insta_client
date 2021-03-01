import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Field, useFormik } from "formik";
import { createStructuredSelector } from "reselect";
import miscData from "./../../countries";
import {
  selectCurrentUser,
  selectToken,
  selectUpdatingCreatorProfile,
  selectUpdatingProfile,
} from "../../redux/user/userSelectors";
import { updateCreatorStart } from "../../redux/user/userActions";
import { showAlert } from "../../redux/alert/alertActions";
import firebase from "../../firebase";
import Select from "react-select";
import { validateBankInformation } from "../../utils/validation";
import FormInput from "../FormInput/FormInput";
import FormTextarea from "../FormTextarea/FormTextarea";
import Button from "../Button/Button";
import SettingsForm from "../SettingsForm/SettingsForm";
import SettingsFormGroup from "../SettingsForm/SettingsFormGroup/SettingsFormGroup";
import { useHistory } from "react-router-dom";
import { showModal } from "../../redux/modal/modalActions";

const BecomeCreatorForm = ({
  currentUser,
  showAlert,
  updateCreatorStart,
  updatingProfile,
  showModal,
}) => {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [voiceCallActivated, setVoiceCallActivated] = useState(false);
  const [videoCallActivated, setVideoCallActivated] = useState(false);
  const [bankInformation, setBankInformation] = useState(null);
  const validate = (values) => {
    const errors = {};
    if (values.bankInformation) {
      const bankInfoError = validateBankInformation(values.bankInformation);
      if (bankInfoError) errors.bankInformation = bankInfoError;
    }
    if (values.followPrice) {
      if (values.followPrice < 4.99) {
        errors.followPrice = "Follow price must be greater than 4.99$ or 0";
      }
    }
    if (values.audioCallPrice) {
      if (values.audioCallPrice < 1) {
        errors.audioCallPrice = "Voice call price is not valid";
      }
      if (voiceCallActivated) {
        if (values.audioCallPrice < 1) {
          errors.audioCallPrice = "The minimum price for voice calls is 1$";
        }
      }
    }
    if (values.videoCallPrice) {
      if (values.videoCallPrice < 0) {
        errors.videoCallPrice = "Video call price is not valid";
      }
      if (videoCallActivated) {
        if (values.videoCallPrice < 1) {
          errors.videoCallPrice = "The minimum price for video calls is 1$";
        }
      }
    }
    return errors;
  };

  const populateCountryList = () => {
    let countryOptions = [];
    for (let i in miscData.countries) {
      const country = miscData.countries[i];
      countryOptions.push(<option value={country.name}>{country.name}</option>);
    }
    return countryOptions;
  };

  const populateCountryOptions = () => {
    let countryOptions = [];
    for (let i in miscData.countries) {
      const country = miscData.countries[i];
      countryOptions.push({ value: country.name, label: country.name });
    }
    return countryOptions;
  };

  const setInitialBlockedCountriesValues = (data) => {
    if (!data) {
      return;
    }
    let values = [];
    for (let i in data) {
      const country = data[i];
      values.push({ label: country, value: country });
    }
    setSelectedCountries(values);
  };

  const onBlockedCountrySelected = (blockedCountries) => {
    let countries = [];
    console.log(blockedCountries);
    setSelectedCountries(blockedCountries);
    for (let i in blockedCountries) {
      countries.push(blockedCountries[i].value);
    }
    console.log("countries : " + JSON.stringify(countries));
    formik.values.blockedCountries = countries;
  };

  let history = useHistory();

  const formik = useFormik({
    initialValues: {
      followPrice: currentUser.followPrice ? currentUser.followPrice : 0,
      country: currentUser.country ? currentUser.country : null,
      referrerUserHandle: currentUser.referrer ? currentUser.referrer : null,
      bankInformation: currentUser.bankInformation
        ? currentUser.bankInformation
        : "",
      audioCallPrice: currentUser.audioCallPrice
        ? currentUser.audioCallPrice
        : 0,
      videoCallPrice: currentUser.videoCallPrice
        ? currentUser.videoCallPrice
        : 0,
      blockedCountries: currentUser.blockedCountries,
    },

    validate,
    onSubmit: async (values) => {
      if (!voiceCallActivated) {
        values.audioCallPrice = 0;
      }
      if (!videoCallActivated) {
        values.videoCallPrice = 0;
      }
      if (bankInformation) {
        values.bankInformation = bankInformation;
      }
      console.log(values);
      const updateRes = await updateCreatorStart(values);
    },
  });

  useEffect(() => {
    document.title = "Become a creator • Between Us";
    setInitialBlockedCountriesValues(currentUser.blockedCountries);
    if (currentUser) {
      console.log("setting activated");
      if (currentUser.audioCallPrice > 0) {
        console.log("activating audio calls");
        setVoiceCallActivated(true);
      }
      if (currentUser.videoCallPrice > 0) {
        setVideoCallActivated(true);
      }
      if (currentUser) {
        setBankInformation(currentUser.bankInformation);
      }
    }
  }, []);

  const onClickModal = () => {
    return showModal(
      {
        title: "Complete the form below",
        bankInformation: bankInformation,
        onFormFinished: (values) => {
          setBankInformation(values);
          console.log("form finished with values");
          console.log(values);
        },
      },
      "BankInformationDialog/BankInformationDialog"
    );
  };

  return (
    <SettingsForm onSubmit={formik.handleSubmit}>
      <div style={{ display: "flex", justifyContent: "start" }}>
        <div style={{ display: "grid", width: 200 }}>
          <label className="heading-3 font-bold">Subscription price</label>
          <label>Subscription can be free or minimum 4.99$ a month</label>
        </div>

        <FormInput
          name="followPrice"
          type="number"
          step="any"
          min="0"
          fieldProps={formik.getFieldProps("followPrice")}
        />
      </div>

      {!currentUser.isCreator ? (
        <div style={{ display: "flex", justifyContent: "start" }}>
          <div style={{ display: "grid", width: 200 }}>
            <label className="heading-3 font-bold">Country of residence</label>
            <label>
              This information will not be shared and is asked only for taxes
              purposes.
            </label>
          </div>

          <select name="country" value={formik.values.country}>
            {populateCountryList()}
          </select>
        </div>
      ) : null}

      {!currentUser.isCreator ? (
        <div style={{ display: "flex", justifyContent: "start" }}>
          <div style={{ display: "grid", width: 200 }}>
            <label className="heading-3 font-bold">Referrer</label>
            <label>Username of your referrer</label>
          </div>
          <FormInput
            name="referrerUserHandle"
            fieldProps={formik.getFieldProps("referrerUserHandle")}
          />
        </div>
      ) : null}

      <div style={{ display: "flex", justifyContent: "start" }}>
        <div style={{ display: "grid", width: 200 }}>
          <label className="heading-3 font-bold">Bank infos</label>
          <label></label>
        </div>
        <div className="form-group">
          <a className="form-group" href="#" onClick={onClickModal}>
            Add your bank details to receive money from your subscribers
          </a>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "start" }}>
        <div style={{ display: "grid", width: 200 }}>
          <label className="heading-3 font-bold">Voice call price</label>
          <label>Price per minute (minimum 1$/min)</label>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ marginRight: 2 }} htmlFor="voiceCallPrice">
              Enable
            </label>
            <input
              id="voiceCallPrice"
              type="checkbox"
              checked={voiceCallActivated}
              onClick={() => setVoiceCallActivated(!voiceCallActivated)}
            />
          </div>

          <FormInput
            name="audioCallPrice"
            type="number"
            step="any"
            min="0"
            disabled={!voiceCallActivated}
            fieldProps={formik.getFieldProps("audioCallPrice")}
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "start" }}>
        <div style={{ display: "grid", width: 200 }}>
          <label className="heading-3 font-bold">Video call price</label>
          <label>Price per minute (minimum 1$/min)</label>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ marginRight: 2 }} htmlFor="videoCallPrice">
              Enable
            </label>
            <input
              id="videoCallPrice"
              type="checkbox"
              checked={videoCallActivated}
              onClick={() => setVideoCallActivated(!videoCallActivated)}
            />
          </div>

          <FormInput
            name="videoCallPrice"
            type="number"
            step="any"
            min="0"
            disabled={!videoCallActivated}
            fieldProps={formik.getFieldProps("videoCallPrice")}
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "start" }}>
        <div style={{ display: "grid", width: 200 }}>
          <label className="heading-3 font-bold">Blocked countries</label>
          <label>
            The users connecting from a blocked country won’t be able to find or
            see your profile
          </label>
        </div>

        <div style={{ minWidth: 150 }}>
          <Select
            isMulti
            closeMenuOnSelect={false}
            options={populateCountryOptions()}
            value={selectedCountries}
            onChange={onBlockedCountrySelected}
          />
        </div>
      </div>

      <>
        <label></label>
        <Button
          style={{ width: "10rem" }}
          loading={updatingProfile}
          onClick={() => {
            if (!formik.isValid) {
              showAlert(Object.values(formik.errors)[0]);
            }
          }}
        >
          Submit
        </Button>
      </>
    </SettingsForm>
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateCreatorStart: (updates) => dispatch(updateCreatorStart(updates)),
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
  showModal: (props, component) => dispatch(showModal(props, component)),
});

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  updatingCreatorProfile: selectUpdatingCreatorProfile,
});

export default connect(mapStateToProps, mapDispatchToProps)(BecomeCreatorForm);
