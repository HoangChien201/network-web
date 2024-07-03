import "./comments.css";
import { Link } from "react-router-dom";

//FakeAPI.............................
import CommentData from "../../FackApis/CommetData";
import CurrentUserData from "../../FackApis/CurrentUserData";

export default function Comments() {
  return (
    <div className="comments">
      <div className="writebox">
        <form action="#">
          <div className="user">
            <img src={CurrentUserData.map((user) => user.ProfieImage)} alt="" />
            <input type="text" placeholder="Viết bình luận" />
            <button type="submit" className="btn btn-primary">
              Gửi
            </button>
          </div>
        </form>
      </div>
      {CommentData.map((comment) => (
        <Link to="/profile/id">
          <div className="user" key={comment.id}>
            <img src={comment.ProfieImage} alt="" />
            <div>
              <h5>{comment.name}</h5>
              <p>{comment.CommeText}</p>
              <small>Thích</small>
              <small>Trả lời</small>
            </div>
            <small>1h</small>
          </div>
        </Link>
      ))}
    </div>
  );
}
