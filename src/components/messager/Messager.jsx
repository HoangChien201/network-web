import "./messager.css";

//FakeAPI....................
import CurrentUserData from "../../FackApis/CurrentUserData";

export default function Messager({ own }) {
  return (
    <div className={own ? "messager own" : "messager"}>
      <div className="messagerTop">
        <img
          src={CurrentUserData.map((user) => user.ProfieImage)}
          alt=""
          className="messagerImg"
        />
        <p className="messagerText">Hê xờ lô lô hê xờ li li</p>
      </div>
      <div className="messagerBottom">1 giờ trước</div>
    </div>
  );
}
