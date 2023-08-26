import { Component } from "react";

import { withRouter } from "react-router-dom";

import ResourceContext from "../../context/ResourceContext";

import Popup from "reactjs-popup";

import { FiLogOut } from "react-icons/fi";

import SideBarContents from "../SideBarContents";

import Cookies from "js-cookie";

import "./index.css";

const sideBarContents = [
  {
    name: "Dashboard",
    id: "DASHBOARD",
    icon:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690785406/Home_bh15nh.png",
    activeIcon:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690785406/Home-Active_lfcjoq.png",
    link: "/",
  },
  {
    name: "Transactions",
    id: "TRANSACTIONS",
    icon:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690785406/Transfer_ztplu3.png",
    activeIcon:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690785406/Transfer-Active_kr79tm.png",
    link: "/transactions",
  },
  {
    name: "Profile",
    id: "PROFILE",
    icon:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690785406/User_pgnnfj.png",
    activeIcon:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690785406/User-Active_ewrxbe.png",
    link: "/profile",
  },
];

class SideBar extends Component {
  state = { activeTab: sideBarContents[0].id };

  onTabChange = (id) => {
    this.setState({
      activeTab: id,
    });
  };

  onLogout = () => {
    const { history } = this.props;
    Cookies.remove("id");
    history.replace("/login");
  };

  onHome = () => {
    const { history } = this.props;
    history.push("/");
  };

  render() {
    return (
      <ResourceContext.Consumer>
        {(value) => {
          let name = "Username";
          let email = "Email";
          const userId = Cookies.get("id");
          const { location } = this.props;
          const { userList, isLoading, imagesUrl } = value;
          if (isLoading === "SUCCESS") {
            name = userList[0].name;
            email = userList[0].email;
          }
          return (
            <div className="sidebar-card">
              <img
                onClick={this.onHome}
                alt="logo"
                className="sidebar-logo"
                src="https://res.cloudinary.com/djwve85r0/image/upload/v1690624094/Company_logo.png"
              />
              <ul className="content-card">
                {sideBarContents.map((each) => (
                  <SideBarContents
                    list={each}
                    key={each.id}
                    onTabChange={this.onTabChange}
                    isActive={each.link === location.pathname}
                  />
                ))}
              </ul>
              <div className="name-card">
                <div className="mail">
                  <img
                    className="avatar"
                    alt="avatar"
                    src={
                      imagesUrl.find(
                        (user) => parseInt(user.id) === parseInt(userId)
                      )?.url
                    }
                  />
                  <div className="mail-card">
                    <h1 className="usr-name">
                      {parseInt(userId) !== 3 ? name : "Admin"}
                    </h1>
                    <p className="usr-mail">
                      {parseInt(userId) !== 3 ? email : "admin@gmail.com"}
                    </p>
                  </div>
                </div>
                <Popup
                  modal
                  trigger={
                    <button className="logout-btn" type="button">
                      <FiLogOut />
                    </button>
                  }
                >
                  {(close) => (
                    <div className="modal-card">
                      <div className="mssg-card">
                        <div className="out-icon">
                          <span className="bg-clr">
                            <FiLogOut color="#D97706" size="21" />
                          </span>
                        </div>
                        <div className="text-card">
                          <h1 className="logout-name">
                            Are you sure you want to Logout?
                          </h1>
                          <p className="cnfrm-txt">
                            Click Yes to logout or else Cancel
                          </p>
                          <div className="btn-crd">
                            <button
                              onClick={this.onLogout}
                              className="s-btn"
                              type="button"
                            >
                              Yes,Logout
                            </button>
                            <button
                              className="no-btn"
                              type="button"
                              onClick={() => close()}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Popup>
              </div>
            </div>
          );
        }}
      </ResourceContext.Consumer>
    );
  }
}

export default withRouter(SideBar);
