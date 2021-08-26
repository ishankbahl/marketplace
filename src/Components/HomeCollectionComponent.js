import { Link } from 'react-router-dom';
import { LazyLoadImage, trackWindowScroll } from 'react-lazy-load-image-component';

function HomeCollection(props) {

    const handleImageError = (creator) => {
        creator.imageUrls = creator.fallbackUrl;
        props.setCreators?.([...props.creators]);
    }

    return (
        <ul className="max-w-7xl mx-auto sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5">
            {props.creators.map((creator) => (
                <li key={creator.publicKey} className="my-3 shadow-lg rounded-lg transition hover:-translate-y-1 ease-in-out transform">
                    <Link className="shadow-lg rounded-lg cursor-pointer transition hover:-translate-y-1 ease-in-out transform" to={`/profile/${creator.publicKey}/created`}>
                        <div className="aspect-w-1 aspect-h-1">
                            <LazyLoadImage 
                                className="object-cover rounded-t-lg shadow-lg"
                                src={creator.imageUrl}
                                alt="creator work"
                                onError={() => handleImageError(creator)}
                                scrollPosition={props.scrollPosition}
                                threshold={400}
                                height={387}
                                width={387}
                            />
                        </div>
                        <div className="flex-1 p-3 flex flex-col justify-between rounded-b-lg" style={{backgroundColor: creator.color}}>
                            <div className="text-lg font-medium grid grid-cols-1 inline">
                                <p className={(creator.textDark ? "text-black" : "text-white" ) + " inline flex justify-center"}>
                                    {creator.username}
                                    {/* <BadgeCheckIcon className="flex-shrink-0 h-4 w-4 text-blue-500 inline align-middle" aria-hidden="true" /> */}
                                </p>
                            </div>
                            <div className="text-sm m-5">
                                <span className={(creator.textDark ? "text-black" : "text-white" ) + " flex justify-center text-center"}>
                                    <div className={(creator.textDark ? "border-black" : "border-white" ) + " border-2 px-2 py-1 rounded-md"}>View</div>
                                </span>
                            </div>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default trackWindowScroll(HomeCollection);