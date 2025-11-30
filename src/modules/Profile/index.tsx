import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { updateUserProfile } from "../../store/slices/authSlice";
import { withAuth } from "../../HOCs/withAuth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  ProfileFormData,
  profileSchema,
  SUPPORTED_FORMATS,
} from "../../validation/profileValidation";
import "./style.scss";
import { MAX_FILE_SIZE } from "./const/Profile";
import fallbackImg from "../../assets/noPhoto.png";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user?.avatar || null,
  );

  const initialValues: ProfileFormData = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    description: user?.description || "",
    avatar: user?.avatar || null,
  };

  const handleSubmit = async (values: ProfileFormData) => {
    try {
      await dispatch(updateUserProfile(values)).unwrap();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: string | null) => void,
    setFieldError: (field: string, value: string | undefined) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFieldError("avatar", undefined);

    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setFieldError(
        "avatar",
        "Please select a valid image file (JPEG, PNG, GIF, WebP, SVG)",
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFieldError("avatar", "Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setFieldValue("avatar", result);
      setPreviewUrl(result);
    };
    reader.onerror = () => {
      setFieldError(
        "avatar",
        "Failed to read the image file. Please try again.",
      );
      setFieldValue("avatar", null);
      setPreviewUrl(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = (
    setFieldValue: (field: string, value: string | null) => void,
    setFieldError: (field: string, value: string | undefined) => void,
  ) => {
    setFieldValue("avatar", null);
    setPreviewUrl(null);
    setFieldError("avatar", undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="profile-wrapper">
      <h1 className="profile-title">Profile</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={profileSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          setFieldError,
          dirty,
          isValid,
        }) => {
          const displayImage = previewUrl || values.avatar;
          const hasPhoto = !!displayImage;

          return (
            <Form className="profile-grid">
              <div className="profile-left">
                <div className="double-border-avatar">
                  <div className="avatar-card">
                    <div className="avatar-preview">
                      <img src={displayImage || fallbackImg} alt="Profile" />
                    </div>

                    <div className="photo-actions">
                      <button
                        type="button"
                        className="change-photo-btn"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change photo
                      </button>

                      {hasPhoto && ( // Only show delete button if there's a photo
                        <button
                          type="button"
                          className="delete-photo-btn"
                          onClick={() =>
                            handleDeletePhoto(setFieldValue, setFieldError)
                          }
                        >
                          Delete photo
                        </button>
                      )}
                    </div>

                    <ErrorMessage
                      name="avatar"
                      component="div"
                      className="image-error"
                    />

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) =>
                        handleImageChange(e, setFieldValue, setFieldError)
                      }
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </div>

              <div className="profile-form">
                <div className="name-fields">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">
                      First name
                    </label>
                    <Field
                      id="firstName"
                      name="firstName"
                      className={`form-input ${errors.firstName && touched.firstName ? "input-error" : ""}`}
                      type="text"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">
                      Last name
                    </label>
                    <Field
                      id="lastName"
                      name="lastName"
                      className={`form-input ${errors.lastName && touched.lastName ? "input-error" : ""}`}
                      type="text"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    className={`form-textarea ${errors.description && touched.description ? "input-error" : ""}`}
                    rows={4}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error-message"
                  />
                </div>

                <button
                  type="submit"
                  className="save-button"
                  disabled={!dirty || !isValid || isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default withAuth(Profile);
