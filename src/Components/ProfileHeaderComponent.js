import PropTypes from 'prop-types';
import { GET_PROFILE_IMAGE, PROFILE_IMAGE_FALLBACK, PROFILE_IMAGE_FALLBACK_URL } from '../Constants/Routes';
import StatsCard from './StatsCardComponent';
import FollowButton from './FollowComponent';

export default function ProfileHeader(props) {

  return (
    <div>
      <div>
        {/* make lg:h-48 */}
        <div className="h-32 w-full object-cover lg:h-32 bg-gradient-to-r from-indigo-500" alt="banner" ></div> 
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-12 sm:-mt-16 flex justify-center">
          <div className="flex">
            {props.profile?.publicKey && <img alt="profile" className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32" src={GET_PROFILE_IMAGE + props.profile?.publicKey + PROFILE_IMAGE_FALLBACK} />}
            {!props.profile?.publicKey && <img alt="fallback profile" className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32" src={PROFILE_IMAGE_FALLBACK_URL} />}
          </div>
        </div>
        <div className="flex justify-center mt-1">
          <h1 className="text-2xl font-bold text-gray-900 truncate">{props.profile?.username}</h1>
        </div>
        <div className="flex justify-center mt-1">
          <StatsCard stats={props.stats} />
        </div>
        <div className="grid grid-cols-12 my-3">
          <div className="col-span-12">
            <div className="flex justify-center">
              <pre className="text-center text-sm text-gray-600 whitespace-pre-wrap font-sans">{props.profile?.description}</pre>
            </div>
          </div>
        </div>
        {!!props.followStatus && <div className="grid grid-cols-12 mt-1">
          <div className="col-span-12">
            <div className="flex justify-center">
              <FollowButton publicKey={props.profile?.publicKey}
                followedContent={<button
                  type="button"
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Unfollow
                </button>}
                notFollowedContent={<button
                  type="button"
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Follow
                </button>}
                isFollowed={props.followStatus.isFollowing} />
            </div>
          </div>
        </div>}
      </div>
    </div>
  )
}

ProfileHeader.propTypes = {
  profile: PropTypes.object,
  stats: PropTypes.array
}
