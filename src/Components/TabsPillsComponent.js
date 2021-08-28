import PropTypes from 'prop-types';

  
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function TabsPills(props) {
    return (
        <div>
            <div className="sm:block">
                <nav className="flex space-x-4" aria-label="Tabs">
                    {props.tabs.map((tab) => (
                        <div
                            key={tab.name}
                            onClick={() => props.onTabClick(tab.name)}
                            className={classNames(
                                tab.name === props.current ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700',
                                'px-1.5 py-1 font-medium text-sm rounded-md whitespace-nowrap cursor-pointer'
                            )}
                            aria-current={tab.name === props.current ? 'page' : undefined}
                        >
                            {tab.name}
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    )
}

TabsPills.propTypes = {
    tabs: PropTypes.array,
    onTabClick: PropTypes.func
}
  