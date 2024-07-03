import './feeds.css'

//Component..................
import Feed from './Feed'

//FakeAPI..................
import HomeFeedData from '../../FackApis/HomeFeedData'

export default function Feeds() {
  return (
    <div className='feeds'>
        {
            HomeFeedData.map(fed=>(
                <Feed fed={fed} key={fed.key}/>
            ))
        }
    </div>
  )
}
