import useUserId from "../../hooks/useUserId";
import { Redirect, Route } from "react-router-dom";

interface RouteProps {
  exact?: boolean
  path: string
  component: () => JSX.Element
}

const AuthenticateRoute = (props: RouteProps) => {
  const userId = useUserId()
  if (userId === undefined) {
    return <Redirect to="/login" />;
  }
  return <Route {...props} />;
};

export default AuthenticateRoute;
