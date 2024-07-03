import "./conversation.css"

//FakeAPI....................
import CurrentUserData from "../../FackApis/CurrentUserData";

export default function Converstation() {
  return (
    <div className="conversation">
        <img className="conversationImg" src={CurrentUserData.map((user) => user.ProfieImage)} alt="" />
        <span className="conversationName">{CurrentUserData.map((user) => user.name)}</span>
    </div>
  )
}
