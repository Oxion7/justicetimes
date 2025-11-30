import React, { useMemo } from "react";
import { Header } from "../index";
import { useAppSelector } from "../../../hooks/redux";
import { checkIsLoggedIn } from "../../../utils/authUtils";

export const HeaderContainer: React.FC = () => {
  const { isAuthenticated, user, token } = useAppSelector(
    (state) => state.auth,
  );

  const isLoggedIn = useMemo(() => {
    if (isAuthenticated && user && token) return true;
    return checkIsLoggedIn();
  }, [isAuthenticated, user, token]);

  return <Header isLoggedIn={isLoggedIn} />;
};
