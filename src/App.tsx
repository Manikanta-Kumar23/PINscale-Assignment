import {BrowserRouter , Switch, Route ,Router} from "react-router-dom";

import "./App.css";
import AddTransactions from "./components/AddTransactions";
import UpdateTransactions from "./components/UpdateTransactions";
import DeleteTransaction from "./components/DeleteTransactions";
import Login from "./components/Login";
import Home from "./components/Home";
import Transactions from "./components/Transactions";
import Profile from "./components/Profile";
import AuthenticateRoute from "./components/AuthenticateRoute";
import NotFound from "./common/NotFound";
import ResourceProvider from "./context/ResourceContext";
import StoreProvider from "./context/StoreContext";
import {createMemoryHistory} from "history"

const App = () => {
  const history = createMemoryHistory()
  return (
    <StoreProvider>
      <ResourceProvider>
        <UpdateTransactions />
        <AddTransactions />
        <Router history={history}><DeleteTransaction /></Router>
       <BrowserRouter>
       <Switch>
          <Route exact path="/login" component={Login} />
          <AuthenticateRoute exact path="/" component={Home} />
          <AuthenticateRoute path="/transactions" component={Transactions} />
          <AuthenticateRoute path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
        </BrowserRouter>
      </ResourceProvider>
    </StoreProvider>
  );
};

export default App;
