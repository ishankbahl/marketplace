import { GET_PROFILE_IMAGE, PROFILE_IMAGE_FALLBACK } from "../Constants/Routes";
import { useHistory } from "react-router-dom";

const nft = {
    image: "https://images.bitclout.com/91275b78ccf299e29ba7e4088cd7e06cae43fe573fe15a7bdab7f16db3ac63fa.webp",
    publicKey: "BC1YLfzL4FNZJ8k1xCVvVAA3UeMoQApG9V7VW1aVW9yAQdRNzHfqSWg",
    hash: "73a93b7fe4b73ac38350d5a610ded3382705d9518812c318894f54c1996c52d5",
    creatorName: "Ghozt",
};

export default function HeroNftComponent() {
    const history = useHistory();

    const changeUrl = (e, url) => {
        e.stopPropagation();
        history.push(url);
    }

    return (
        <div className="my-1 mx-3 sm:mt-10 lg:col-span-6">
            <div className="bg-white sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden shadow-lg">
                <div onClick={(e) => changeUrl(e, `/nft/${nft.hash}`)} className="shadow-lg rounded-lg cursor-pointer transition hover:-translate-y-1 ease-in-out transform">
                    <div className="aspect-w-1 aspect-h-1">
                        <img alt="featured" className="object-cover shadow-lg rounded-t-lg" src={nft.image} />
                    </div>
                    <div className="flex-1 bg-white p-3 flex flex-col justify-between rounded-lg">
                        <div className="text-xs font-medium grid grid-cols-1 inline">
                            <p className="text-gray-900 inline hover:underline" onClick={(e) => changeUrl(e, `/profile/${nft.publicKey}`)}>
                                <img
                                    alt="profile"
                                    className="inline h-8 w-8 rounded-full mr-1"
                                    src={GET_PROFILE_IMAGE + nft.publicKey + PROFILE_IMAGE_FALLBACK}
                                />
                                <span className="text-base inline align-middle">{nft.creatorName}</span>
                                {/* <BadgeCheckIcon className="flex-shrink-0 h-4 w-4 text-blue-500 inline align-middle" aria-hidden="true" /> */}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}