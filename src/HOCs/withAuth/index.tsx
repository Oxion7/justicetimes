import LogIn from "../../modules/LogIn";
import { useAuth } from "../../hooks/useAuth";
import React from "react";

export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) return <LogIn />;
    return <Component {...props} />;
  };
};