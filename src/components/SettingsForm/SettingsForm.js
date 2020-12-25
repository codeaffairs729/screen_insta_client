import React from "react";

const SettingsForm = ({ onSubmit, children }) => (
  <form autocomplete="nope" className="settings-form" onSubmit={onSubmit}>
    {children}
  </form>
);

export default SettingsForm;
