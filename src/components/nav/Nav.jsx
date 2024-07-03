import "./nav.css";
import { Link } from "react-router-dom";

//Fake API Data.................
import CurrentUser from "../../FackApis/CurrentUserData";

//Components......................
import DarkMoode from "../darkmod/DarkMoode";

//FontAwesome Icon................
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHome, faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  faBell,
  faEnvelope,
  faUser,
} from "@fortawesome/free-regular-svg-icons";

export default function Nav() {
  return (
    <nav>
      <div className="nav-container">
        {/*............................ Nav Aria Left........................ */}
        <div className="nav-left">
          <Link to="/">
            <h3 className="logo">NetFogre</h3>
          </Link>
          <Link to="/">
            <FontAwesomeIcon icon={faHome} />
          </Link>
          <Link to="/profile/id">
            <FontAwesomeIcon icon={faUser} />
          </Link>
        </div>

        <div className="Nav-Serchbar">
          <FontAwesomeIcon
            icon={faSearch}
            style={{ color: "var(--color-primary)", paddingRight: "5px" }}
          />
          <input type="search" placeholder="Tìm kiếm bạn bè trên NetForge" />
        </div>

        {/*............................ Nav Aria Right........................ */}
        <div className="nav-right">
          <div className="topbarIconItem">
            <Link to="/chatbox">
              <FontAwesomeIcon icon={faEnvelope} />
              <span className="topbarIconBadge">2</span>
            </Link>
          </div>

          <div className="topbarIconItem">
            <Link to="/">
              <FontAwesomeIcon icon={faBell} />
              <span className="topbarIconBadge">1</span>
            </Link>
          </div>

          <DarkMoode />
          <Link to="/">
            <FontAwesomeIcon icon={faBars} />
          </Link>
          <div className="user">
            <Link to="/profile/di" className="user">
              <img src={CurrentUser.map((user) => user.ProfieImage)} alt="" />
              <h4>Trí</h4>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
