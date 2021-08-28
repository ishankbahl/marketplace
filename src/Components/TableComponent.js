import PropTypes from 'prop-types';

export default function Table(props) {
    const getTh = (cell) => {
        return (
            <th
                scope="col"
                key={cell}
                className="px-3 py-3 text-sm whitespace-nowrap text-left font-medium text-gray-500 tracking-normal"
            >
                {cell}
            </th>
        )
    }

    const getTr = (row) => {
        return (
            <tr key={row.key}>{row.content.map(cell => getTd(cell))}</tr>
        );
    }

    const getTd = (cell) => {
        return (
            <td key={cell.key} className="whitespace-nowrap px-3 py-3 text-sm">{cell.content}</td>
        );
    }

    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-scroll sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            {!!props.header?.length && <thead>
                                <tr>
                                    {props.header.map(cell => getTh(cell))}
                                </tr>
                            </thead>}
                            <tbody className="bg-white divide-y bg-gray-50">
                                {props.rows.map((row) => getTr(row))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

Table.propTypes = {
    header: PropTypes.array,
    rows: PropTypes.array.isRequired
};
