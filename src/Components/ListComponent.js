import PropTypes from 'prop-types';

export default function List(props) {
    return (
        <ul className="divide-y divide-gray-200">
            {props.items.map((item) => (
                <li key={item.key} className="py-1 flex">
                    {item.content}
                </li>
            ))}
        </ul>
    );
}

List.propTypes = {
    items: PropTypes.array.isRequired
};
