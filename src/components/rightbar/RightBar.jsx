import './rightBar.css'

//Components.................
import Message from '../message/Message'
import FirenReqe from '../firenReqe/FirenReqe'

export default function RightBar() {
  return (
    <div className='rightBar'>
      <div className="rightbar-container">
        {/* <Message/> */}
        <FirenReqe/>
      </div>
    </div>
  )
}
