import React, { useEffect } from "react";
import { loginUser } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { LoginFormProps } from "./types/LoginForm.modules";
import { LoginFormData, loginSchema } from "../../validation/authValidation";
import { ErrorMessage, Field, Formik } from "formik";

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state: any) => state.auth);

  const initialValues: LoginFormData = {
    email: '',
    password: '',
  };

  const handleSubmit = (values: LoginFormData) => {
    dispatch(loginUser(values));
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1 className="logo">The Justice Times</h1>
      </div>

      <div className="auth-content">
        <h2>Log in to your account</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <form className="auth-form">
              <div className="form-group">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className={errors.email && touched.email ? 'input-error' : 'input'}
                />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={errors.password && touched.password ? 'input-error' : 'input'}
                />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </button>

              <div className="auth-switch">
                <p>
                  Don't have an account?{' '}
                  <a href="/signup" className="auth-link">
                    Sign up
                  </a>
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