import { useState } from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
    Dialog,
    DialogBody,
    DialogHeader,
    DialogFooter,
    Chip,
    Button,
} from "@material-tailwind/react";

import {
    faEdit,
    faRightLeft,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function ClubShow({ auth, students }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manage Students
                </h2>
            }
        >
            <Head title="Students" />

            <div className="container mx-auto p-6 bg-white mt-5 rounded-lg shadow-lg">
                <div>
                    <p className="text-3xl mb-4">Manage Students</p>
                </div>

                <UserDataGrid studentData={students} />
            </div>
        </AuthenticatedLayout>
    );
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Menu, MenuItem } from "@mui/material";

function UserDataGrid({ studentData }) {
    // Define the columns
    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "username",
            headerName: "Username",
            width: 150,
            renderCell: (params) => (
                <a
                    href={`/admin/students/${params.row.id}`}
                    className="text-blue-500 hover:underline"
                >
                    <div className="flex gap-2 items-center">
                        {params.row.username}
                        <FontAwesomeIcon
                            icon={faEdit}
                            onClick={() => handleEdit(params)}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                </a>
            ),
        },
        { field: "year", headerName: "Year", width: 100 },

        {
            field: "count_chosen",
            headerName: "Number Chosen",
            width: 150,
            renderCell: (params) => {
                const row = params.row;
                const count = Object.values(row.organized_by_term)
                    .flatMap((day) => Object.values(day))
                    .filter((x) => x).length;

                return (
                    <Chip
                        value={`${count} Booked`}
                        // variant="outlined"
                        color={
                            count === 0
                                ? "red"
                                : count < 12
                                ? "orange"
                                : "green"
                        }
                        variant="ghost"
                        onClick={() => {}}
                        // className='cursor-pointer'
                    />
                );
            },
        },

        {
            field: "actions",
            headerName: "Actions",
            headerAlign: "center",
            renderCell: (params) => {
                return (
                    <Button variant="text" color="red" className="text-center">
                        Delete
                    </Button>
                );
            },
        },
    ];

    return (
        <DataGrid
            rows={studentData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            // components={{
            //     Toolbar: GridToolbar
            // }}
        />
    );
}
