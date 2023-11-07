import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head } from "@inertiajs/react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Input, Tooltip } from "@material-tailwind/react";

import { useForm } from "@inertiajs/react";

export default function Dashboard({ auth, admins }) {

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Admins
                </h2>
            }
        >

            <Head title="Admin Dashboard" />
            <div className="container mx-auto p-4 mt-5 rounded-lg ">
                <AdminDataGrid adminData={admins} auth={auth} />
                <div className="mt-4">
                    <AdminCreate />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function AdminDataGrid({ adminData, auth }) {

    const { delete: destroy } = useForm({});

    // Define the columns
    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "username" },
        {
            field: "email",
            width: 150
        },
        {
            field: "first_name",
            headerName: "First Name"
        },
        {
            field: "second_name",
            field: "Last Name"
        },

        {
            field: "actions",
            headerName: "",
            headerAlign: "center",
            width: 250,
            renderCell: (params) => {
                return (
                    auth.user.id != params.row.id ?
                        <div className="flex justify-between gap-2 ml-2">

                            <Button variant="text" color="red" className="text-center" size="sm"
                                onClick={() => destroy(
                                    route("admin.admins.delete", { id: params.row.id }),

                                )}
                            >
                                Delete
                            </Button>
                        </div>
                        : <div className="flex justify-between gap-2 ml-2">

                            <Button disabled variant="text" color="red" className="text-center" size="sm"
                                onClick={() => destroy(
                                    route("admin.admins.delete", { id: params.row.id }),

                                )}
                            >
                                Can't delete self

                            </Button>
                        </div>
                );
            },

        },

    ];

    return (
        <>
            <DataGrid
                rows={adminData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                className="bg-white rounded-lg shadow-md"
            // components={{
            //     Toolbar: GridToolbar
            // }}
            /></>

    );
}


function AdminCreate({ /**  */ }) {
    const { post, data, setData, reset } = useForm({
        username: "",
        first_name: "",
        second_name: "",
        email: "",
        password: ""
    });


    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="p-4 sm:p-8 bg-white shadow-md sm:rounded-lg">
                <h2 className="text-lg font-medium text-gray-900">
                    Create a new Admin
                </h2>


                <p className="mt-1 text-sm text-gray-600">Fill in the details for a new admin</p>

                {/* Username Field */}
                <div className="mt-4">
                    <label htmlFor="username" className="text-gray-700">
                        Username:
                    </label>
                    <Input
                        type="text"
                        id="username"
                        name="username"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        className="mt-1 mb-4"
                    />
                </div>

                {/* First Name Field */}
                <div className="mt-4">
                    <label htmlFor="first_name" className="text-gray-700">
                        First Name:
                    </label>
                    <Input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={data.first_name}
                        onChange={(e) => setData("first_name", e.target.value)}
                        className="mt-1 mb-4"
                    />
                </div>

                {/* Last Name Field */}
                <div className="mt-4">
                    <label htmlFor="second_name" className="text-gray-700">
                        Last Name:
                    </label>
                    <Input
                        type="text"
                        id="second_name"
                        name="second_name"
                        value={data.second_name}
                        onChange={(e) => setData("second_name", e.target.value)}
                        className="mt-1 mb-4"
                    />
                </div>

                {/* Email Field */}
                <div className="mt-4">
                    <label htmlFor="email" className="text-gray-700">
                        Email:
                    </label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="mt-1 mb-4"
                    />
                </div>



                <div className="mt-4">
                    <label htmlFor="password" className="text-gray-700">
                        Password:
                    </label>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        className="mt-1 mb-4"
                    />
                </div>

                {/* Additional Fields (You can add these as needed) */}
                <br />
                <div className="flex justify-between items-center">
                    <Button
                        // variant="outlined"
                        className="mt-3"
                        onClick={() => {
                            post(route("admin.admins.store"),
                                {
                                    onSuccess: () => reset()
                                }
                            )
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => reset()}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}