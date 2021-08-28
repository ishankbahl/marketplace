import TrendsList from "./TrendsListComponent";
import TabsPills from './TabsPillsComponent';
import { useState, useEffect } from "react";
import fetchUtil from "../utils/fetchUtil";
import { GET_TRENDS } from "../Constants/Routes";
import { CONTENT_TYPE, APPLICATION_JSON } from "../Constants";
import LoaderComponent from "./LoaderComponent";

const TIMEFRAMES = {
    ONE_DAY: '1d',
    SEVEN_DAYS: '7d',
    MONTH: '30d',
    ALL_TIME: 'All time'
}

const CREATORS = "creators";

const COLLECTORS = "collectors";

const TIMEFRAMES_ENDPOINT_MAPPER = {
    [TIMEFRAMES.ONE_DAY]: 'today',
    [TIMEFRAMES.SEVEN_DAYS]: 'week',
    [TIMEFRAMES.MONTH]: 'month',
    [TIMEFRAMES.ALL_TIME]: 'alltime',
}

const tabs = [
    { name: TIMEFRAMES.ONE_DAY },
    { name: TIMEFRAMES.SEVEN_DAYS },
    { name: TIMEFRAMES.MONTH },
    { name: TIMEFRAMES.ALL_TIME },
];

export default function Trends() {
    const [collectors, setCollectors] = useState({});
    const [creators, setCreators] = useState({});
    const [creatorTab, setCreatorTab] = useState('1d');
    const [collectorTab, setCollectorTab] = useState('1d');
    const [isCreatorLoading, setCreatorLoading] = useState(false);
    const [isCollectorLoading, setCollectorLoading] = useState(false);

    const getTrends = (group, time) => {
        if(group === CREATORS && creators[time]) {
            return;
        }
        else if(group === COLLECTORS && collectors[time]){
            return;
        }

        if(group === CREATORS && !isCreatorLoading) {
            setCreatorLoading(true);
        }
        else if(group === COLLECTORS && !isCollectorLoading) {
            setCollectorLoading(true);
        }

        fetchUtil(`${GET_TRENDS}/${group}/${TIMEFRAMES_ENDPOINT_MAPPER[time]}/20`, {
            method: 'GET',
            headers: {
              [CONTENT_TYPE]: APPLICATION_JSON
            }
        }, () => {}, (data) => {
            if(group === CREATORS) {
                setCreators({
                    ...creators,
                    [time]: data
                });
                setCreatorLoading(false);
            }
            else {
                setCollectors({
                    ...collectors,
                    [time]: data
                })
                setCollectorLoading(false);
            }
        }, () => {/** failure code */});
    }

    useEffect(() => {
        getTrends(CREATORS, TIMEFRAMES.ONE_DAY);
        getTrends(COLLECTORS, TIMEFRAMES.ONE_DAY);
    }, []);

    const setCollectorTabWrapper = (time) => {
        getTrends(COLLECTORS, time);
        setCollectorTab(time);
    }

    const setCreatorTabWrapper = (time) => {
        getTrends(CREATORS, time);
        setCreatorTab(time);
    }

    return (
        <>
            <div>
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:justify-between">
                    <div className="w-full">
                        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl flex justify-center">
                            Trends
                        </h2>
                        <p className="mt-5 text-xl text-gray-500 flex justify-center">
                            The top creators and collectors on Oble, ranked by volume.
                        </p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-12 max-w-7xl mx-auto">
                <div className="my-10 mx-4 md:col-span-6 col-span-12">
                    <div className="text-3xl mb-4 flex justify-center">Top Creators</div>
                    <div className="flex justify-center">
                        <TabsPills tabs={tabs} current={creatorTab} onTabClick={setCreatorTabWrapper} />
                    </div>
                    <div className="my-4 text-gray-400 flex justify-center">Total Sales</div>
                    {!!creators[creatorTab]?.length && <TrendsList items={creators[creatorTab]} />}
                    {isCreatorLoading && 
                        <div style={{ marginBottom: '2000px' }} className="flex justify-center mt-10">
                            <LoaderComponent />
                        </div>}
                </div>
                <div className="my-10 mx-4 md:col-span-6 col-span-12">
                    <div className="text-3xl mb-4 flex justify-center">Top collectors</div>
                    <div className="flex justify-center">
                        <TabsPills tabs={tabs} current={collectorTab} onTabClick={setCollectorTabWrapper} />
                    </div>

                    <div className="my-4 text-gray-400 flex justify-center">Total Spent</div>
                    {!!collectors[collectorTab]?.length && <TrendsList items={collectors[collectorTab]} />}
                    {isCollectorLoading && 
                        <div style={{ marginBottom: '2000px' }} className="flex justify-center mt-10">
                            <LoaderComponent />
                        </div>}
                </div>
            </div>
        </>
    );
}