import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Checkbox, Switch, Button, TextField, Tooltip } from "@mui/material";
import { Divider } from "@mui/material";
import Link from "@mui/material/Link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import toast from "react-hot-toast";
import {
    faDownload,
    faEdit,
    faPlus,
    faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

const createYearColumn = (year, handleCheckboxClick) => {
    return {
        field: `year_${year}`,
        headerName: `Year ${year}`,
        width: 60,
        renderCell: (params) => {
            const instance = params.row;
            const yearExists = instance.year_groups.some(
                (group) => group.year === year.toString(),
            );
            return (
                <Checkbox
                    checked={yearExists}
                    onChange={() =>
                        handleCheckboxClick(instance.id, year, !yearExists)
                    } // Invert the checked state
                />
            );
        },
    };
};

// import Tooltip from '@mui/material';

export default function ClubShow({ auth, club, uniqueUsers }) {
    const [currentInstances, setCurrentInstances] = useState(
        club.club_instances,
    );
    const [currentClub, setCurrentClub] = useState(club);

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setCurrentClub((prevState) => ({
            ...prevState,
            name: newName,
        }));
    };

    const handleDescriptionChange = (e) => {
        const newDescription = e.target.value;
        setCurrentClub((prevState) => ({
            ...prevState,
            description: newDescription,
        }));
    };

    const handleRuleChange = (e) => {
        const newRule = e.target.value;
        setCurrentClub((prevState) => ({
            ...prevState,
            rule: newRule,
        }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Update Club - {currentClub.name}
                </h2>
            }
        >
            <Head title="Update Club Info" />

            <div className="container mx-auto p-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="flex justify-between items-baseline mb-4">
                    <h2 className="font-semibold text-4xl text-gray-800 leading-tight">
                        Update Club - {currentClub.name}
                    </h2>

                    <div className="mb-2 flex justify-end gap-2">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                                handleEditInstances(currentClub, setCurrentClub)
                            }
                            disabled={club == currentClub}
                        >
                            Update
                        </Button>
                        <Button color="error">Delete</Button>
                    </div>
                </div>

                <div className="flex gap-10 mb-4">
                    <div className="flex flex-col gap-5 mb-4 w-1/2">
                        <TextField
                            label="Name"
                            variant="outlined"
                            value={currentClub.name}
                            onChange={handleNameChange}
                            required={true}
                            className="w-1/2"
                        />

                        <TextField
                            label="Description"
                            variant="outlined"
                            value={currentClub.description}
                            onChange={handleDescriptionChange}
                            multiline
                            rows={4}
                            required={true}
                        />

                        <div className="flex items-center gap-3">
                            <select value={"selectedRule"} disabled>
                                <option value="wholeYear">
                                    One instance per year
                                </option>
                                <option value="perTerm">
                                    One instance per term
                                </option>
                                <option value="any">
                                    As many instances as they'd like
                                </option>
                            </select>

                            <Tooltip title="If you need to change this, delete and recreate club">
                                <FontAwesomeIcon icon={faQuestionCircle} />
                            </Tooltip>
                        </div>

                        <TextField
                            disabled
                            minRows={4}
                            label="Extra Rule Information"
                            placeholder="Rule"
                            value={currentClub.rule}
                            onChange={handleRuleChange}
                        />
                    </div>

                    <Divider
                        orientation="vertical"
                        flexItem
                        style={{ margin: "0 10px" }}
                    />

                    <div>
                        <h1 className="text-2xl font-semibold mb-2">
                            Quick Actions
                        </h1>
                        <Divider className="" />
                        <div className="flex justify-between gap-4 mt-2 mb-2">
                            <div className="flex gap-4">
                                <Button variant="outlined">
                                    <div className="flex gap-3 items-baseline">
                                        <p>Export to CSV</p>
                                        <FontAwesomeIcon icon={faDownload} />
                                    </div>
                                </Button>
                                <Button
                                    variant="outlined"
                                    className="mt-2"
                                    color="secondary"
                                >
                                    All Students
                                </Button>
                            </div>
                            <Button
                                // variant="outlined"
                                color="secondary"
                                className="mt-2"
                            >
                                Button 3
                            </Button>
                        </div>
                        <Divider />

                        <p className="mt-3">
                            Can't think of anymore quick actions but here's a
                            nice big space for them!
                        </p>

                        <div className="mb-2">
                            <Button size="extra-large" variant="outlined">
                                <div className="flex gap-2 justify-between items-center">
                                    <p>Add Instance</p>
                                    <FontAwesomeIcon icon={faPlus} />
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>

                <ClubInstanceDataGrid
                    currentClub={currentClub}
                    setCurrentClub={setCurrentClub}
                />
            </div>

            {JSON.stringify(currentClub)}
        </AuthenticatedLayout>
    );
}

const ClubInstanceDataGrid = ({ currentClub, setCurrentClub }) => {
    const handleDeleteRow = (instanceId) => {
        console.log("Trying to delete", instanceId);
        const updatedInstances = currentClub.club_instances.filter(
            (instance) => instance.id !== instanceId,
        );
        setCurrentClub({ ...currentClub, club_instances: updatedInstances });
    };

    const handleCheckboxClick = (instanceId, year, isChecked) => {
        const updatedInstances = currentClub.club_instances.map((instance) => {
            if (instance.id === instanceId) {
                if (isChecked) {
                    instance.year_groups.push({ year: year.toString() });
                } else {
                    instance.year_groups = instance.year_groups.filter(
                        (group) => group.year !== year.toString(),
                    );
                }
            }
            return instance;
        });

        setCurrentClub({ ...currentClub, club_instances: updatedInstances });
    };

    const deleteButtonColumn = {
        field: "action",
        headerName: "Actions",
        width: 150,
        renderCell: (params) => (
            <Button
                // variant="contained"
                color="error"
                size="small"
                onClick={() => handleDeleteRow(params.row.id)}
            >
                Remove
            </Button>
        ),
    };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        // { field: 'club_id', headerName: 'Club ID', width: 100 },
        { field: "half_term", headerName: "Term", width: 120 },
        { field: "day_of_week", headerName: "Day of Week", width: 140 },
        {
            field: "capacity",
            headerName: "Spaces Left",
            width: 120,
            renderCell: (params) => {
                return (
                    <>
                        {params.row.capacity} / &nbsp;{" "}
                        <strong>
                            {params.row.capacity + params.row.users_count}
                        </strong>
                    </>
                );
            },
        },
        {
            field: "users_count",
            headerName: "# Students",
            width: 140,
            renderCell: (params) => {
                return (
                    <>
                        {params.row.users_count}
                        &nbsp;
                        {params.row.users_count > 0 ? (
                            <Link color="primary" underline="hover">
                                <div className="flex gap-2 items-center cursor-pointer">
                                    (view)
                                </div>
                            </Link>
                        ) : (
                            <></>
                        )}
                    </>
                );
            },
        },
        // Add year columns dynamically
        createYearColumn(7, handleCheckboxClick),
        createYearColumn(8, handleCheckboxClick),
        createYearColumn(9, handleCheckboxClick),
        createYearColumn(10, handleCheckboxClick),
        createYearColumn(11, handleCheckboxClick),

        {
            field: "openForBookings",
            headerName: "Open for Bookings",
            headerAlign: "center", // you can set this to 'left', 'right', or 'center'
            renderHeader: () => <span>Open for Bookings?</span>,
            width: 180,
            align: "center",
            renderCell: (params) => {
                return (
                    <Switch
                        checked={params.value}
                        // onChange={() => handleToggle(params)}
                        color="primary"
                    />
                );
            },
        },
        {
            field: "hasDependencies",
            headerName: "Requires Commitment",
            width: 190,
            renderCell: (params) => {
                return (
                    <>
                        {params.row.must_go_with_club_ids.length ? (
                            <div>Hey</div>
                        ) : (
                            <div>No</div>
                        )}
                    </>
                );
            },
        },
        deleteButtonColumn,
    ];

    return (
        <div style={{ width: "100%" }}>
            <h1 className="text-2xl mb-2">Current Instances</h1>
            <DataGrid
                rows={currentClub.club_instances}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                components={{
                    Toolbar: GridToolbar,
                }}
            />
        </div>
    );
};

async function handleEditInstances(currentClub, setCurrentClub) {
    try {
        const response = await fetch(`/admin/clubs/${currentClub.id}/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
            body: JSON.stringify({
                club: currentClub,
                instances: currentClub.club_instances,
            }),
        });

        const responseData = await response.json();

        setCurrentClub(responseData.data.club);
        // setCurrentInstances(responseData.data.club.club_instances);

        if (responseData.updatedInstances) {
            console.log("handling response, ", responseData.message);
            // setClubs((prev) => [...prev, responseData]);
            toast("Club Successfully Updated!", {
                icon: "👏",
            });
            // handleCloseModal();
        }
    } catch (error) {
        console.error(error);
        toast(responseData.message, {
            icon: "❌",
        });
    }
}
