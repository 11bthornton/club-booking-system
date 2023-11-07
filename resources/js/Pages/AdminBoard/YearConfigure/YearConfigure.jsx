import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head } from "@inertiajs/react";
import React, { useEffect, useRef } from "react";

import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { Alert, Button, Checkbox, Radio, Typography, } from '@material-tailwind/react'

import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { useSpinner } from "@/LoadingContext";

import {
    Transition,

} from "@headlessui/react";
import {
    Select, Option, List,
    ListItem,
    ListItemPrefix,
} from '@material-tailwind/react';

export default function YearConfigure({ auth, year, clubs }) {


    const [file, setFile] = useState({});

    const {
        data,
        setData,
        post,
        processing,
        reset,
        errors,
        recentlySuccessful
    } = useForm({
        yearStart: year ? year.year_start + 1 : null,
        yearEnd: year ? year.year_end + 1 : null,

        term1_start: year ? year.term1_start : null,
        term2_start: year ? year.term2_start : null,
        term3_start: year ? year.term3_start : null,
        term4_start: year ? year.term4_start : null,
        term5_start: year ? year.term5_start : null,
        term6_start: year ? year.term6_start : null,

        term1_name: year ? year.term1_name : "Autumn 1",
        term2_name: year ? year.term2_name : "Autumn 2",
        term3_name: year ? year.term3_name : "Winter 1",
        term4_name: year ? year.term4_name : "Winter 2",
        term5_name: year ? year.term5_name : "Spring 1",
        term6_name: year ? year.term6_name : "Spring 2",
        
        usersFile: file,
        keepClubs: [],
        transferStudents: true,
        days: [7, 8, 9, 10, 11].map((year) => {
            return {
                year: year,
                day_1: "Wednesday",
                day_2: "Friday"
            };
        })
    });

    const { setShowSpinner } = useSpinner();

    useEffect(() => {
        setShowSpinner(processing);
    }, [processing]);

    useEffect(() => {
        setData("yearEnd", Number(data.yearStart) + 1)
    }, [data.yearStart])

    useEffect(() => {
        setData("yearStart", Number(data.yearEnd) - 1)
    }, [data.yearEnd])

    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileMessage, setSelectedFileMessage] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedFile(file);
            setMessage(`Selected file: ${file.name}`);
        } else {
            setSelectedFile(null);
            setMessage('');
        }
    };

    const [transferUsers, setTransferUsers] = useState(false);
    const yearEndInput = useRef();

    return (
        <AuthenticatedLayout user={auth.user} header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Configure a New Academic Year
            </h2>
        }>
            <Head title="Configure Year" />
            
            <div className="py-12 sm:p-4">

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <div className=" shadow sm:rounded-lg">

                            <Alert
                                color="green"
                                variant="ghost"
                            >
                                Successfully saved configuration.
                            </Alert>
                        </div>
                    </Transition>

                    {
                        JSON.stringify(errors) == "{}" ? <></> : <div className=" shadow sm:rounded-lg">

                            <Alert
                                color="red"
                                variant="ghost"
                            >
                                There were errors. Please see below.
                            </Alert>
                        </div>
                    }

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h2 className="text-lg font-medium text-gray-900">
                            Year Dates
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 mb-4">
                            Set the academic year start and year end. E.g. 23 for 2023.
                        </p>

                        <InputLabel
                            htmlFor="year-start"
                            value="Year Start"
                        />

                        <TextInput
                            id="year-start"
                            type="number"
                            className="w-1/5 mb-4"
                            value={data.yearStart}
                            onChange={(e) => {
                                setData("yearStart", e.target.value)
                            }
                            }
                            aria-required
                        />

                        <InputLabel
                            htmlFor="year-end"
                            value="Year End"
                        />

                        <TextInput
                            id="year-end"
                            type="number"
                            value={data.yearEnd}
                            className="w-1/5 mb-1"
                            onChange={(e) => {
                                setData("yearEnd", e.target.value)
                            }
                            }
                            aria-required
                        />
                        {
                            errors.yearStart && <Alert color="red" variant="ghost" className="mt-1">{errors.yearStart}</Alert>
                        }

                        {
                            errors.yearEnd && <Alert color="red" variant="ghost" className="mt-1">{errors.yearEnd}</Alert>
                        }

                        <p className="mt-4 text-sm text-gray-600 mb-2">
                            Now set the term dates, these are purely for visual purposes and only convey information to the students
                            when they're booking their clubs.
                        </p>
                        <div class="grid grid-cols-3 gap-4">

                            {
                                [1, 2, 3, 4, 5, 6].map(term => (

                                    <div className="flex flex-col ">
                                        <InputLabel
                                            value={`Term ${term} name and start date`}
                                        />

                                        <TextInput
                                            id={`term${term}_name`}
                                            value={data[`term${term}_name`]}
                                            placeholder="Name this term"
                                            onChange={(e) => {
                                                setData(`term${term}_name`, e.target.value)
                                                }
                                            }
                                            name={`term${term}_name`}
                                            aria-required
                                        />
                                        
                                        <input
                                            type="date"
                                            id={`term${term}_start`}
                                            className="mt-2"
                                            name={`term${term}_start`} // matching the name to formData keys
                                            value={data[`term${term}_start`]}
                                            onChange={(e) => {
                                                setData(`term${term}_start`, e.target.value)

                                            }}
                                        />
                                    </div>
                                ))
                            }
                        </div>

                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h2 className="text-lg font-medium text-gray-900">
                            Students
                        </h2>
                        <p className="mb-3 text-sm text-black-600 font-bold">
                            Users in Year 11 already in the system from previous academic year(s) will be deleted.
                        </p>
                        <p className="mt-1 mb-4 text-sm text-gray-600">
                            You can opt to transfer across (current) years 7-10 through to the next academic year,
                            with each student retaining the same login information. Or, instead, you can upload
                            a csv for the students you need for this academic year. With this option, students will be
                            provided with new login information. Naturally, this option will be required for the first year
                            the system is run.
                        </p>
                        {year ? <><InputLabel
                            value={`Transfer across from the current academic year, ${year.year_start}/${year.year_end}?`}
                            check
                        />
                            <div className="flex gap-3">
                                <Radio
                                    name="type"
                                    label="No"
                                    onChange={() => setData("transferStudents", !data.transferStudents)}
                                    defaultChecked={!data.transferStudents}
                                />
                                <Radio
                                    name="type"
                                    label="Yes"
                                    onChange={() => setData("transferStudents", !data.transferStudents)}
                                    defaultChecked={data.transferStudents}
                                />
                            </div></> : <></>}
                            <Alert variant="ghost" color="orange" className="mt-4">The system will only accept <strong className="font-black">.xlsx</strong> files. </Alert>
                            <p className="mt-1 text-sm text-gray-600">
                                Upload a file with all the new users you wish to add. This should be a .xlsx file with the following headers.
                            </p>
                            <ul className="text-sm mt-3 ml-3">
                                <li>username *</li>
                                <li>year *</li>
                                <li>email</li>
                                <li>first_name</li>
                                <li>last_name</li>
                            </ul>
                            <p className="mt-3 text-sm text-gray-600">
                                All of the header names are required but the columns can be in any order. While the header names are required, you only have to poplate the fields
                                of the items with asterisks above.

                            </p>
                            <p className="mt-3 text-sm text-gray-600">
                                Users must be unique. Any duplicates already found in the system will cause the whole batch to fail and none will be uploaded.
                            </p>
                        <div className="p-4 bg-gray-50 mt-3 rounded-sm">
                            <Typography
                                variant="h6"
                            >
                                Upload
                            </Typography>
                            <p className=" text-sm text-gray-600  min-h-[40px]">
                                {
                                    data.transferStudents ?
                                        <span>
                                            Upload file with any new users you have to add. Users in Years 7-10 from the previous academic year, _, will move
                                            up a year and retain the same login information.
                                        </span>
                                        :
                                        <span >
                                            Upload file with all new users.
                                        </span>
                                }
                                <br />
                            </p>

                            <div className="mt-2">

                                <input
                                    id="file-upload"
                                    name="file"
                                    type="file"
                                    // className="hidden"
                                    onChange={e => {
                                        setFile(e.target.files[0])
                                        setData("usersFile", e.target.files[0])
                                    }}
                                />

                            </div>
                            {
                                errors.usersFile &&
                                <Alert className="mt-2" color="red" variant="ghost">
                                    <div>{errors.usersFile}</div>
                                    Please check your file and only include new users.
                                </Alert>
                            }
                        </div>
                    </div>
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h2 className="text-lg font-medium text-gray-900">
                            Days
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 mb-4">
                            On what days of the week do each year group partake in their clubs? This has defaulted to
                            Wednesday and Friday for all year groups.
                        </p>

                        {
                            data.days.map((yearGroupDays) => (
                                <div key={yearGroupDays.year} className="mb-4">
                                    <p className="text-lg font-medium mb-2">Year {yearGroupDays.year}</p>
                                    <div className="flex space-x-4">
                                        <Select
                                            value={yearGroupDays.day_1}
                                            label="Day 1"
                                            onChange={(event) => {
                                                const updatedData = [...data.days]; // Create a copy of the data array
                                                const yearIndex = updatedData.findIndex(
                                                    (item) => item.year === yearGroupDays.year
                                                );

                                                if (yearIndex !== -1) {
                                                    if (event === yearGroupDays.day_2) {
                                                        // Prevent day_1 and day_2 from being the same
                                                        alert("Day 1 and Day 2 cannot be the same.");
                                                    } else {
                                                        updatedData[yearIndex].day_1 = event; // Update day_1
                                                        setData("days", updatedData); // Set the updated data
                                                    }
                                                }
                                            }}
                                        >
                                            {[
                                                "Monday",
                                                "Tuesday",
                                                "Wednesday",
                                                "Thursday",
                                                "Friday",
                                                "Saturday",
                                                "Sunday",
                                            ].map((day) => (
                                                <Option
                                                    key={day} value={day} className="p-3"
                                                    disabled={yearGroupDays.day_2 == day}
                                                >
                                                    {day}
                                                </Option>
                                            ))}
                                        </Select>
                                        <Select
                                            label="Day 2"
                                            value={yearGroupDays.day_2}

                                            onChange={(event) => {
                                                const updatedData = [...data.days]; // Create a copy of the data array
                                                const yearIndex = updatedData.findIndex(
                                                    (item) => item.year === yearGroupDays.year
                                                );

                                                if (yearIndex !== -1) {
                                                    if (event === yearGroupDays.day_1) {
                                                        // Prevent day_1 and day_2 from being the same
                                                        alert("Day 1 and Day 2 cannot be the same.");
                                                    } else {
                                                        updatedData[yearIndex].day_2 = event; // Update day_2
                                                        setData("days", updatedData); // Set the updated data
                                                    }
                                                }
                                            }}
                                        >
                                            {[
                                                "Monday",
                                                "Tuesday",
                                                "Wednesday",
                                                "Thursday",
                                                "Friday",
                                                "Saturday",
                                                "Sunday",
                                            ].map((day) => (
                                                <Option
                                                    key={day} value={day} className="p-3"
                                                    disabled={yearGroupDays.day_1 == day}
                                                >
                                                    {day}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>

                                </div>
                            ))
                        }

                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h2 className="text-lg font-medium text-gray-900">
                            Clubs
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 mb-4">
                            Similarly, opt to use the same clubs. If you need to change a club, <strong>don't</strong> select
                            it here. Instead, recreate and reconfigure it after you submit this form.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center">
                            {Array.from({ length: 1 }, () => clubs).flat().map((club) => (
                                <ListItem key={club.id} className="p-0">
                                    <label className="flex w-full cursor-pointer items-center px-3 py-2">
                                        <ListItemPrefix className="mr-3">
                                            <Checkbox
                                                id={`club-${club.id}`}
                                                ripple={false}
                                                className="hover:before:opacity-0"
                                                checked={data.keepClubs.includes(club.id)}
                                                onChange={() => {
                                                    // Clone the keepClubs array to avoid mutating the state directly
                                                    const updatedKeepClubs = [...data.keepClubs];
                                                    console.log("curr", club);

                                                    if (updatedKeepClubs.includes(club.id)) {
                                                        // If club.id is already in keepClubs, remove it
                                                        const index = updatedKeepClubs.indexOf(club.id);
                                                        if (index !== -1) {
                                                            updatedKeepClubs.splice(index, 1);
                                                        }
                                                    } else {
                                                        // If club.id is not in keepClubs, add it
                                                        updatedKeepClubs.push(club.id);
                                                    }

                                                    // Update the state with the new keepClubs array
                                                    setData("keepClubs", updatedKeepClubs); // Assuming you have a setter function for keepClubs
                                                }}

                                            />
                                        </ListItemPrefix>
                                        <Typography
                                            color="blue-gray"
                                            className="font-medium"
                                        >
                                            {club.name}
                                        </Typography>
                                    </label>
                                </ListItem>
                            ))}

                        </div>
                        {
                            Object.keys(errors).filter(key => key.startsWith('keepClubs')).map(key =>
                                <Alert className="mt-2" color="red" variant="ghost">
                                    You're trying to transfer a club which doesn't exist (it's probably been very recently deleted.)
                                    Refresh the page and try again.
                                </Alert>
                            )
                        }
                    </div>
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h2 className="text-lg font-medium text-gray-900">
                            Submit
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 ">
                            Check over your settings and press submit.
                        </p>
                        <p className="mt-2 mb-4
                             text-red-600 text-sm font-bold ">
                            Pressing submit will swap the system over to this academic year. Export all data
                            now, before it will be deleted. This action <strong className="font-black">cannot</strong> be
                            undone.
                        </p>
                        <Button
                            size="md"
                            onClick={() => {
                                post(route('admin.academic-year.store'), {
                                    onSuccess: () => reset(),
                                })
                            }}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}