import { LazyLoadImage, trackWindowScroll } from 'react-lazy-load-image-component';

function AppScreenshotSection(props) {
    return (
        <div className="relative bg-gray-50 py-10">
            <div className="mx-auto max-w-md px-4 text-center sm:px-6 sm:max-w-3xl lg:px-8 lg:max-w-7xl">
              <div>
                <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                    {props.heading}
                </p>
                <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
                    {props.text}
                </p>
              </div>
              <div className="mt-12">
                <LazyLoadImage 
                    className="rounded-lg shadow-xl ring-1 ring-black ring-opacity-5"
                    src={props.src}
                    alt="app screenshot"
                    scrollPosition={props.scrollPosition}
                    threshold={100}
                    height={700}
                    width={1200}
                />
              </div>
            </div>
        </div>
    );
}

export default trackWindowScroll(AppScreenshotSection);