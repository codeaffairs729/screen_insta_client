import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTransition, animated } from "react-spring";
import classNames from "classnames";
import Button from "../Button/Button";
import FormInput from "../FormInput/FormInput";
import SettingsForm from "../SettingsForm/SettingsForm";
import SettingsFormGroup from "../SettingsForm/SettingsFormGroup/SettingsFormGroup";
import TextButton from "../Button/TextButton/TextButton";
import { Field, useFormik } from "formik";

const BankInformationDialog = ({
  hide,
  options,
  children,
  title,
  cancelButton = true,
  onFormFinished,
  bankInformation,
}) => {
  const transitions = useTransition(true, null, {
    from: { transform: "scale(1.2)", opacity: 0.5 },
    enter: { transform: "scale(1)", opacity: 1 },
    leave: { opacity: 0 },
    config: {
      mass: 1,
      tension: 500,
      friction: 30,
    },
  });

  const validate = (values) => {
    const errors = {};
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      fullName: bankInformation?.fullName ?? "",
      iban: bankInformation?.iban ?? "",
      swift: bankInformation?.swift ?? "",
      bankName: bankInformation?.bankName ?? "",
      country: bankInformation?.country ?? "",
      address: bankInformation?.address ?? "",
    },
    validate,
    onSubmit: (values) => {
      console.log(values);
      onFormFinished(values);
      hide();
      //const updateRes = await updateCreatorStart(values);
    },
  });

  const renderForm = () => {
    return (
      <div
        style={{
          overflow: "auto",
          maxHeight: 300,
          marginTop: 5,
          marginBottom: 5,
        }}
      >
        <SettingsForm onSubmit={formik.handleSubmit}>
          <SettingsFormGroup>
            <div style={{ display: "grid" }}>
              <label className="heading-3 font-bold">Full name</label>
            </div>

            <FormInput
              fieldProps={formik.getFieldProps("fullName")}
              name="fullName"
            />
          </SettingsFormGroup>

          <SettingsFormGroup>
            <div style={{ display: "grid" }}>
              <label className="heading-3 font-bold">IBAN</label>
            </div>

            <FormInput fieldProps={formik.getFieldProps("iban")} name="iban" />
          </SettingsFormGroup>

          <SettingsFormGroup>
            <div style={{ display: "grid" }}>
              <label className="heading-3 font-bold">BIC (SWIFT)</label>
            </div>

            <FormInput
              fieldProps={formik.getFieldProps("swift")}
              name="swift"
            />
          </SettingsFormGroup>

          <SettingsFormGroup>
            <div style={{ display: "grid" }}>
              <label className="heading-3 font-bold">Bank name</label>
            </div>

            <FormInput
              fieldProps={formik.getFieldProps("bankName")}
              name="bankName"
            />
          </SettingsFormGroup>

          <SettingsFormGroup>
            <div style={{ display: "grid" }}>
              <label className="heading-3 font-bold">Country</label>
            </div>

            <FormInput
              fieldProps={formik.getFieldProps("country")}
              name="country"
            />
          </SettingsFormGroup>

          <SettingsFormGroup>
            <div style={{ display: "grid" }}>
              <label className="heading-3 font-bold">Address</label>
            </div>

            <FormInput
              fieldProps={formik.getFieldProps("address")}
              name="address"
            />
          </SettingsFormGroup>
        </SettingsForm>
      </div>
    );
  };

  const [value, setValue] = useState("");
  return transitions.map(({ item, key, props }) => (
    <animated.div style={props} key={key} className="options-bank-information">
      {title && (
        <header className="options-dialog__title">
          <h1 className="heading-3">{title}</h1>
          {!cancelButton && (
            <TextButton style={{ fontSize: "3rem" }} onClick={() => hide()}>
              &#10005;
            </TextButton>
          )}
        </header>
      )}
      {renderForm()}

      <div>
        {cancelButton && (
          <button
            className="options-dialog__button"
            onClick={(event) => {
              event.nativeEvent.stopImmediatePropagation();
              hide();
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="options-bank-information__button"
          onClick={async () => {
            console.log("On Click");
            await formik.submitForm();
          }}
        >
          Change
        </button>
      </div>
    </animated.div>
  ));
};

BankInformationDialog.propTypes = {
  hide: PropTypes.func.isRequired,
};

export default BankInformationDialog;
