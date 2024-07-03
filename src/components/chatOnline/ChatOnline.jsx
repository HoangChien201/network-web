import "./chatOnline.css";

//FakeAPI....................
import CurrentUserData from "../../FackApis/CurrentUserData";

export default function ChatOnline() {
  return (
    <div className="chatOnline">
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img
            className="chatOnlineImg"
            src={CurrentUserData.map((user) => user.ProfieImage)}
            alt=""
          />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">
          {CurrentUserData.map((user) => user.name)}
        </span>
      </div>
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img
            className="chatOnlineImg"
            src={CurrentUserData.map((user) => user.ProfieImage)}
            alt=""
          />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">
          {CurrentUserData.map((user) => user.name)}
        </span>
      </div>
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img
            className="chatOnlineImg"
            src={CurrentUserData.map((user) => user.ProfieImage)}
            alt=""
          />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">
          {CurrentUserData.map((user) => user.name)}
        </span>
      </div>
    </div>
  );
}
