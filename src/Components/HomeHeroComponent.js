import HeroNftComponent from "./HeroNftComponent";
import { Link } from 'react-router-dom';
import { useState } from "react";
import GetFeaturedModal from './GetFeaturedModalComponent';

export default function HomeHero() {
    const [show, showModal] = useState(false);
    return (
        <div className="relative bg-gray-50">
        <main className="lg:relative">
            <div className="mx-auto max-w-7xl w-full pt-5 pb-1 text-center lg:pt-36 lg:pb-32 lg:text-left">
                <div className="px-4 lg:w-1/2 sm:px-8 xl:pr-16">
                    <h1 className="text-4xl tracking-tight font-semibold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                        <span className="block xl:inline">Discover, collect, and sell extraordinary NFTs</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                        on BitClout's first & largest NFT marketplace
                    </p>
                    <div className="mt-5 sm:flex sm:justify-center lg:justify-start">
                        <div className="rounded-md shadow">
                            <Link
                                to="/discover"
                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                            >
                                Discover
                            </Link>
                        </div>
                        <div className="mt-3 sm:mt-0 sm:ml-3">
                            <Link
                                to="/trends"
                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                            >
                                Trends
                            </Link>
                        </div>
                    </div>
                    <p className="text-indigo-600 hover:text-indigo-900 cursor-pointer mt-3 mb-3" onClick={() => showModal(true)}>Get featured on the homepage</p>
                    <GetFeaturedModal show={show} showModal={showModal} />
                </div>
            </div>
            <div className="relative w-full lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:h-full pb-10">
                <HeroNftComponent />
            </div>
        </main>
        </div>
    )
}
