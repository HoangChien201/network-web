import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./leftBar.css";

// Component...................
import CurrentUser from "../../FackApis/CurrentUserData";

// Icon Image....................
import Firend from "../../assets/icon/1.png";
import Groups from "../../assets/icon/2.png";
import Market from "../../assets/icon/3.png";
import Watch from "../../assets/icon/4.png";
import gallery from "../../assets/icon/5.png";
import videos from "../../assets/icon/6.png";
import message from "../../assets/icon/7.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonThroughWindow, faPowerOff } from "@fortawesome/free-solid-svg-icons";

export default function LeftBar() {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.post(
          "https://network-sever-1.onrender.com/friendship/get-all",
          { status: 2 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        setFriends(response.data);
      } catch (error) {
        console.error("Error fetching friends data:", error);
        if (error.response) {
          setError(
            `Error: ${error.response.status} - ${error.response.data.message}`
          );
        } else if (error.request) {
          setError("No response received from server.");
        } else {
          setError("An unexpected error occurred.");
        }
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="leftBar">
      <div className="left-container">
        <div className="menu">
          <Link to="/profile/id">
            <div className="user">
              <img src={CurrentUser.map((user) => user.ProfieImage)} alt="" />
              <h4>Trí</h4>
            </div>
          </Link>

          <div className="item">
            <button
              onClick={() => {
                localStorage.clear("token");
                navigate("/login");
              }}
            >
              <FontAwesomeIcon icon={faPowerOff} />
            </button>
          </div>

          <Link to="/">
            <div className="item">
              <img src={Firend} alt="" />
              <h4>Friends</h4>
            </div>
          </Link>

          <Link to="/">
            <div className="item">
              <img src={Groups} alt="" />
              <h4>Groups</h4>
            </div>
          </Link>

          <Link to="/">
            <div className="item">
              <img src={Market} alt="" />
              <h4>Market</h4>
            </div>
          </Link>

          <Link to="/">
            <div className="item">
              <img src={Watch} alt="" />
              <h4>Watch</h4>
            </div>
          </Link>
        </div>

        <hr />

        <div className="menu">
          <h4 className="others">Your Shortcuts</h4>

          <Link to="/">
            <div className="item">
              <img src={gallery} alt="" />
              <h4>Gallery</h4>
            </div>
          </Link>

          <Link to="/">
            <div className="item">
              <img src={videos} alt="" />
              <h4>Videos</h4>
            </div>
          </Link>

          <Link to="/chatbox/id">
            <div className="item">
              <img src={message} alt="" />
              <h4>Message</h4>
            </div>
          </Link>
        </div>

        <hr />

        <div className="menu">
          <h4 className="others">List Friend</h4>
          {error ? (
            <div className="error-message">{error}</div>
          ) : (
            friends.map((friend) => (
              <div className="friend" key={friend.id}>
                <div className="user">
                  <img src={friend.user.avatar} alt="" />
                  {/* <div className="green-active"></div> */}
                </div>
                <div className="friend-body">
                  <h5>{friend.user.fullname}</h5>
                  {/* <p>Online</p> */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
