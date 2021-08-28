import React from 'react';
import HomeHero from './HomeHeroComponent';
import HomeCollection from './HomeCollectionComponent';
import AppScreenshotSection from './AppScreenshotSectionComponent';
import CtaSection from './CtaSectionComponent';
import FEATURED_ARTISTS_HOME from '../Constants/FeaturedArtistsHomeContants';
import sections from '../Constants/AppScreenshotConstants';

export default function Home() {
    return (
        <>
            <HomeHero />
            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <AppScreenshotSection {...sections[0]} />
                </div>
                <div className="col-span-12">
                    <AppScreenshotSection {...sections[1]} />
                </div>
            </div>
            <div className="grid grid-cols-12 bg-gray-50">
                <div className="col-span-12">
                    <div className="flex justify-center">
                        <h1 className="text-2xl font-medium my-10">Favourite Creators</h1>
                    </div>
                </div>
                <div className="col-start-2 col-span-10 bg-gray-50">
                    <HomeCollection creators={FEATURED_ARTISTS_HOME} />
                </div>
            </div>
            <div className="bg-gray-50 pt-20">
                <CtaSection />
            </div>
        </>
    );
}