import React from "react";
import Logo from "../../assets/logo.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import "./style.scss";
import { logoutUser } from "../../store/slices/authSlice";

export const Header: React.FC<any> = ({ isLoggedIn }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };
  const myProfileUrl = user?.id ? `/profile/${user.id}/articles` : "/login";
  return (
    <header className="header">
      <div className="header-container">
        <NavLink to="/all-articles" className="logo">
          <Logo />
        </NavLink>
        <nav className="header-buttons">
          {isLoggedIn ? (
            <>
              <NavLink to="/all-articles" className="header-button">
                All Articles
              </NavLink>
              <NavLink to={myProfileUrl} className="header-button">
                My Articles
              </NavLink>
              <NavLink to="/add-article" className="header-button">
                Add Article
              </NavLink>
              <NavLink to="/profile" className="header-button">
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="header-button logout-button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="login-button">
                Log in
              </NavLink>
              <NavLink to="/signin" className="signin-button">
                Sign in
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
