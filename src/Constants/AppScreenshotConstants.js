import appScreenShot from '../assets/appScreenShot.jpg';
import trendsScreenshot from '../assets/trendsScreenshot.jpg';
import { Link } from 'react-router-dom';

const sections = [
    {
        src: appScreenShot,
        heading: "Viewing NFTs made easy",
        text: "Browse any user's NFTs with a simple viewing experience on both mobile and desktop."
    },
    {
        src: trendsScreenshot,
        heading: <>See all the stats on <Link to="/trends" className="underline">Trends</Link> page</>,
        text: ""
    }
];

export default sections;