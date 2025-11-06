import React from "react";
import Logo from "../../assets/logo.svg";
import { NavLink } from "react-router-dom";
import "./style.scss";

export const Header: React.FC<any> = ({isLoggedIn}) => {
  return (
    <header className="header">
      <div className="header-container">
        <NavLink to="/popular" className="logo">
          <Logo />
        </NavLink>
        {isLoggedIn ? (
          <div className="header-buttons">
            <NavLink to="/popular" className="header-button">
              All articles
            </NavLink>
            <NavLink to="/my-articles" className="header-button">
              My articles
            </NavLink>
            <NavLink to="/add-article" className="header-button">
              Add articles
            </NavLink>
            <NavLink to="/profile" className="header-button">
              Profile
            </NavLink>
            <NavLink to="/logout" className="header-button">
              Logout
            </NavLink>
          </div>
        ) : (
          <div className="header-buttons">
            <NavLink to="/login" className="header-button">
              Log in
            </NavLink>
            <NavLink to="/signin" className="header-button">
              Sign in
            </NavLink>
          </div>
        )}

      </div>
    </header>
  );
};
