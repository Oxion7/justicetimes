import React, { useEffect } from "react";
import { clearError, registerUser } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { RegisterFormData, registerSchema } from "../../validation/authValidation";
import { ErrorMessage, Field, Formik } from "formik";

const SignIn: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const initialValues: RegisterFormData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordStatement: '',
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
      <div className="auth-header">
        <h1 className="logo">The Justice Times</h1>
      </div>

      <div className="auth-content">
        <h2>Create your free account</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isValid, dirty }) => (
            <form className="auth-form">
              <div className="name-fields">
                <div className="form-group">
                  <Field
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    className={errors.firstName && touched.firstName ? 'input-error' : 'input'}
                  />
                  <ErrorMessage name="firstName" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <Field
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    className={errors.lastName && touched.lastName ? 'input-error' : 'input'}
                  />
                  <ErrorMessage name="lastName" component="div" className="error-message" />
                </div>
              </div>

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

              <div className="form-group">
                <Field
                  type="password"
                  name="passwordStatement"
                  placeholder="Confirm password"
                  className={errors.passwordStatement && touched.passwordStatement ? 'input-error' : 'input'}
                />
                <ErrorMessage name="passwordStatement" component="div" className="error-message" />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading || !isValid || !dirty}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="auth-switch">
                <p>
                  Already have an account?{' '}
                  <a href="/login" className="auth-link">
                    Log in
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

export default SignIn;