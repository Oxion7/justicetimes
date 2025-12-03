import React from "react";
import Logo from "../../assets/logoLight.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import "./style.scss";
import { logoutUser } from "../../store/slices/authSlice";

export const Footer: React.FC<any> = ({ isLoggedIn }) => {
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
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <NavLink to="/all-articles" className="logo">
            <Logo />
          </NavLink>
          <nav className="footer-buttons">
            {isLoggedIn ? (
              <>
                <NavLink to="/all-articles" className="footer-button">
                  All Articles
                </NavLink>
                <NavLink to={myProfileUrl} className="footer-button">
                  My Articles
                </NavLink>
                <NavLink to="/add-article" className="footer-button">
                  Add Article
                </NavLink>
                <NavLink to="/profile" className="footer-button">
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="footer-button logout-button"
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
        <div className="footer-bottom">
          <p className="copyright">
            &copy; 2021 Justice-it. All rights reserved.
          </p>
          <p className="copyright">
            &copy; 2021 Justice-it. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
