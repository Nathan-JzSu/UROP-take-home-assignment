import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Drawer = (props) => {
  const { callback, children, isOpen, position = "left" } = props;
  const [portalDiv, setPortalDiv] = useState(null);

  const BACKDROP_STYLES = {
    background: "rgba(0,0,0, 0.25)",
    width: "100vw",
    height: "100vh",
    zIndex: 99,
    position: "fixed",
    top: 0,
    visibility: isOpen ? "visible" : "hidden",
    opacity: isOpen ? 1 : 0,
    transition: "opacity 0.3s ease-out",
  };

  const DRAWER_STYLES = {
    height: "100vh",
    position: "fixed",
    width: isOpen ? "30vw" : 0,
    zIndex: 99,
    background: "#FFF",
    top: 0,
    [position]: 0,
    visibility: isOpen ? "visible" : "hidden",
    opacity: isOpen ? 1 : 0,
    transition: "width 0.3s ease-out",
  };

  useEffect(() => {
    setPortalDiv(document.getElementById("portal"));
  }, []);

  if (!portalDiv) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      {isOpen && (
        <div style={BACKDROP_STYLES} onClick={callback}></div>
      )}
      <div style={DRAWER_STYLES}>{children}</div>
    </>,
    portalDiv
  );
};

export default Drawer;
