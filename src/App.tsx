import { Switch, Route, withRouter } from "react-router-dom";


import "./App.css";
import AddTransactions from "./components/AddTransactions";
import UpdateTransactions from "./components/UpdateTransactions";
import DeleteTransaction from "./components/DeleteTransactions";
import Login from "./components/Login";
import Home from "./components/Home";
import Transactions from "./components/Transactions";
import Profile from "./components/Profile";
import AuthenticateRoute from "./components/AuthenticateRoute";
import NotFound from "./components/NotFound";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import ResourceProvider from "./context/ResourceContext";
import StoreProvider from "./context/StoreContext";

const  App = () => {
    return (
      <StoreProvider>
        <ResourceProvider>
        {<>
          <UpdateTransactions />
        <AddTransactions />
        <DeleteTransaction />
        <Switch>
        <Route exact path="/login" component={Login} />
        <div className="home-bg">
          <SideBar />
          <div className="home-content">
            <Navbar />
            <div className="main-content">
              <AuthenticateRoute exact path="/" component={Home} />
              <AuthenticateRoute path="/transactions" component={Transactions}/>
              <AuthenticateRoute path="/profile" component={Profile} />
            </div>
        </div>
      </div>
          <Route component={NotFound} />
        </Switch>
        </>}
        </ResourceProvider>
      </StoreProvider>
    );
  }

export default withRouter(App);
