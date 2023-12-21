
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Select, Option } from "@material-tailwind/react";

import { Input } from "@material-tailwind/react";

import { DataGrid, } from "@mui/x-data-grid";
import {

    Alert,
    Chip,
    Button,
} from "@material-tailwind/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Link } from "@inertiajs/react";
import {
    faEdit,

} from "@fortawesome/free-solid-svg-icons";

import { useForm } from "@inertiajs/react";
import StudentImportForm from "./StudentCreate/StudentImportForm";

export default function Students({ auth, students }) {

    const { data, setData, post, reset, errors } = useForm({
        file: null
    });

    // Function to handle file input change
    const handleFileInputChange = (e) => {
        const selectedFile = e.target.files[0]; // Get the selected file
        setData('file', selectedFile); // Update the 'file' field in the form data
    };

    // Function to reset the form and clear the selected file
    const handleReset = () => {
        reset(); // Reset the form data
    };
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

            <div className="container mx-auto p-4 mt-5 rounded-lg ">
                <div>
                    <p className="text-3xl mb-4">Manage Students</p>
                </div>

                <UserDataGrid studentData={students} />

                <div className="mt-4">


                    <div className="max-w-7xl mx-auto space-y-6">

                        <div className="p-4 sm:p-8 bg-white shadow-md sm:rounded-lg">
                            <h2 className="text-xl font-medium text-gray-900">
                                Create / Import Users
                            </h2>

                            <p className="mt-1 text-sm text-gray-600">
                                Use these forms to import users in bulk or create them manually.
                            </p>
                        </div>
                        <div className="p-4 sm:p-8 bg-white shadow-md sm:rounded-lg">
                            <h2 className="text-lg font-medium text-gray-900">
                                Import Users
                            </h2>

                            {
                                JSON.stringify(errors) != "{}" && <Alert color="red" variant="ghost">
                                    There were some errors
                                    <ul className="ml-3">
                                        {
                                            Object.values(errors).map((err, index) => (
                                                <li key={index}>{err}</li>
                                            ))
                                        }
                                    </ul>
                                </Alert>
                            }

                            <Alert variant="ghost" color="orange" className="mt-4">The system will only accept <strong className="font-black">.xlsx</strong> files. </Alert>
                            <p className="mt-1 text-sm text-gray-600">
                                Upload a file with all the new users you wish to add. This should be a .xlsx file with the following headers.
                            </p>
                            <ul className="text-sm mt-3 ml-3">
                                <li>username *</li>
                                <li>year * - number only</li>
                                <li>password *</li>
                                <li>email</li>
                                <li>first_name</li>
                                <li>last_name</li>
                            </ul>
                            <p className="mt-3 text-sm text-gray-600">
                                All of the header names are required but the columns can be in any order. While the header names are required, you only have to poplate the fields
                                of the items with asterisks above. Do not include the instructional material in the header, just one word (or connected with underscores) suffices. E.g. username or last_name.

                            </p>
                            <p className="mt-3 text-sm text-gray-600">
                                Users must be unique. Any duplicates already found in the system will cause the whole batch to fail and none will be uploaded.
                            </p>

                            {/* File input */}
                            <input
                                type="file"
                                accept=".xlsx" // Specify accepted file types if needed
                                onChange={handleFileInputChange} // Call the function when the file input changes
                                style={{ display: "none" }} // Hide the input element
                            />

                            {/* Display the selected file */}
                            <div className="bg-gray-50 p-3 mt-3">
                                {data.file ? 
                                    <p className="text-sm text-gray-600">
                                        Selected File: {data.file.name}
                                    </p> : <p className="text-sm text-gray-600">
                                        No file is currently selected.
                                    </p>
                                }

                                {/* Button to trigger file input click */}
                                <Button
                                    className="mt-3 mr-2"
                                    size="sm"
                                    onClick={() => {
                                        // Trigger the file input when this button is clicked
                                        document.querySelector('input[type="file"]').click();
                                    }}
                                    variant="outlined"
                                >
                                    Select File
                                </Button>
                            </div>
                            <br />
                            {/* Reset button */}
                            <div className="flex justify-between mt-1">

                                {/* Upload button */}
                                <Button
                                    // variant="outlined"
                                    className="mt-3"
                                    onClick={() => {
                                        post(route("admin.students.import"),
                                            {
                                                onSuccess: () => handleReset(),
                                                preserveScroll: true,
                                            })
                                    }}
                                >
                                    Upload
                                </Button>
                                <Button
                                    // variant="outlined"
                                    variant="text"
                                    color="red"
                                    className="mt-3"
                                    onClick={handleReset} // Call the reset function to clear the selected file
                                >
                                    Reset
                                </Button>


                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <StudentCreate />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


function StudentCreate({ /**  */ }) {
    const { post, data, setData, reset } = useForm({
        username: "",
        first_name: "",
        second_name: "",
        email: "",
        year: "",
        password: ""
    });

    const yearOptions = [
        { value: "7", label: "Year 7" },
        { value: "8", label: "Year 8" },
        { value: "9", label: "Year 9" },
        { value: "10", label: "Year 10" },
        { value: "11", label: "Year 11" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="p-4 sm:p-8 bg-white shadow-md sm:rounded-lg">
                <h2 className="text-lg font-medium text-gray-900">
                    Create a new student
                </h2>


                <p className="mt-1 text-sm text-gray-600">Submit a new student</p>

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

                {/* Year Field */}
                <div className="mt-4">
                    <label htmlFor="year" className="text-gray-700 mt-3 mb-2">
                        Select Year:
                    </label>
                    <div className="mt-3">
                        <Select
                            id="year"
                            name="year"
                            label="Year Group"
                            value={data.year}
                            onChange={(e) => setData("year", e)}
                            className="mt-1 mb-4"
                        >
                            {yearOptions.map((yearOption) => (
                                <Option key={yearOption.value} value={yearOption.value}>
                                    {yearOption.label}
                                </Option>
                            ))}
                        </Select>

                    </div>
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
                            post(route("admin.students.store"),
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



function UserDataGrid({ studentData }) {

    const { delete: destroy } = useForm({});

    // Define the columns
    const columns = [
        { field: "id", headerName: "ID", width: 10 },
        {
            field: "username",
            headerName: "Username",
            width: 150,
            renderCell: (params) => (
                <Link
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
                </Link>
            ),
        },
        {
            field: "year",
            headerName: "Year",
            headerAlign: "Center",
            align: "Center",
            width: 10
        },
        {
            field: "count_chosen",
            headerName: "Number Chosen",
            align: "center",
            headerAlign: "center",
            width: 150,
            renderCell: (params) => {
                const row = params.row;
                const count = Object.values(row.organized_by_term)
                    .flatMap((day) => Object.values(day))
                    .filter((x) => x).length;

                return (
                    // <Chip
                    //     value={`${count} Booked`}
                    //     // variant="outlined"
                    //     color={
                    //         count === 0
                    //             ? "red"
                    //             : count < 12
                    //                 ? "orange"
                    //                 : "green"
                    //     }
                    //     variant="ghost"
                    //     onClick={() => { }}
                    // // className='cursor-pointer'
                    // />
                    <>{count}</>
                );
            },
        },


        {
            field: "email",
            headerName: "Email",
            width: 250
        },
        {
            field: "first_name",
            headerName: "First Name",

        },
        {
            field: "second_name",
            headerName: "Last Name",

        },

        {
            field: "actions",
            headerName: "",
            headerAlign: "center",
            width: 250,
            renderCell: (params) => {
                return (
                    <div className="flex justify-between gap-2 ml-2 ">
                        {/* <Button variant="outlined" className="text-center" size="sm"
                            onClick={() => destroy(route("admin.students.delete", { id: params.row.id }))}
                        >
                            Email Choices
                        </Button> */}
                        <Button variant="text" color="red" className="text-center" size="sm"
                            onClick={() => destroy(route("admin.students.delete", { id: params.row.id }))}
                        >
                            Delete
                        </Button>
                    </div>
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
            className="bg-white rounded-lg shadow-md  "
        // components={{
        //     Toolbar: GridToolbar
        // }}
        />
    );
}
