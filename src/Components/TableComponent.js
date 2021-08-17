import PropTypes from 'prop-types';

/* This example requires Tailwind CSS v2.0+ */
const people = [
    {
        Editions: '10000',
        title: '1000000',
        department: '100000000',
        email: 'BC1YLi7EJueDX2Z7sRWYgeEiXHQsMCr9ztmPHDN7LrGotQ3Z7DTWCrJ',
        image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
]

export default function Table(props) {
    const getTh = (cell) => {
        return (
            <th
                scope="col"
                key={cell}
                className="px-1 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
            >
                {cell}
            </th>
        )
    }

    const getTr = (row) => {
        return (
            <tr>{row.cells.map(cell => getTd(cell))}</tr>
        );
    }

    const getTd = (cell) => {
        return (
            <td className="px-1 py-4 text-xs">{cell}</td>
        );
    }

    return (
        <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        {props.header.map(cell => getTh(cell))}
                    </tr>
                </thead>
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
