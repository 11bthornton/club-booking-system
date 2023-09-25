import { useState } from 'react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import Chip from '@mui/material/Chip';
import { Button } from '@mui/material';
import { faRightLeft, faTrash } from '@fortawesome/free-solid-svg-icons';


export default function ClubShow({ auth, students }) {

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manage Students</h2>}
        >

            <Head title="Students" />

            <div className='container mx-auto p-6 bg-white mt-5 rounded-lg shadow-lg'>
                
                <div>
                    <p className="text-3xl mb-4">Manage Students</p>
                </div>

                <UserDataGrid
                    studentData={students}
                />

            </div>

        </AuthenticatedLayout>
    );
}

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {Menu, MenuItem} from '@mui/material';

const ClubChip = ({ club }) => {
    const [anchorEl, setAnchorEl] = useState(null);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <>
        {club ? (
          <Chip
            label={<strong>{club.club}</strong>}
            onClick={handleClick}
            color="success"
          />
        ) : (
          <Chip
            label={<strong>None</strong>}
            variant="outlined"
            onClick={handleClick}
          />
        )}
        <Menu
          className='mt-2'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          style={{
            width: "400px"
          }}
        >
          <MenuItem onClick={handleClose}>
            <div className="flex gap-5 items-center w-full">
                <div>Remove Booking</div>
                <FontAwesomeIcon 
                    icon={faTrash}
                />
            </div>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <div className="flex w-full justify-between items-center">
                <div>Swap Booking</div>
                <FontAwesomeIcon 
                    icon={faRightLeft}
                />
            </div>
          </MenuItem>
        </Menu>
      </>
    );
  };

function TermDayColumn(term, day) {
    return {
        field: `term_${term}_${day}`,
        headerName: `${term} - ${day}`,
        width: 80,
        renderCell: (params) => {
            console.log("here,", params.row);
            const club = params.row.organized_by_term[term][day];

            return (
                <ClubChip 
                    club={club}
                />
            );
        }
    }
}

function UserDataGrid({ studentData }) {

    // Define the columns
    const columns = [

        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'username', headerName: 'Username', width: 100 },
        { field: 'year', headerName: 'Year', width: 100 },
        
        TermDayColumn("1", "Wednesday"),
        TermDayColumn("1", "Friday"),
        
        TermDayColumn("2", "Wednesday"),
        TermDayColumn("2", "Friday"),
        
        TermDayColumn("3", "Wednesday"),
        TermDayColumn("3", "Friday"),
        
        TermDayColumn("4", "Wednesday"),
        TermDayColumn("4", "Friday"),

        TermDayColumn("5", "Wednesday"),
        TermDayColumn("5", "Friday"),

        TermDayColumn("6", "Wednesday"),
        TermDayColumn("6", "Friday"),

        {
            field: "count_chosen",
            headerName: "Number Chosen",
            renderCell: (params) => {
                const row = params.row;
                const count = Object.values(row.organized_by_term)
                    .flatMap(day => Object.values(day))
                    .filter(x => x)
                    .length

                return (
                    <Chip
                        label={`${count}`}
                        // variant="outlined"
                        color={count === 0 ? 'error' : count < 12 ? 'warning' : 'success'}
                        onClick={() => { }}
                    // className='cursor-pointer'
                    />
                );
            }
        },

        {
            field: 'actions',
            headerName: 'Actions',
            align: "right",
            renderCell: (params) => {
                return (
                    <Button color='error'>
                        Delete
                    </Button>
                );
            }
        }

    ]

    return (
        <DataGrid
            rows={studentData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            components={{
                Toolbar: GridToolbar
            }}
        />
    )

}