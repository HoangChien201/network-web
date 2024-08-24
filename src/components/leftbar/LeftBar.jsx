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
import {
  faDoorOpen,
  faPersonThroughWindow,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import { url } from "../../contants/url";

export default function LeftBar() {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not found");
        return;
      }

      try {
        const response = await axios.get(
          `${url}/user/get-one/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data);
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();

    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.post(
          `${url}/friendship/get-all`,
          { status: 2 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Danh sách bạn bè",response.data);
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

  if (error) {
    return <div>{error}</div>;
  }

  if (!currentUser) {
    return <div>{error}</div>; // Hoặc bất kỳ thông báo nào bạn muốn hiển thị khi chưa có thông tin người dùng
  }

  return (
    <div className="leftBar">
      <div className="left-container">
        <div className="menu">
          <Link to={`/profile/${currentUser.id}`}>
            <div className="user">
              <img
                src={currentUser.avatar || "CurentProfile.jpeg"}
                alt=""
              />
              <h4>{currentUser.fullname}</h4>
            </div>
          </Link>

          <div className="item">
            <button
              onClick={() => {
                localStorage.clear("token");
                navigate("/login");
              }}
            >
              <FontAwesomeIcon icon={faDoorOpen} />
            </button>
          </div>

          {/* <Link to="/">
            <div className="item">
              <img src={Firend} alt="" />
              <h4>Friends</h4>
            </div>
          </Link> */}

          {/* <Link to="/">
            <div className="item">
              <img src={Groups} alt="" />
              <h4>Groups</h4>
            </div>
          </Link> */}

          {/* <Link to="/">
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
          </Link> */}
        </div>

        <hr />

        {/* <div className="menu">
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
        </div> */}

        {/* <hr /> */}

        <div className="menu">
          <h4 className="others">Danh sách bạn bè</h4>
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
