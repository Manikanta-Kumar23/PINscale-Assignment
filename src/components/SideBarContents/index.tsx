import { Link } from "react-router-dom";

import "./index.css";

interface ContentsType {
  name: string;
  id: string;
  icon: string;
  activeIcon: string;
  link: string;
}
interface SideBarProps {
  list: ContentsType;
  isActive: boolean;
}

const SideBarContents = (props: SideBarProps) => {
  const { list, isActive } = props;
  const { name, icon, link, activeIcon } = list;
  const nameColor = isActive ? "sidebar-active" : null;
  return (
    <Link className="link" to={link}>
      <li className="content-list">
        {isActive && <hr className="content-line" />}
        <div className="content-card">
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
