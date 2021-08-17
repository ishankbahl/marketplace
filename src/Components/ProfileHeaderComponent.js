import PropTypes from 'prop-types';
import { GET_PROFILE_IMAGE, PROFILE_IMAGE_FALLBACK, PROFILE_IMAGE_FALLBACK_URL } from '../Constants/Routes';
import StatsCard from './StatsCardComponent';

const profile = {
  backgroundImage:
    'https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
}

export default function ProfileHeader(props) {

  return (
    <div>
      <div>
        <img className="h-32 w-full object-cover lg:h-48" src={profile.backgroundImage} alt="" />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-12 sm:-mt-16 flex justify-center">
          <div className="flex">
            {props.profile?.publicKey && <img className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32" src={GET_PROFILE_IMAGE + props.profile?.publicKey + PROFILE_IMAGE_FALLBACK} />}
            {!props.profile?.publicKey && <img className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32" src={PROFILE_IMAGE_FALLBACK_URL} />}
          </div>
        </div>
        <div className="flex justify-center mt-1">
          <h1 className="text-2xl font-bold text-gray-900 truncate">{props.profile?.username}</h1>
        </div>
        <div className="flex justify-center mt-1">
          <StatsCard stats={props.stats} />
        </div>
        <div className="grid grid-cols-12 mt-1">
          <div className="col-span-12">
            <div className="flex justify-center">
              <pre className="text-center text-sm text-gray-600 whitespace-pre-wrap overflow-x-auto">{props.profile?.description}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ProfileHeader.propTypes = {
  profile: PropTypes.object,
  stats: PropTypes.array
}
