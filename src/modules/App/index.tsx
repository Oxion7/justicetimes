import React from "react";
import { HeaderContainer } from "../Header/HeaderContainer";
import { FooterContainer } from "../Footer/FooterContainer";
import { Route, Routes } from "react-router-dom";
import "./style.scss"
import RegisterForm from "../SignIn";
import { useAuth } from "../../hooks/useAuth";
import SignIn from "../SignIn";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import LogIn from "../LogIn";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <SignIn />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</>: <SignIn />;
};

export const App: React.FC<any> = () => {
  return (
      <div className="app-wrapper">
        <Provider store={store}>
        <HeaderContainer />
        <div className="app-wrapper-content">

          <Routes>
            <Route
              path="/SignIn"
              element={
                <PublicRoute>
                  <SignIn />
                </PublicRoute>
              }
            />
            <Route
              path="/LogIn"
              element={
                <PublicRoute>
                  <LogIn />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={<SignIn />}
            />
          </Routes>
        </div>
        <FooterContainer />
        </Provider>
      </div>
  );
};
