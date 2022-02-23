import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { animated } from 'react-spring';

const badgeStyle = {
  width: "80%",
  height: "80%",
  position: "absolute",
  bottom: "11px",
  left: "10px",
  borderRadius: "20px",
  fontSize: "11px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  backgroundColor: "#ff2f2f",
  textAlign: "center",
  color: "white",
  fontWeight: "bold"
}
const Icon = ({ onClick, className, icon, style, badge = 0 }) => {
  const iconClassNames = classNames({
    icon: true,
    [className]: className,
  });
  // console.log(typeof badge)

  return (
    <animated.div style={style} onClick={onClick} className={iconClassNames}>
      <ion-icon size="small" name={icon}>

      </ion-icon>
      {badge > 0 && (<ion-badge
        style={badgeStyle}
        color="danger">{badge}</ion-badge>)}
    </animated.div>
  );
};

Icon.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
};

export default Icon;
