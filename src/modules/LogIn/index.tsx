import React, { useEffect } from "react";
import { loginUser } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { LoginFormData, loginSchema } from "../../validation/authValidation";
import { ErrorMessage, Field, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import {
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
} from "../../store/selectors/authSelector";

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) navigate("/profile");
  }, [isAuthenticated, navigate]);

  const handleSubmit = (values: LoginFormData) => {
    dispatch(loginUser(values));
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <h2 className="header-text">Log in to your account</h2>
        {error && <div className="error-message">{error}</div>}

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <Field
                  type="email"
                  name="email"
                  className={
                    errors.email && touched.email ? "input-error" : "input"
                  }
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Password</label>
                <Field
                  maxLength="16"
                  type="password"
                  name="password"
                  className={
                    errors.password && touched.password
                      ? "input-error"
                      : "input"
                  }
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>

              <div className="auth-switch">
                <p>
                  Don’t have a Times account?{" "}
                  <Link to="/signin" className="auth-link">
                    Create one
                  </Link>
                </p>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
