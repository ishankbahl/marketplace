import { PropTypes } from 'prop-types';

export default function EmptyStateComponent(props) {
    return (
      <span
        type="span"
        className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {props.icon}
        <span className="mt-2 block text-sm font-medium text-gray-900">{props.content}</span>
      </span>
    )
}

EmptyStateComponent.propTypes = {
    content: PropTypes.string,
    icon: PropTypes.element
};