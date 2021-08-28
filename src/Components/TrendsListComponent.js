import { GET_PROFILE_IMAGE, PROFILE_IMAGE_FALLBACK } from "../Constants/Routes";
import { useHistory } from "react-router-dom";
import CloutIcon from "../Icons/CloutIcon";

export default function TrendsList(props) {
    const history = useHistory();

    const changeUrl = (url) => {
        history.push(url);
    }

    return (
        <ul className="space-y-3">
            {props.items.map((item) => (
                <li key={(item.SellerKey || item.BidderKey)} className="bg-white shadow overflow-hidden rounded-md cursor-pointer" onClick={() => changeUrl(`/profile/${(item.SellerKey || item.BidderKey)}`)}>
                    <div className="px-6 py-4 grid grod-cols-12">
                        <div>
                            <img
                                className="inline h-10 w-10 rounded-full mr-1 align-top cursor-pointer"
                                src={GET_PROFILE_IMAGE + (item.SellerKey || item.BidderKey) + PROFILE_IMAGE_FALLBACK}
                                alt="profile"
                            />
                            <div className="hover:underline inline cursor-pointer text-base ml-1">{item.Seller || item.Username}</div>
                        </div>
                        <div className="col-end-13">
                            <div className="text-md">
                                <CloutIcon size={13} />{item.VolumeClout}
                            </div>
                            <div className="text-sm text-gray-400">{item.VolumeUsd}</div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}