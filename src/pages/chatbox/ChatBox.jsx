import "./chatbox.css";

//Component................
import Stories from "../../components/stories/Stories";
import Nav from "../../components/nav/Nav";
import Converstation from "../../components/converstation/Conversation";
import Messager from "../../components/messager/Messager";
import ChatOnline from "../../components/chatOnline/ChatOnline";

//FakeAPI....................
import CurrentUserData from "../../FackApis/CurrentUserData";

//FontAwesome...................
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleRight,
  faFileAlt,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

export default function ChatBox() {
  // const [converstation, setConversations] = useState([]);
  // const { user } = useContext(CurrentUserData);

  // useEffect(() => {
  //   const getConversations = async () => {
  //     try {
  //       const res = await axios.get("/conversations/" + user._id);
  //       setConversations(res.data)
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getConversations();
  // }, [user._id]);

  return (
    <>
      <Nav />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <div className="message-search">
              <FontAwesomeIcon icon={faSearch} />
              <input type="search" placeholder="Tìm kiếm bạn bè" />
            </div>
            <Converstation />
            <Converstation />
            <Converstation />
            <Converstation />
            <Converstation />
            <Converstation />
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            <div className="chat-box-top">
              <img
                src={CurrentUserData.map((user) => user.ProfieImage)}
                alt=""
              />
              <div className="user-name">
                <h3>{CurrentUserData.map((user) => user.name)}</h3>
                {/* <h5>{CurrentUserData.map((user) => user.username)}</h5> */}
              </div>
            </div>
            <div className="chatBoxTop">
              <Messager />
              <Messager own={true} />
              <Messager />
              <Messager own={true} />
              <Messager />
              <Messager />
              <Messager own={true} />
              <Messager />
              <Messager own={true} />
              <Messager />
              <Messager own={true} />
              <Messager />
            </div>
            <div className="chat-box-bottom">
              <form action="#">
                <input type="text" placeholder="Nhắn tin" />
                <button type="submit" className="btn btn-primary">
                  <FontAwesomeIcon icon={faArrowAltCircleRight} />
                </button>
                <label className="btn btn-primary" htmlFor="CFile">
                  <FontAwesomeIcon icon={faFileAlt} />
                  <input type="file" id="CFile" />
                </label>
              </form>
            </div>
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline />
          </div>
        </div>
      </div>

      {/* <div className="chat-box">
        <div className="chat-box-top">
          <img src={CurrentUserData.map((user) => user.ProfieImage)} alt="" />
          <div className="user-name">
            <h3>{CurrentUserData.map((user) => user.name)}</h3>
            <h5>{CurrentUserData.map((user) => user.username)}</h5>
          </div>
        </div>
        <div className="chat-box-bottom">
          <form action="#">
            <input type="text" placeholder="Nhắn tin" />
            <button type="submit" className="btn btn-primary">
              <FontAwesomeIcon icon={faArrowAltCircleRight}/>
            </button>
            <label className="btn btn-primary" htmlFor="CFile">
              <FontAwesomeIcon icon={faFileAlt}/>
              <input type="file" id="CFile" />
            </label>
          </form>
        </div>
      </div> */}
    </>
  );
}
