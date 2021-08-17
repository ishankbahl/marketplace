import PropTypes from 'prop-types';

export default function StatsCard(props) {

    const getBlock = (stat) => {
        return (
            <div key={stat.name} className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                <dt className="order-2 mt-2 text-sm leading-6 font-medium text-gray-500">{stat.name}</dt>
                <dd className="order-1 text-2xl font-extrabold text-indigo-600">{stat.value}</dd>
            </div>
        );
    }

    return (
        <div className="mt-2 pb-2 bg-white sm:pb-2">
          <div className="relative">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <dl className="rounded-lg bg-white shadow-lg sm:grid md:grid-cols-4 xs:grid-cols-1">
                  {props.stats.map(stat => getBlock(stat))}
                </dl>
              </div>
            </div>
          </div>
        </div>
    )
}

StatsCard.propTypes = {
    stats: PropTypes.array
};
  