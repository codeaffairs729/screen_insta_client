import React from "react";
import { Link } from "react-router-dom";
import TextButton from "../Button/TextButton/TextButton";

const Footer = () => {

  return (
    <footer className="footer">
      <div className="footer__left">
        <TextButton bold small darkBlue>
          <Link to="/termsandconditions">
            TERMS AND CONDITIONS
          </Link>

        </TextButton>
      </div>
    </footer>
  );
}

export default Footer;
