import { useContext } from "react";
import { withRouter, Link } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

import { ResourceContext } from "../../context/ResourceContext";
import useUserId from "../../hooks/useUserId";
import "./index.css";

const Navbar = (props: any) => {
  const userId = useUserId();
  const { onClickAddTransaction, onShowSidebar, shouldShowSidebar } =
    useContext(ResourceContext);

  const { i18n } = useTranslation();
  const { location } = props;
  const { pathname } = location;
  let navName = i18n.t("navbar.accounts");
  let dashboardActive = true;
  let transactionActive = false;
  let profileActive = false;
  if ("/transactions" === pathname && userId === "3") {
    navName = i18n.t("navbar.adminTransactions");
    transactionActive = true;
    dashboardActive = false;
    profileActive = false;
  } else if ("/transactions" === pathname) {
    navName = i18n.t("navbar.userTransactions");
    transactionActive = true;
    dashboardActive = false;
    profileActive = false;
  } else if ("/profile" === pathname) {
    navName = i18n.t("navbar.profile");
    transactionActive = false;
    dashboardActive = false;
    profileActive = true;
  }

  const lngs = [
    { value: "en", nativeName: "English" },
    { value: "es", nativeName: "Spanish/Español" },
    { value: "fr", nativeName: "French" },
  ];

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
        <div className="nav-translation-card">
          <select
            value={i18n.resolvedLanguage}
            className="translation"
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            {lngs.map((each) => (
              <option value={each.value}>{each.nativeName}</option>
            ))}
          </select>
          {userId !== "3" && (
            <button
              onClick={onAdd}
              type="button"
              className="add-transaction-button"
            >
              + Transactions
            </button>
          )}
          <button onClick={showSideBar} className="menu" type="button">
            <HiMenu />
          </button>
        </div>
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
