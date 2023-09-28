import useUserId from "../../hooks/useUserId";
import { Redirect, Route } from "react-router-dom";
import SideBar from "../SideBar";
import Navbar from "../Navbar";

interface RouteProps {
  exact?: boolean;
  path: string;
  component: (props?: any) => JSX.Element;
}

const AuthenticateRoute = (props: RouteProps) => {
  const userId = useUserId();
  if (userId === undefined) {
    return <Redirect to="/login" />;
  }
  return (
    <div className="home-bg">
      <SideBar />
      <div className="home-content">
        <Navbar />
        <Route {...props} />
      </div>
    </div>
  );
};

export default AuthenticateRoute;
