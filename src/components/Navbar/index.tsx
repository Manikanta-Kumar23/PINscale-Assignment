import { withRouter , Link } from "react-router-dom"
import { HiMenu } from "react-icons/hi";
import Cookies from "js-cookie";

import ResourceContext from "../../context/ResourceContext";
import TransactionType from "../TransactionType";

import "./index.css";
import  { useContext } from "react";
import useUserId from "../../hooks/useUserId";

interface TransactionTabType {
  name: string
  id: string
}

const Navbar = (props: any) => {
  const userId = useUserId()
  const { onClickTransaction, onShow, showSidebar , activeTypeId } = useContext(ResourceContext)

  const transactionTypes: TransactionTabType[] = [
    { name: "All Transactions", id: "ALL TRANSACTIONS" },
    { name: "Debit", id: "debit" },
    { name: "Credit", id: "credit" },
  ];
  

  const { location } = props;
  const { pathname } = location;
  let navName = "Accounts";
  let dashboardActive = true;
  let transActive = false;
  let profileActive = false;
  if ("/transactions" === pathname && (userId) === "3") {
    navName = "All Transactions";
    transActive = true;
    dashboardActive = false;
    profileActive = false;
  } else if ("/transactions" === pathname) {
    navName = "Your Transactions";
    transActive = true;
    dashboardActive = false;
    profileActive = false;
  } else if ("/profile" === pathname) {
    navName = "Profile";
    transActive = false;
    dashboardActive = false;
    profileActive = true;
  }
  const border = "/transactions" === pathname ? "borderWidth" : null;
  const dashboardColor = dashboardActive ? "nav-active" : null;
  const transColor = transActive ? "nav-active" : null;
  const profileColor = profileActive ? "nav-active" : null;
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
              {(userId) !== "3" && (
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
                <Link className={`nav-link ${dashboardColor}`} to="/">
                  <li>Dashboard</li>
                </Link>
                <Link className={`nav-link ${transColor}`} to="/transactions">
                  <li>Transactions</li>
                </Link>
                <Link className={`nav-link ${profileColor}`} to="/profile">
                  <li>Profile</li>
                </Link>
                <button onClick={logout} className="log-btn" type="button">
                  Logout
                </button>
              </ul>
            )}
            {transActive && (
                <ul className="transactiontype-crd">
                {transactionTypes.map((each) => (
                  <TransactionType
                    list={each}
                    key={each.id}
                    isActive={activeTypeId === each.id}
                  />
                ))}
                </ul>
              )}
          </>
        );
};

export default withRouter(Navbar);
