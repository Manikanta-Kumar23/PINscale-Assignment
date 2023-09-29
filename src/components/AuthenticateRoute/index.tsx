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
    <div className="w-[100vw] h-[100vh] p-[0px] m-[0px] flex bg-[#eee9e9]">
      <SideBar />
      <div className="flex flex-col w-[100%] p-[0px] m-[0px] md:w-[85%]">
        <Navbar />
        <Route {...props} />
      </div>
    </div>
  );
};

export default AuthenticateRoute;
