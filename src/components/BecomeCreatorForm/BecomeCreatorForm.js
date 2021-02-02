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

import Avatar from "../Avatar/Avatar";
import FormInput from "../FormInput/FormInput";
import FormTextarea from "../FormTextarea/FormTextarea";
import Button from "../Button/Button";
import SettingsForm from "../SettingsForm/SettingsForm";
import SettingsFormGroup from "../SettingsForm/SettingsFormGroup/SettingsFormGroup";
import ChangeAvatarButton from "../ChangeAvatarButton/ChangeAvatarButton";
import { useHistory } from "react-router-dom";

const BecomeCreatorForm = ({
  currentUser,
  showAlert,
  updateCreatorStart,
  updatingProfile,
}) => {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const validate = (values) => {
    const errors = {};
    if (values.bankInformation) {
      const bankInfoError = validateBankInformation(values.bankInformation);
      if (bankInfoError) errors.bankInformation = bankInfoError;
    }
    if (values.followPrice) {
      if (values.followPrice < 5 && values.followPrice > 0) {
        errors.followPrice = "Follow price must be greater than 5$ or 0";
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
    console.log("getting multi select value from data");
    console.log(data);
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
      const updateRes = await updateCreatorStart(values);
    },
  });

  useEffect(() => {
    document.title = "Become creator • Between Us";
    console.log("useEffect " + currentUser.blockedCountries);
    setInitialBlockedCountriesValues(currentUser.blockedCountries);
  }, []);

  return (
    <SettingsForm onSubmit={formik.handleSubmit}>
      <SettingsFormGroup>
        <div style={{ display: "grid" }}>
          <label className="heading-3 font-bold">Follow Price</label>
          <label>0 = free</label>
        </div>

        <FormInput
          name="followPrice"
          type="number"
          fieldProps={formik.getFieldProps("followPrice")}
        />
      </SettingsFormGroup>

      {!currentUser.isCreator ? (
        <SettingsFormGroup>
          <label className="heading-3 font-bold">Country of residence</label>
          <select name="country" value={formik.values.country}>
            {populateCountryList()}
          </select>
        </SettingsFormGroup>
      ) : null}

      {!currentUser.isCreator ? (
        <SettingsFormGroup>
          <div style={{ display: "grid" }}>
            <label className="heading-3 font-bold">Referrer</label>
            <label>Username of your referrer</label>
          </div>
          <FormInput
            name="referrerUserHandle"
            fieldProps={formik.getFieldProps("referrerUserHandle")}
          />
        </SettingsFormGroup>
      ) : null}

      <SettingsFormGroup>
        <div style={{ display: "grid" }}>
          <label className="heading-3 font-bold">Bank infos</label>
          <label></label>
        </div>
        <FormInput
          name="bankInformation"
          fieldProps={formik.getFieldProps("bankInformation")}
        />
      </SettingsFormGroup>

      <SettingsFormGroup>
        <div style={{ display: "grid" }}>
          <label className="heading-3 font-bold">Voice call price</label>
          <label>0 = disabled</label>
        </div>

        <FormInput
          name="audioCallPrice"
          type="number"
          fieldProps={formik.getFieldProps("audioCallPrice")}
        />
      </SettingsFormGroup>

      <SettingsFormGroup>
        <div style={{ display: "grid" }}>
          <label className="heading-3 font-bold">Video call price</label>
          <label>0 = disabled</label>
        </div>

        <FormInput
          name="videoCallPrice"
          type="number"
          fieldProps={formik.getFieldProps("videoCallPrice")}
        />
      </SettingsFormGroup>

      <SettingsFormGroup>
        <div style={{ display: "grid" }}>
          <label className="heading-3 font-bold">Blocked countries</label>
          <label>Select the countries than cannot view your content</label>
        </div>

        <Select
          isMulti
          closeMenuOnSelect={false}
          options={populateCountryOptions()}
          value={selectedCountries}
          onChange={onBlockedCountrySelected}
        />
      </SettingsFormGroup>

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
});

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  updatingCreatorProfile: selectUpdatingCreatorProfile,
});

export default connect(mapStateToProps, mapDispatchToProps)(BecomeCreatorForm);
