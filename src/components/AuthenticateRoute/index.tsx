import useUserId from "../../hooks/useUserId";
import React ,{ Redirect, Route } from "react-router-dom";

const AuthenticateRoute = (props) => {
  const userId = useUserId()
  if (userId === undefined) {
    return <Redirect to="/login" />;
  }
  return <Route {...props} />;
};

export default AuthenticateRoute;
