import { useState } from 'react'
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default function Tabs(props) {
    const [currentRoute] = useState(props.default || props.tabs[0]);

    return (
        <div className="max-w-7xl mx-auto">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {props.tabs.map((tab) => (
                    <NavLink
                        key={tab.name}
                        to={tab.href}
                        exact
                        activeClassName='border-indigo-500 text-gray-900'
                        className={`${ currentRoute !== tab.href && 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
                        aria-current={tab.current ? 'page' : undefined}
                    >
                        {tab.name}
                        {tab.count ? (
                        <span
                            className={classNames(
                            tab.current ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                            'ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block'
                            )}
                        >
                            {tab.count}
                        </span>
                        ) : null}
                    </NavLink>
                ))}
            </nav>
        </div>        
    )
}

Tabs.propTypes = {
    tabs: PropTypes.array.isRequired,
    default: PropTypes.object
}
