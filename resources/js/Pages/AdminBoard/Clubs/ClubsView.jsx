import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { useForm } from "@inertiajs/inertia-react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import moment from "moment/moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@inertiajs/inertia-react";

import { Button } from "@material-tailwind/react";

export default function ClubView({ auth, clubs, year }) {

    const {
        delete: destroy,
    } = useForm({});

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
        {
            field: "instances",
            headerName: "Edit",
            width: 60,
            renderCell: (params) => (
                <Link
                    href={route("admin.clubs.index", {
                        id: params.row.id
                    })}

                    className="text-blue-400 hover:underline"
                >
                    <div className="flex gap-2 items-center">
                        Edit
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
            headerName: "Paid?",
            align: "center",
            width: 50,
            renderCell: (params) => {
                if (params.row.is_paid) {
                    return <>
                        <FontAwesomeIcon icon={faDollarSign} /> &nbsp; {params.row.is_paid}
                    </>;
                }
                return "/";
            },
        },
        {
            field: "payment_type",
            headerName: "Payment Type",
            align: "center",
            width: 140,
            headerAlign: "center",
            renderCell: (params) => {
                if (params.row.is_paid) {
                    return <>
                        {params.row.payment_type}
                    </>;
                }
                return "/";
            },
        },
        {
            field: "actions",
            headerName: "",
            headerAlign: "center",
            width: 250,
            align: "center",
            renderCell: (params) => (
                <div className="flex gap-5 items-center">

                    
                    <Button
                        onClick={() => destroy(route("admin.clubs.delete", { id: params.row.id }))}

                        variant="text"
                        color="red"
                        size="sm"
                    >
                        Delete
                    </Button>
                </div>
            ),
        },

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

                <div className="mb-4">
                    <h2 className="text-3xl mb-1">
                        Clubs Overview - {year.year_start} / {year.year_end}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        All the clubs for the ongoing academic year.
                    </p>
                </div>

                <div className="mt-4 mb-4">
                    <a href={route("admin.clubs.new")}>
                        <Button>
                            + New Club
                        </Button>
                    </a>
                </div>

                <div className="bg-white rounded-lg shadow-lg">
                    <DataGrid
                        rows={clubs}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick

                    />
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
