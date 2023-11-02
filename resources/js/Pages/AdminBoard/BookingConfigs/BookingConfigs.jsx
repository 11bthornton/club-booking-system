import React from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import {
    Alert,
    Button,
    Checkbox,
    Chip,
    List,
    ListItem,
    ListItemPrefix,
    Typography
} from "@material-tailwind/react";

import TextInput from "@/Components/TextInput";

import { Transition } from "@headlessui/react";
import { useForm } from "@inertiajs/react";

export default function BookingConfigs({ auth, scheduleData, availableDays, clubData }) {

    // console.log("S", );

    const { post, recentlySuccessful, reset, data, setData, errors } = useForm({
        name: "",
        start_time: null,
        start_date: null,
        end_time: null,
        end_date: null,
        year_groups: [],
        clubs: [],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const availableDaysForBooking = [...new Set(availableDays.flatMap(d => d.days_array))].sort(daySort);
    function daySort(a, b) {
        const daysInWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        return daysInWeek.indexOf(a) - daysInWeek.indexOf(b);
    }

    const toggleClear = () => {
        setData({
            ...data,
            clubs: [],
        });
    };

    const toggleClub = (club) => {
        let newClubs = [...(data.clubs || [])]; // Ensure it's an array
        if (newClubs.includes(club)) {
            // Remove year if it's already in the array
            newClubs = newClubs.filter((c) => c !== club);
        } else {
            // Add year to array if not included
            newClubs.push(club);
        }
        setData({ ...data, clubs: newClubs });
    };

    const toggleAll = () => {
        setData({
            ...data,
            clubs: clubData
                .flatMap((club) => club.club_instances)
                .map((i) => i.id),
        });
    };

    const toggleTermSelect = (term) => {
        let newClubs = [...(data.clubs || [])];

        let clubsToAdd = clubData
            .flatMap((club) => club.club_instances)
            .filter((instance) => instance.half_term == term)
            .map((i) => i.id);

        clubsToAdd.forEach((toAdd) => {
            // console.log("toadd", toAdd);

            if (newClubs.includes(toAdd)) {
                // Remove year if it's already in the array
                newClubs = newClubs.filter((c) => c !== toAdd);
            } else {
                // Add year to array if not included
                newClubs.push(toAdd);
            }
        });

        setData({ ...data, clubs: newClubs });
    };

    const toggleYear = (year) => {
        let newYearGroups = [...(data.year_groups || [])]; // Ensure it's an array
        if (newYearGroups.includes(year)) {
            // Remove year if it's already in the array
            newYearGroups = newYearGroups.filter((y) => y !== year);
        } else {
            // Add year to array if not included
            newYearGroups.push(year);
        }
        setData({ ...data, year_groups: newYearGroups });
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Schedule Bookings to Go Live
                </h2>
            }
        >

            <Head title="Admin Dashboard" />

            <div className="container mx-auto pb-10">

                <div className="bg-white  bg-white shadow sm:rounded-lg mt-4">
                    <ViewScheduled scheduleData={scheduleData} />
                </div>

                <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg mt-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Schedule a new period of system uptime.
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        You can customise the system to be available for certain periods of time, for specific clubs and to specific year groups.
                        Multiple configurations can go live at a time.
                    </p>


                </div>
                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <Alert
                        variant="ghost"
                        color="green"
                        className="mb-2 mt-4"
                    >
                        Club successfully saved!
                    </Alert>
                </Transition>
                {
                    JSON.stringify(errors) != "{}" &&
                    <Alert className="mt-4" color="red" variant="ghost">
                        There were errors, review the form and resubmit.
                    </Alert>
                }
                <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg mt-4">
                    <Typography
                        className="font-bold"
                        variant="h5"
                    >
                        Name
                    </Typography>
                    <p className="mt-1 text-sm text-gray-600">
                        Name this open-booking configuration so it's easier to track at a later date.
                    </p>
                    <TextInput
                        className="mt-3"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="Name your configuration"
                    />
                    {
                        errors.name &&
                        <Alert className="mt-4" color="red" variant="ghost">
                            {errors.name}
                        </Alert>
                    }
                </div>
                <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg mt-4">

                    <Typography variant="h5" className="font-bold ">
                        Select your dates.</Typography>
                    <Alert
                        variant="outlined"
                        className="mb-2 mt-3"
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                />
                            </svg>
                        }
                    >
                        This takes into account timezone changes. Time selected maps to
                        whatever the time is at Bethany on that day.
                    </Alert>

                    <div className="flex gap-4 justify-center mt-6">
                        <div className="flex flex-col items-center gap-10 mb-4 p-5 border-dashed border-2 rounded-xl">
                            <h5 className="text-2xl">
                                When would you like this open period to{" "}
                                <strong className="font-bold">start</strong>?
                            </h5>
                            <div>
                                <input
                                    type="date"
                                    id="start-date"
                                    name="start_date" // matching the name to formData keys
                                    value={data.start_date || ""}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="time"
                                    id="start-time"
                                    name="start_time" // you'd add this to your formData if needed
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-10 mb-4 p-5 border-dashed border-2 rounded-xl">
                            <h5 className="text-2xl">
                                When would you like this open period to{" "}
                                <strong className="font-bold">end</strong>?
                            </h5>
                            <div>
                                <input
                                    type="date"
                                    id="end-date"
                                    name="end_date" // matching the name to formData keys
                                    value={data.end_date || ""}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="time"
                                    id="end-time"
                                    name="end_time" // you'd add this to your formData if needed
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    {
                        errors.start_date &&
                        <Alert className="mt-4" color="red" variant="ghost">
                            {errors.start_date}
                        </Alert>
                    }
                    {
                        errors.start_time &&
                        <Alert className="mt-4" color="red" variant="ghost">
                            {errors.start_time}
                        </Alert>
                    }
                    {
                        errors.end_date &&
                        <Alert className="mt-4" color="red" variant="ghost">
                            {errors.end_date}
                        </Alert>
                    }
                    {
                        errors.end_time &&
                        <Alert className="mt-4" color="red" variant="ghost">
                            {errors.end_time}
                        </Alert>
                    }
                </div>
                <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg mt-4">
                    <Typography variant="h5" className="font-bold ">
                        Which year groups should this apply to?
                    </Typography>
                    <p>
                        You'll have the option to add / remove individual students
                        later, but you can bulk-include year groups here.
                    </p>
                    <List>
                        {[7, 8, 9, 10, 11].map((year) => (
                            <ListItem key={year} className="p-0">
                                <label className="flex w-full cursor-pointer items-center px-3 py-2">
                                    <ListItemPrefix className="mr-3">
                                        <Checkbox
                                            id={`year-${year}`}
                                            ripple={false}
                                            className="hover:before:opacity-0"
                                            containerProps={{
                                                className: "p-0",
                                            }}
                                            checked={
                                                data.year_groups
                                                    ? data.year_groups.includes(
                                                        year,
                                                    )
                                                    : false
                                            }
                                            onChange={() => toggleYear(year)}
                                        />
                                    </ListItemPrefix>
                                    <Typography
                                        color="blue-gray"
                                        className="font-medium"
                                    >
                                        {`Year ${year}`}
                                    </Typography>
                                </label>
                            </ListItem>
                        ))}
                    </List>
                    {
                        errors.year_groups &&
                        <Alert className="mt-4" color="red" variant="ghost">
                            You need to select at least one year.
                        </Alert>
                    }
                </div>
                <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg mt-4 ">

                    <Typography variant="h5" className="font-bold">
                        Which clubs should this apply to?
                    </Typography>
                    <p className="mb-3">
                        You'll have the option to add / remove individual students
                        later, but you can bulk-include year groups here.
                    </p>
                    <div className="flex justify-between">
                        <div className="flex gap-3 items-center">
                            <strong className="font-bold">
                                <p>All Clubs</p>
                            </strong>

                            <Checkbox
                                onChange={toggleAll}
                                checked={clubData
                                    .flatMap((club) => club.club_instances)
                                    .map((i) => i.id)
                                    .every((club) => data.clubs.includes(club))}
                            />
                        </div>

                        <Button variant="text" color="red"
                            onClick={toggleClear}
                        >
                            Clear All
                        </Button>
                    </div>
                    Or:
                    <div className="overflow-x-auto overflow-y-none p-3">
                        <table className="w-full  table-auto text-center ">
                            <thead>
                                <tr>
                                    <td></td>
                                    {[1, 2, 3, 4, 5, 6].map((term) => (
                                        <td colSpan={availableDaysForBooking.length}>Term {term}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td>Select all in Term</td>
                                    {[1, 2, 3, 4, 5, 6].map((term) => (
                                        <td colSpan={availableDaysForBooking.length}>
                                            <Checkbox
                                                checked={clubData
                                                    .flatMap((club) => club.club_instances)
                                                    .filter(
                                                        (instance) =>
                                                            instance.half_term == term,
                                                    )
                                                    .map((i) => i.id)
                                                    .every((club) =>
                                                        data.clubs.includes(club),
                                                    )}
                                                onChange={() => toggleTermSelect(term)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <th className="border-b border-blue-gray-100 bg-gray-400 p-1 ">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            Club Name
                                        </Typography>
                                    </th>
                                    {[1, 2, 3, 4, 5, 6].map((term) =>
                                        availableDaysForBooking.map((day) => (
                                            <th
                                                className={`border-b border-blue-gray-100 p-1 ${term % 2 === 0
                                                    ? "bg-gray-400"
                                                    : "bg-gray-100"
                                                    }`}
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal leading-none opacity-70"
                                                >
                                                    {day.substring(0, 3)}
                                                </Typography>
                                            </th>
                                        )),
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {clubData.filter(club => true).map((club) => (
                                    <tr>
                                        <td>
                                            <Typography
                                                variant="small"
                                                className="text-left"
                                            >
                                                <div className="flex justify-between items-center">
                                                    {club.name}
                                                    <Button
                                                        variant="text"
                                                        onClick={() => {
                                                            let clubsToAdd =
                                                                club.club_instances.map(
                                                                    (i) => i.id,
                                                                );
                                                            let newClubs = [
                                                                ...(data.clubs || []),
                                                            ];

                                                            clubsToAdd.forEach((toAdd) => {
                                                                if (
                                                                    newClubs.includes(toAdd)
                                                                ) {
                                                                } else {
                                                                    // Add year to array if not included
                                                                    newClubs.push(toAdd);
                                                                }
                                                            });

                                                            setData({
                                                                ...data,
                                                                clubs: newClubs,
                                                            });
                                                        }}
                                                    >
                                                        All
                                                    </Button>
                                                </div>
                                            </Typography>
                                        </td>
                                        {[1, 2, 3, 4, 5, 6].map((term) =>
                                            availableDaysForBooking.map((day) => {
                                                const clubInstance =
                                                    club.club_instances.find(
                                                        (instance) =>
                                                            instance.half_term === term &&
                                                            instance.day_of_week === day,
                                                    );

                                                return clubInstance ? (
                                                    <td key={`${term}-${day}`}>
                                                        <Checkbox
                                                            defaultChecked={true}
                                                            onChange={() =>
                                                                toggleClub(
                                                                    clubInstance.id,
                                                                )
                                                            }
                                                            // className="w-3 h-3"
                                                            checked={data.clubs.includes(
                                                                clubInstance.id,
                                                            )}
                                                        />
                                                    </td>
                                                ) : <td>X</td>;
                                            }),
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {
                        errors.clubs &&
                        <Alert className="mt-4" color="red" variant="ghost">
                            You need to select at least one club.
                        </Alert>
                    }
                </div>
                <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg mt-4">
                    <Typography variant="h5" className="mb-4">
                        Submit?
                    </Typography>
                    <Button
                        onClick={() => {
                            post(route("admin.booking-config.create"), {
                                onSuccess: () => reset(),
                            })
                        }}
                    >Schedule</Button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


function ViewScheduled({ isOpen, handleOpen, scheduleData }) {
    const TABLE_HEAD = ["Name", "Scheduled at", "Ends at", "Live", "Actions"];

    const { delete: destroy } = useForm({});

    const liveConfigurations = Object.values(scheduleData).filter(bC => bC.isLive);

    return (

        <div>

            <div className="flex justify-between items-center">
                <Typography className="p-4 font-bold" variant="h5">
                    {liveConfigurations.length} Live Configurations
                </Typography>
                {
                    liveConfigurations.length ?
                        <Chip className="mr-3"
                            value="Live"
                            color="green"
                        >
                        </Chip>
                        : Object.values(scheduleData).length ?
                            <Chip className="mr-3"
                                value="Scheduled"
                                color="amber"
                            >
                            </Chip> :
                            <Chip className="mr-3"
                                value="Offline"
                                color="red"
                            >
                            </Chip>

                }
            </div>
            <table className="w-full  table-auto text-center">
                {
                    // JSON.stringify(scheduleData)
                }
                <thead>
                    <tr>
                        {TABLE_HEAD.map((head) => (
                            <th
                                key={head}
                                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal leading-none opacity-70"
                                >
                                    {head}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Object.values(scheduleData).map((data, index) => {
                        const isLast = index === data.length - 1;
                        const classes = isLast ? "p-1 " : "p-1  text-rig ";

                        return (
                            <tr key={data.id}>
                                <td className={classes}>{data.name}</td>
                                <td className={classes}>
                                    {data.scheduled_at}
                                </td>
                                <td className={classes}> {data.ends_at}</td>
                                <td className={classes}>
                                    <ScheduleStatusChip data={data} />
                                </td>
                                <td className="flex justify-center items-start p-4 text-rig cursor-pointer">
                                    <Button
                                        variant="text"
                                        size="sm"
                                        color="red"
                                        onClick={() => {
                                            destroy(route("admin.booking-config.delete", { id: data.id }), {})
                                        }}
                                    >
                                        delete
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>

            </table>
        </div>

    );
}

function ScheduleStatusChip({ data }) {
    return (
        <div className="flex gap-2 justify-center items-center ">
            <Chip
                variant="ghost"
                color={data.isLive ? "green" : "amber"}
                size="sm"
                value={data.isLive ? "Live" : "scheduled"}
                icon={
                    <span
                        className={`mx-auto mt-1 block h-2 w-2 rounded-full ${data.isLive ? "bg-green-900" : "bg-amber-900"
                            } content-['']`}
                    />
                }
            />
        </div>
    );
}
