import { Link } from "react-router-dom";
import "./leftBar.css";

// Component...................
import CurrentUser from "../../FackApis/CurrentUserData";

//Icon Image....................
import Firend from "../../assets/icon/1.png";
import Groups from "../../assets/icon/2.png";
import Market from "../../assets/icon/3.png";
import Watch from "../../assets/icon/4.png";
import gallery from "../../assets/icon/5.png";
import videos from "../../assets/icon/6.png";
import message from "../../assets/icon/7.png";
import { faPepperHot } from "@fortawesome/free-solid-svg-icons";

export default function LeftBar() {
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

          <Link to="/">
            <div className="item">
              <img src={Firend} alt="" />
              <h4>Firends</h4>
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
          <h4 className="others">Online Friend</h4>

          <div className="friend">
            <div className="user">
              <img src={CurrentUser.map((user) => user.ProfieImage)} alt="" />
              <div className="green-active"></div>
            </div>
            <div className="friend-body">
              <h5>Trí</h5>
              <p>Online</p>
            </div>
          </div>

          <div className="friend">
            <div className="user">
              <img src={CurrentUser.map((user) => user.ProfieImage)} alt="" />
              <div className="green-active"></div>
            </div>
            <div className="friend-body">
              <h5>Trí</h5>
              <p>Online</p>
            </div>
          </div>

          <div className="friend">
            <div className="user">
              <img src={CurrentUser.map((user) => user.ProfieImage)} alt="" />
              <div className="green-active"></div>
            </div>
            <div className="friend-body">
              <h5>Trí</h5>
              <p>Online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
