import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Table from './TableComponent';
import { TableHeader, EditionsTableHeader } from '../Constants/BiddingTableConstants';

const rows= [
    {
        cells: ['0000', '690000W', '69000000$', 'WWWBC1YLi7EJueDX2Z7sRWYgeEiXHQsMCr9ztmPHDN7LrGotQ3Z7DTWCrJ', 'WW', 'WW'],
        id: 1
    }
];

export default function BiddingTable() {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="col-span-12 md:col-span-6 md:col-start-2">
            <Card className="cursor-pointer" onClick={() => setOpen(!open)}>
                <p className="text-lg inline">Bids</p>
                <IconButton aria-label="expand row" size="small">
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </Card>
            {open && <Table header={EditionsTableHeader} rows={rows} />}
        </div>
    );
}