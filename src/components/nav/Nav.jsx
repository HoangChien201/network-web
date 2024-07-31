import "./nav.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

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
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    setSearchKeyword(e.target.value);

    if (e.target.value.trim() === "") {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://network-sever-1.onrender.com/user/search?keyword=${e.target.value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
    setLoading(false);
  };

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
          <Link to={`/profile/${CurrentUser.id}`}>
            <FontAwesomeIcon icon={faUser} />
          </Link>
        </div>

        <div className="Nav-Searchbar">
          <FontAwesomeIcon
            icon={faSearch}
            style={{ color: "var(--color-primary)", paddingRight: "5px" }}
          />
          <input
            type="search"
            placeholder="Tìm kiếm bạn bè trên NetForge"
            value={searchKeyword}
            onChange={handleSearch}
          />
          {loading && <div>Loading...</div>}
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result) => (
                <Link key={result.id} to={`/profile/${result.id}`}>
                  <div className="search-result-item">
                    <img
                      src={result.avatar || "/path/to/default/avatar.jpg"}
                      alt="avatar"
                    />
                    <div>
                      <h4>{result.fullname}</h4>
                      <p>{result.email}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
            <Link to={`/profile/${CurrentUser.id}`} className="user">
              <img
                src={CurrentUser[0].avatar || "/path/to/default/avatar.jpg"}
                alt=""
              />
              <h4>{CurrentUser[0].fullname}</h4>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
