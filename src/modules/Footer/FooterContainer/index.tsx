import React, { useMemo } from "react";
import { useAppSelector } from "../../../hooks/redux";
import { checkIsLoggedIn } from "../../../utils/authUtils";
import { Footer } from "../index";

export const FooterContainer: React.FC = () => {
  const { isAuthenticated, user, token } = useAppSelector(
    (state) => state.auth,
  );

  const isLoggedIn = useMemo(() => {
    return checkIsLoggedIn();
  }, [isAuthenticated, user, token]);

  return <Footer isLoggedIn={isLoggedIn} />;
};
