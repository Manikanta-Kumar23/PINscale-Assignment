import  { useContext } from "react";
import { withRouter , Link } from "react-router-dom"
import { HiMenu } from "react-icons/hi";
import Cookies from "js-cookie";

import {ResourceContext }from "../../context/ResourceContext";
import useUserId from "../../hooks/useUserId";
import "./index.css";


const Navbar = (props: any) => {
  const userId = useUserId()
  const { onClickAddTransaction, onShowSidebar, shouldShowSidebar } = useContext(ResourceContext)
  
  const { location } = props;
  const { pathname } = location;
  let navName = "Accounts";
  let dashboardActive = true;
  let transactionActive = false;
  let profileActive = false;
  if ("/transactions" === pathname && (userId) === "3") {
    navName = "All Transactions";
    transactionActive = true;
    dashboardActive = false;
    profileActive = false;
  } else if ("/transactions" === pathname) {
    navName = "Your Transactions";
    transactionActive = true;
    dashboardActive = false;
    profileActive = false;
  } else if ("/profile" === pathname) {
    navName = "Profile";
    transactionActive = false;
    dashboardActive = false;
    profileActive = true;
  }
  const border = "/transactions" === pathname ? "borderWidth" : null;
  const dashboardColor = dashboardActive ? "nav-active" : null;
  const transactionColor = transactionActive ? "nav-active" : null;
  const profileColor = profileActive ? "nav-active" : null;
        const onAdd = () => {
          onClickAddTransaction();
        };
        const showSideBar = () => {
          onShowSidebar();
        };
        const logout = () => {
          Cookies.remove("id");
          const { history } = props;
          history.replace("/");
        };
        return (
          <>
            <nav className={`nav ${border}`}>
              <h1 className="nav-heading">{navName}</h1>
              {(userId) !== "3" && (
                <button onClick={onAdd} type="button" className="add-transaction-button">
                  + Transactions
                </button>
              )}
              <button onClick={showSideBar} className="menu" type="button">
                <HiMenu />
              </button>
            </nav>
            {shouldShowSidebar && (
              <ul className="mobile-nav-list">
                <Link className={`nav-link ${dashboardColor}`} to="/">
                  <li>Dashboard</li>
                </Link>
                <Link className={`nav-link ${transactionColor}`} to="/transactions">
                  <li>Transactions</li>
                </Link>
                <Link className={`nav-link ${profileColor}`} to="/profile">
                  <li>Profile</li>
                </Link>
                <button onClick={logout} className="nav-logout-btn" type="button">
                  Logout
                </button>
              </ul>
            )}
          </>
        );
};

export default withRouter(Navbar);
