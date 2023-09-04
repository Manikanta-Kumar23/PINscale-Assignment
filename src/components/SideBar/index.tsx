import  { useContext } from "react";
import { withRouter } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

import useUserId from "../../hooks/useUserId";
import SideBarContents from "../SideBarContents";
import{ ResourceContext} from "../../context/ResourceContext";
import { imagesUrl } from "../../constants";

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

const SideBar = (props: any) => {
  const userId = useUserId()
  const { userList, isLoading, onLogClick} = useContext(ResourceContext)

  const toHome = () => {
    const { history } = props;
    history.push("/");
  };
  const onLogout = () => {
    onLogClick()
  }
          let name : string = "Username";
          let email : string= "Email";
          const { location } = props;
          if (isLoading === "SUCCESS") {
            name = userList[0].name;
            email = userList[0].email;
          }
          return (
            <div className="sidebar-card">
              <img
                onClick={toHome}
                alt="logo"
                className="sidebar-logo"
                src="https://res.cloudinary.com/djwve85r0/image/upload/v1690624094/Company_logo.png"
              />
              <ul className="content-card">
                {sideBarContents.map((each) => (
                  <SideBarContents
                    list={each}
                    key={each.id}
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
                        (user) => (user.id) === (userId)
                      )?.url
                    }
                  />
                  <div className="mail-card">
                    <h1 className="usr-name">
                      {(userId) !== "3" ? name : "Admin"}
                    </h1>
                    <p className="usr-mail">
                      {(userId) !== "3" ? email : "admin@gmail.com"}
                    </p>
                  </div>
                </div>
                    <button onClick={onLogout} className="logout-btn" type="button">
                      <FiLogOut />
                    </button>
              </div>
            </div>
          );
}

export default withRouter(SideBar);
