import React from "react";
import classNames from "classnames";

import Icon from "../Icon/Icon";

const SocialAuthLoginButton = ({ button, style, onClick, provider, name }) => {
  const icon = "logo-" + provider;
  let backgroundColor = "#3B5998";
  if (provider === "twitter") backgroundColor = "#55ACEE";
  if (provider === "google") backgroundColor = "#dd4b39";
  return (
    <a
      onClick={onClick}
      className={classNames({ "social-auth-login-button": true, button })}
      href="#"
      style={{ backgroundColor: backgroundColor }}
    >
      <Icon
        style={{ marginRight: "1rem" }}
        icon={icon}
        className={classNames({ "color-white": true })}
      />
      <h3
        className={classNames({ "heading-4": true, "color-white": button })}
        style={{ color: "white" }}
      >
        Log in with {name}
      </h3>
    </a>
  );
};

export default SocialAuthLoginButton;
