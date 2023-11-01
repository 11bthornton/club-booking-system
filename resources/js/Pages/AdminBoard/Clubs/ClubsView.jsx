import React, { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import toast from "react-hot-toast";

import { makeStyles } from "@mui/styles";

import { faDownload, faEdit } from "@fortawesome/free-solid-svg-icons";
import moment from "moment/moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@inertiajs/inertia-react";

const useStyles = makeStyles({
    root: {
        "& .MuiDataGrid-row": {
            cursor: "pointer",
        },
        "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #E0E0E0",
        },
        "& .MuiDataGrid-columnsContainer": {
            backgroundColor: "#F5F5F5",
        },
    },
});

export default function ClubView({ auth, clubs, year }) {
    

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "name", headerName: "Name", width: 120 },
        { field: "description", headerName: "Description", width: 220 },
        {
            field: "created_at",
            headerName: "Created At",
            width: 150,
            renderCell: (params) => {
                return moment(params.value).format("YYYY-MM-DD HH:mm:ss");
            },
        },
        // {
        //     field: 'updated_at',
        //     headerName: 'Updated At',
        //     width: 200,
        //     renderCell: (params) => {
        //         return moment(params.value).format('YYYY-MM-DD HH:mm:ss');
        //     }
        // },
        {
            field: "instances",
            headerName: "Instances",
            width: 140,
            renderCell: (params) => (
                <Link
                    href={route("admin.clubs.index", {
                        id: params.row.id
                    })}
                    
                    className="text-blue-400 hover:underline"
                >
                    <div className="flex gap-2 items-center">
                        View Instances
                        <FontAwesomeIcon
                            icon={faEdit}
                            onClick={() => handleEdit(params)}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                </Link>
            ),
        },
        {
            field: "is_paid",
            headerName: "Requires Payment",
            align: "center",
            width: 140,
            renderCell: (params) => {
                if (params.value) {
                    return <FontAwesomeIcon icon={faDollarSign} />;
                }
                return "No";
            },
        },
        {
            field: "actions",
            headerName: "Actions",
            headerAlign: "center",
            width: 100,
            align: "center",
            renderCell: (params) => (
                <div className="flex gap-5 items-center">
                    <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => handleDelete(params)}
                        style={{ cursor: "pointer" }}
                    />

                    <a href={route("admin.download.club-data-id-spreadsheet", {id: params.row.id})}>
                        Download data
                    </a>

                </div>
            ),
        },
        // {
        //     field: 'openForBookings',
        //     headerName: 'Open for Bookings',
        //     headerAlign: 'center',  // you can set this to 'left', 'right', or 'center'
        //     align: "center",
        //     renderHeader: () => (
        //         <span>Open <strong>all</strong> for Bookings</span>
        //     ),
        //     width: 180,
        //     renderCell: (params) => {
        //         return (
        //             <Switch
        //                 checked={params.value}
        //                 onChange={() => handleToggle(params)}
        //                 color="primary"
        //             />
        //         );
        //     }
        // },
    ];

    

    

    

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex gap-5 align-center font-semibold text-xl text-gray-800 leading-tight">
                    <p>View Clubs</p>
                </div>
            }
        >
            <Head title="View Clubs" />
            <div className="container mx-auto p-6  mt-5 rounded-lg ">

                <div className="bg-white p-4 mb-4 rounded-lg shadow-sm">
                    <h2 className="text-4xl font-bold text-gray-900">
                        Clubs Overview - {year.year_start} / {year.year_end}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        All the clubs for the ongoing academic year. 
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md">
                    <DataGrid
                        rows={clubs}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                        components={{
                            Toolbar: GridToolbar,
                        }}
                    />
                </div>

            </div>
        </AuthenticatedLayout>
    );
}