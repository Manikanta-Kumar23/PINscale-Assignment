import { Link } from "react-router-dom";

import "./index.css";

const SideBarContents = (props) => {
  const { list, isActive } = props;
  const { name, icon, link, activeIcon } = list;
  const nameColor = isActive ? "sidebar-active" : null;
  return (
    <Link className="link" to={link}>
      <li className="content-list">
        {isActive && <hr className="cont-line" />}
        <div className="cnt-icons">
          <img
            style={{ color: "#505887" }}
            className="content-icon"
            alt="icons"
            src={isActive ? activeIcon : icon}
          />
          <h1 className={`content ${nameColor}`}>{name}</h1>
        </div>
      </li>
    </Link>
  );
};

export default SideBarContents;
