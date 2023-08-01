import Cookies from "js-cookie";

import { withRouter } from "react-router-dom";

import ResourceContext from "../../context/ResourceContext";

import { HiMenu } from "react-icons/hi";

import { Link } from "react-router-dom";

import "./index.css";

const Navbar = (props) => {
  const userId = Cookies.get("id");
  const { location } = props;
  const { pathname } = location;
  let navName = "Accounts";
  if ("/transactions" === pathname && parseInt(userId) === 3) {
    navName = "All Transactions";
  } else if ("/transactions" === pathname) {
    navName = "Your Transactions";
  } else if ("/profile" === pathname) {
    navName = "Profile";
  }
  const border = "/transactions" === pathname ? "borderWidth" : null;
  return (
    <ResourceContext.Consumer>
      {(value) => {
        const { onClickTransaction, onShow, showSidebar } = value;
        const onAdd = () => {
          onClickTransaction();
        };
        const showBar = () => {
          onShow();
        };
        const logout = () => {
          Cookies.remove("id");
          const { history } = props;
          history.replace("/");
        };
        return (
          <>
            <nav className={`nav ${border}`}>
              <h1 className="nav-name">{navName}</h1>
              {parseInt(userId) !== 3 && (
                <button onClick={onAdd} type="button" className="transc-btn">
                  + Transactions
                </button>
              )}
              <button onClick={showBar} className="menu" type="button">
                <HiMenu />
              </button>
            </nav>
            {showSidebar && (
              <ul className="nav-list">
                <Link className="nav-link" to="/">
                  <li>Dashboard</li>
                </Link>
                <Link className="nav-link" to="/transactions">
                  <li>Transactions</li>
                </Link>
                <Link className="nav-link" to="/profile">
                  <li>Profile</li>
                </Link>
                <button onClick={logout} className="log-btn" type="button">
                  Logout
                </button>
              </ul>
            )}
          </>
        );
      }}
    </ResourceContext.Consumer>
  );
};

export default withRouter(Navbar);
