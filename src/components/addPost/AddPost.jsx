import './addPost.css'

//FakeAPI..........................
import CurrentUserData from "../../FackApis/CurrentUserData";

//FontAwesome........................
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faSmile, faTag, faVideo } from '@fortawesome/free-solid-svg-icons';

export default function AddPost() {
  return (
    <form className='postForm'>

        <div className="user form-top">
            <img src={CurrentUserData.map(user=>(user.ProfieImage))} alt="" />
            <input type="text" placeholder="Bạn đang nghĩ gì?" />
            <button type='submit' className='btn btn-primary'>ĐĂNG</button>
        </div>

        <div className="post-categories">
            <label htmlFor="file">
                <input type="file" id='file'/>
                <span><FontAwesomeIcon icon={faImage}/>Ảnh</span>
            </label>

            <label htmlFor="file">
                <input type="file" id='file'/>
                <span><FontAwesomeIcon icon={faVideo}/>Video</span>
            </label>

            <span><FontAwesomeIcon icon={faTag}/>Tag</span>
            <span><FontAwesomeIcon icon={faSmile}/>Cảm xúc</span>

        </div>

    </form>
  )
}
