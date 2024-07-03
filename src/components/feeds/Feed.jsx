import "./feeds.css";

import { Link } from "react-router-dom";

//Component....................
import Comments from "../comments/Comments";

//FontAwesome..................
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart, faListDots, faShare } from "@fortawesome/free-solid-svg-icons";

//States..............
import { useState } from "react";

export default function Feed({ fed }) {

//States Discure.............
let [openComment, setOpenComment] = useState(false);
const CommentHandeler =()=>{
    setOpenComment(!openComment)
}

const [like,setLike] = useState(fed.like)
const [isLiked,setIsLiked] = useState(false)

const likeHandler =()=>{
  setLike(isLiked ? like-1 : like+1)
  setIsLiked(!isLiked)
}


  return (
    <div className="feed" key={fed.id}>
      <div className="top-content">
        <Link to="/profile/id">
          <div className="user">
            <img src={fed.feedProfile} />
            <div>
              <h5>{fed.name}</h5>
              <small>1 Minutes Ago</small>
            </div>
          </div>
        </Link>
        <span>
          <FontAwesomeIcon icon={faListDots} />
        </span>
      </div>
      <div className="mid-comtent">
        <p>{fed.desc}</p>
        <img src={fed.feedImage} />
      </div>
      <div className="bottom-content">
        <div className="action-item">
            <span className="like" onClick={likeHandler}><FontAwesomeIcon icon={faHeart} />{like} like</span>
        </div>
        <div className="action-item" onClick={CommentHandeler}>
            <span><FontAwesomeIcon icon={faComment}/>2 Comment</span>
        </div>
        <div className="action-item">
            <span><FontAwesomeIcon icon={faShare}/>11 Share</span>
        </div>
      </div>
      {openComment && <Comments/>}
    </div>
  );
}
