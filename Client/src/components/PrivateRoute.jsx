// import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, component: Component }) => {
  return isAuthenticated() ? <Component /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
