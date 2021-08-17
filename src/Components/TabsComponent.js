import { useState } from 'react'
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';


export default function Tabs(props) {
    const [currentRoute] = useState(props.default || props.tabs[0]);

    return (
        <div className="mt-2">
            <div className="border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {props.tabs.map((tab) => (
                        <NavLink
                            key={tab.name}
                            to={tab.href}
                            exact
                            activeClassName='border-indigo-500 text-gray-900'
                            className={`${ currentRoute !== tab.href && 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            aria-current={tab.current ? 'page' : undefined}
                        >
                            {tab.name}
                        </NavLink>
                    ))}
                </nav>
                </div>
            </div>
        </div>          
    )
}

Tabs.propTypes = {
    tabs: PropTypes.array.isRequired,
    default: PropTypes.object
}
