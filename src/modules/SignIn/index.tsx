import React, { useEffect } from "react";
import { registerUser } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  RegisterFormData,
  registerSchema,
} from "../../validation/authValidation";
import { ErrorMessage, Field, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import {
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
} from "../../store/selectors/authSelector";

const SignIn: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/LogIn");
    }
  }, [isAuthenticated, navigate]);

  const initialValues: RegisterFormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordStatement: "",
  };

  const handleSubmit = (values: RegisterFormData) => {
    const registerData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    };
    dispatch(registerUser(registerData));
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <h2 className="header-text">Create your free account</h2>

        {error && <div className="error-message">{error}</div>}

        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isValid, dirty, handleSubmit }) => (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="name-fields">
                <div className="form-group">
                  <label htmlFor="firstName">First name</label>
                  <Field
                    type="text"
                    name="firstName"
                    className={
                      errors.firstName && touched.firstName
                        ? "input-error"
                        : "input"
                    }
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last name</label>
                  <Field
                    type="text"
                    name="lastName"
                    className={
                      errors.lastName && touched.lastName
                        ? "input-error"
                        : "input"
                    }
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>

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
                <label htmlFor="password">Password</label>
                <Field
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

              <div className="form-group">
                <label htmlFor="passwordStatement">Confirm password</label>
                <Field
                  type="password"
                  name="passwordStatement"
                  className={
                    errors.passwordStatement && touched.passwordStatement
                      ? "input-error"
                      : "input"
                  }
                />
                <ErrorMessage
                  name="passwordStatement"
                  component="div"
                  className="error-message"
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading || !isValid || !dirty}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignIn;
