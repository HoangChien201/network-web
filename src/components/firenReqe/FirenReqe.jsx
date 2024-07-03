import "./firenReqe.css";
import { Link } from "react-router-dom";

//FakeAPI..........................
import FirendReqData from "../../FackApis/FirendReqData";

export default function FirenReqe() {
  return (
    <div className="Firend-Requests">
      <h4>Firend Requests</h4>

      {
      FirendReqData.map((firend) => (
        <div className="request">
          <Link to='/profile/id'>
          <div className="info" key={firend.id}>
            <div className="user">
                <img src={firend.img} alt="" />
                <h5>{firend.name}</h5>
            </div>
            <div className="info-name">
                <p>{firend.info}</p>
            </div>
          </div>
          </Link>

          <div className="action">
            <button className="btn btn-green">Đồng Ý</button>
            <button className="btn btn-red">Từ Chối</button>
          </div>
        </div>
      ))
      }
    </div>
  );
}
