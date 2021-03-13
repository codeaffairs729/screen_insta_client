import React, { useState, memo, Fragment } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useHistory } from "react-router-dom";

import { selectCurrentUser } from "../../redux/user/userSelectors";

import useScrollPositionThrottled from "../../hooks/useScrollPositionThrottled";
import { showModal, hideModal } from "../../redux/modal/modalActions";

import { ReactComponent as LogoCamera } from "../../assets/svg/logo-camera.svg";
import SearchBox from "../SearchBox/SearchBox";
import NewPostButton from "../NewPost/NewPostButton/NewPostButton";
import NotificationButton from "../Notification/NotificationButton/NotificationButton";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";

const Header = memo(({ currentUser, showModal, hideModal }) => {
  const [shouldMinimizeHeader, setShouldMinimizeHeader] = useState(false);
  const {
    location: { pathname },
  } = useHistory();

  // Shrink header height and remove logo on scroll
  useScrollPositionThrottled(({ currentScrollPosition }) => {
    if (window.outerWidth > 600) {
      setShouldMinimizeHeader(currentScrollPosition > 100);
    }
  });

  const OnClickAddPost = () => {
    showModal(
      { hide: () => hideModal("CreatePost/CreatePostModal") },
      "CreatePost/CreatePostModal"
    );
  };;

  const headerClassNames = classNames({
    header: true,
    "header--small": shouldMinimizeHeader,
  });

  return (
    <header className={headerClassNames}>
      <div className="header__content">
        <Link to="/" className="header__logo">
          <div className="header__logo-image">
            <LogoCamera />
          </div>
          <div className="header__logo-header">
            <h3 className="heading-logo">Between us</h3>
          </div>
        </Link>
        <SearchBox />
        <div className="header__icons">
          {currentUser ? (
            <Fragment>
              <Link to="/new">
                <Icon
                  icon={pathname === "/new" ? "add-circle" : "add-circle-outline"}
                />
              </Link>
              <NotificationButton />
              <Link to={"/" + currentUser.username}>
                <Icon
                  icon={
                    pathname === "/" + currentUser.username
                      ? "person-circle"
                      : "person-circle-outline"
                  }
                />
              </Link>
            </Fragment>
          ) : (
            <Fragment>
              <Link style={{ marginRight: "1rem" }} to="/login">
                <Button>Log In</Button>
              </Link>
              <Link to="/signup">
                <h3 className="heading-3 heading--button color-blue">
                  Sign Up
                </h3>
              </Link>
            </Fragment>
          )}
        </div>
      </div>
    </header>
  );
});

Header.whyDidYouRender = true;

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
  hideModal: (component) => dispatch(hideModal(component)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
