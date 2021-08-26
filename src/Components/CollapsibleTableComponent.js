import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Table from './TableComponent';
import EmptyStateComponent from './EmptyStateComponent';

export default function CollapsibleTable(props) {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
                <li className="px-4 py-4 grid grid-cols-2 cursor-pointer" onClick={() => setOpen(!open)}>
                    <h2 className="col-span-1">{props.tableHeading}</h2>
                    <div className="flex justify-end">
                        {props.actionButton}
                        <IconButton aria-label="expand row" size="small">
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </div>
                </li>
                {open && 
                <li>
                    {!!props.rows.length && <Table header={props.header} rows={props.rows} />}
                    {!props.rows.length && <div className="m-4"><EmptyStateComponent content={props.zerRowsMessage} /></div>}
                </li>}
            </ul>
        </div>
    );
}

CollapsibleTable.propTypes = {
    tableHeading: PropTypes.element.isRequired,
    header: PropTypes.array,
    rows: PropTypes.array.isRequired,
    zerRowsMessage: PropTypes.string,
    actionButton: PropTypes.element
}