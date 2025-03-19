import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(); // Track dropdown
  const buttonRef = useRef(); // Track button for focus return

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  // Close menu on outside click or "Escape"
  useEffect(() => {
    const closeMenu = (e) => {
      if (e.type === "keydown" && e.key === "Escape") setShowMenu(false);
      if (e.type === "mousedown" && menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", closeMenu);
      document.addEventListener("keydown", closeMenu);
      // Focus first dropdown item when opened
      menuRef.current?.querySelector("li")?.focus();
    } else {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeMenu);
      buttonRef.current?.focus(); // Return focus to button
    }

    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeMenu);
    };
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  return (
    <>
      <button onClick={openMenu} ref={buttonRef}>
        <i className="fa-regular fa-face-smile"></i>
      </button>
      {showMenu && (
        <ul className={`profile-dropdown ${showMenu ? "show" : ""}`} ref={menuRef} tabIndex="-1">
          <li tabIndex="0">{user.username}</li>
          <li tabIndex="0">{user.email}</li>
          <li>
            <button onClick={logout}>Log Out</button>
          </li>
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
