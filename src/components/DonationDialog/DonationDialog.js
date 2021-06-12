import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTransition, animated } from "react-spring";
import classNames from "classnames";
import FormInput from "../FormInput/FormInput";

import TextButton from "../Button/TextButton/TextButton";

const DonationDialog = ({
  hide,
  options,
  children,
  title,
  cancelButton = true,
  sendTip,
}) => {
  const [tipAmount, setTipAmount] = useState(0);
  const [tipMessage, setTipMessage] = useState("");
  const [tipAmountError, setTipAmountError] = useState(null);
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
  function preventNonNumericalInput(e) {
    console.log("onkeypress");
    e = e || window.event;
    var charCode = typeof e.which == "undefined" ? e.keyCode : e.which;
    var charStr = String.fromCharCode(charCode);
    if (charStr == ".") {
      return;
    }
    if (isNaN(parseInt(charStr))) {
      e.preventDefault();
    }
  }

  return transitions.map(({ item, key, props }) => (
    <animated.div style={props} key={key} className="options-dialog">
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
      {children}
      {
        <div style={{ marginTop: 10 }}>
          <FormInput
            id="tipAmount"
            placeholder="Enter tip amount"
            type={"tel"}
            onKeyPress={preventNonNumericalInput}
            onChange={(e) => setTipAmount(e.target.value)}
            autocomplete="off"
          />
          {tipAmountError ? <h3 style={{color: "red"}}>{tipAmountError}</h3>: null}
          <FormInput
            style={{marginTop: 10}}
            id="tipMessage"
            placeholder="Enter message"
            onChange={(e) => setTipMessage(e.target.value)}
          />
        </div>
      }
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
        className="options-dialog__button"
        onClick={(event) => {
          if (parseFloat(tipAmount) >= 5) {
            sendTip(tipAmount, tipMessage);
            hide();
          }
          else {
            setTipAmountError("The tip amount must be at least 5$");
          }
        }}
      >
        Send
      </button>
    </animated.div>
  ));
};

DonationDialog.propTypes = {
  hide: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};

export default DonationDialog;
