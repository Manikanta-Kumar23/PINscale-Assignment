import Cookies from "js-cookie";
import { Redirect, Route } from "react-router-dom";

const AuthenticateRoute = (props) => {
  const userId = Cookies.get("id");
  if (userId === undefined) {
    return <Redirect to="/login" />;
  }
  return <Route {...props} />;
};

export default AuthenticateRoute;
