import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head } from "@inertiajs/react";

import { useForm } from "@inertiajs/react";
import {
    Alert, Button, Checkbox, Option, Select, Textarea, Typography, Input, Collapse, ListItem,
    ListItemPrefix, Switch, Chip, Tooltip
} from "@material-tailwind/react";

import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";

export default function ClubCreate({ auth, availableDays, club }) {

    const populateData = () => {
        return ({
            name: club.name,
            description: club.description,
            rule: club.rule,
            ruleChoice: "",
            is_paid: club.is_paid,
            instances: Array.from({ length: availableDaysForBooking.length * 6 }, (_, index) =>
                availableDaysForBooking[index % availableDaysForBooking.length]
            ).map((day_of_week, i) => {

                const half_term = Math.floor(i / availableDaysForBooking.length) + 1;

                const potentiallyExistingClub = club.club_instances.filter(instance =>
                    instance.day_of_week == day_of_week && instance.half_term == half_term
                )[0];

                if (potentiallyExistingClub) {
                    return {
                        half_term: half_term,
                        day_of_week: day_of_week,
                        year_groups: potentiallyExistingClub.year_groups.map(y => Number(y.year)),
                        capacity: potentiallyExistingClub.capacity, // null means unlimited
                    };
                } else {

                    return ({
                        half_term: half_term,
                        day_of_week: day_of_week,
                        year_groups: [],
                        capacity: null, // null means unlimited
                    });
                }


            }),
            must_do_all: club.must_do_all,
            max_per_term: club.max_per_term,
            max_per_year: club.max_per_year
        })
    }

    const [defaultCapacity, setDefaultCapacity] = useState(20);

    // Really this is the number of terms. 
    const totalCards = 6; // Change this to the number of cards you have

    // Initialize the state with an array of false values, one for each card
    const [cardOpen, setCardOpen] = useState(Array(totalCards).fill(false));

    // Handler function to toggle the state of a card at a given index
    const toggleCard = (index) => {
        const updatedCardOpen = [...cardOpen]; // Create a copy of the state array
        updatedCardOpen[index] = !updatedCardOpen[index]; // Toggle the value at the specified index
        setCardOpen(updatedCardOpen); // Update the state
    };

    // Define a custom sorting function
    function daySort(a, b) {
        const daysInWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        return daysInWeek.indexOf(a) - daysInWeek.indexOf(b);
    }

    const availableDaysForBooking = [...new Set(availableDays.flatMap(d => d.days_array))].sort(daySort);

    const {
        delete: destroy,
        data,
        setData,
        errors,
        post,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = club ? useForm(populateData()) : useForm({
        name: "",
        description: "",
        rule: "",
        ruleChoice: "",
        is_paid: false,
        instances: Array.from({ length: availableDaysForBooking.length * 6 }, (_, index) =>
            availableDaysForBooking[index % availableDaysForBooking.length]
        ).map((day_of_week, i) => ({
            half_term: Math.floor(i / availableDaysForBooking.length) + 1,
            day_of_week: day_of_week,
            year_groups: [7, 8, 9, 10, 11].filter(year => availableDays.filter(aV => aV.year == year)[0].days_array.includes(day_of_week)),
            capacity: null, // null means unlimited
        })),
        must_do_all: false,
        max_per_term: null,
        max_per_year: null
    })

    
        

    useEffect(() => {
        if (club) {
            setData(populateData())
        }
    }, [club])

    useEffect(() => {

        if (data.max_per_term && data.max_per_term < 1) {
            setData("max_per_term", 1)
        }

    }, [data.max_per_term])

    useEffect(() => {



        if (data.max_per_year && data.max_per_year < 1) {
            setData("max_per_year", 1)
        }

    }, [data.max_per_year])

    useEffect(() => {
        console.log(data.must_do_all)

        if(data.must_do_all) {
            setData("max_per_term", 0);
            setData("max_per_year", 0);
        }

    }, [data.must_do_all])

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Add New Club
                </h2>
            }
        >
            <Head title={club ? `Update club ${club.name}` : "Add New Club"} />

            <form>
                <div className="container mx-auto flex-col gap-4">

                    <div className="bg-white mt-4 p-6 rounded-lg shadow-sm">

                        <Typography
                            variant="h4"
                        >
                            {club ? `Update club ${club.name}` : "Add New Club"}
                        </Typography>

                        <p className="mt-1 text-sm text-gray-600">
                            {club ? `Update club ${club.name} - note that you will only be able to update details such as the booking limits and availability when users currently cannot book the club, and there are no bookings associated with the club already.` : "Provide details for new club"}
                        </p>

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
                                className="mb-2"
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

                        {
                            club ? <Button className="mt-3" variant="text" color="red"
                                onClick={() => destroy(route("admin.clubs.delete", {id: club.id}))}
                            >Delete</Button>
                                : <></>
                        }
                    </div>

                    <div className="bg-white mt-4 p-6 rounded-lg shadow-sm">

                        <div>

                            <p className="mt-1 mb-3 text-sm text-gray-600">
                                <em><strong>Required</strong></em>: Provide a name for this club.
                            </p>
                            <TextInput
                                id="name"
                                className="w-2/5 mb-4"
                                placeholder="Club Name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                aria-required
                            />
                            {
                                errors.name &&
                                <Alert className="mb-4" color="red" variant="ghost">
                                    {errors.name}
                                </Alert>
                            }
                        </div>
                        <p className="mt-1 mb-3 text-sm text-gray-600">
                            <em><strong>Required</strong></em>: Provide a textual description for this club.
                        </p>
                        <div>
                            <Textarea
                                id="description"
                                label="Club Description"
                                className="w-2/5 mb-4"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                aria-required
                            />
                            {
                                errors.description &&
                                <Alert className="mb-4" color="red" variant="ghost">
                                    {errors.description}
                                </Alert>
                            }
                            <p className="mt-1 mb-3 text-sm text-gray-600">
                                <em><strong>Required</strong></em>: Describe any special rules about this club.
                            </p>
                        </div>
                        <div>
                            <Textarea
                                id="rule"
                                label="Rule Description"
                                className="w-2/5 mb-4"
                                value={data.rule}
                                onChange={(e) =>
                                    setData("rule", e.target.value)
                                }
                            />
                        </div>
                        {
                            errors.rule &&
                            <Alert className="mb-4" color="red" variant="ghost">
                                {errors.rule}
                            </Alert>
                        }


                        <p className="text-sm text-gray-600">
                            <em><strong>Required</strong></em>: Is <strong>payment</strong> required for this club?
                        </p>
                        <Checkbox
                            color={data.is_paid ? "green" : ""}
                            checked={data.is_paid}
                            onChange={() => { setData("is_paid", !data.is_paid) }}
                        />

                        <p className="mt-4 mb-3 text-sm text-gray-600">
                            <em><strong>Required</strong></em>: Configure a ruleset. <br />

                        </p>
                        <div className="p-4 rounded-lg bg-gray-50">
                            <p className="text-sm text-gray-600">
                                How many times can a student pick this club per <strong>term</strong>? (Leave blank for unlimited)

                            </p>
                            <div className="w-32 mt-2">
                                <Input
                                    id="max-per-term"
                                    name="max-per-term"

                                    type="number"
                                    disabled={data.must_do_all}
                                    placeholder="Unlimited"
                                    value={data.max_per_term}
                                    onChange={(e) => setData("max_per_term", e.target.value ? Number(e.target.value) : null)}
                                />
                            </div>
                            <p className="text-sm text-gray-600 mt-4">
                                How many times can a student pick this club per <strong>year</strong>? (Leave blank for unlimited)

                            </p>
                            <div className="w-32 mt-2">
                                <Input
                                    id="max-per-year"
                                    name="max-per-year"

                                    type="number"
                                    disabled={data.must_do_all}

                                    placeholder="Unlimited"
                                    value={data.max_per_year}
                                    onChange={(e) => setData("max_per_year", e.target.value ? Number(e.target.value) : null)}
                                />
                            </div>
                            <p className="text-sm text-gray-600 mt-4">
                                Do the students have to do all of the below clubs? (Overrides max per year and max per term settings).
                            </p>
                            <Checkbox
                                label="Yes"
                                checked={data.must_do_all}
                                onChange={() => { setData("must_do_all", !data.must_do_all) }}
                            >

                            </Checkbox>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm mt-2 p-6 ">
                        <Typography
                            variant="h4"
                        >
                            Set global capacity?
                        </Typography>
                        <p className="mt-1 text-sm text-gray-600 mb-4">
                            You can set a global capacity for all club instances.
                        </p>
                        <p className="mt-1 text-sm text-red-600 mb-4">
                            All clubs start out with an unlimited default capacity,
                            so make sure to change it if this is not the case,
                        </p>

                        <div className="flex gap-20 items-center">
                            <div className="w-32">
                                <Input
                                    type="number"
                                    className="focus:outline-none " // Adjust the width as needed, for example, "w-32" for 32px width
                                    placeholder="Unlimited"
                                    label="Default Capacity"
                                    value={defaultCapacity}
                                    onChange={(e) => {
                                        const valueToPut = e.target.value == "" ? null : e.target.value;
                                        setDefaultCapacity(valueToPut);
                                    }}
                                />
                            </div>
                            <Button
                                color="blue"
                                variant="text"
                                size="lg"
                                // className="w-1/5"
                                onClick={() => {
                                    const updatedInstances = data.instances.map((instance) => {

                                        return {
                                            ...instance,
                                            capacity: defaultCapacity
                                        };

                                    });
                                    setData({ ...data, instances: updatedInstances });
                                }}
                            >
                                Set
                            </Button>
                        </div>

                    </div>
                    <Alert className="mt-4" variant="ghost" color="blue">
                        <strong>
                            Use the following cards to alter when the club is run on a per term basis.
                        </strong>
                        <br />
                        Open the cards to have a more fine-grained control over each day in each term.
                        <br />
                        <br />
                        <strong>Warning!</strong>
                        <br />
                        Pressing "Add All" will enable all possible year groups for all relatively eligible days. It does not act as an undo button.
                    </Alert>
                    <div className="mt-4">
                        <div>
                            {cardOpen.map((isOpen, index) => {
                                const term = index + 1;

                                const numberOfTimesClubRunInTerm = data.instances.filter(instance =>
                                    instance.half_term == term
                                ).filter(instance => instance.year_groups.length).length

                                return (
                                    <div key={index}>
                                        <div className="bg-white rounded-lg shadow-sm p-3">
                                            <div className="flex justify-between items-center "  >
                                                <div className="flex gap-4 items-center">
                                                    <Typography variant="h5" className="tracking-widest uppercase font-black">Term {term}</Typography>
                                                    {
                                                        numberOfTimesClubRunInTerm ?
                                                            <Tooltip
                                                                content={`This club will run on ${numberOfTimesClubRunInTerm} different days in this term`}

                                                            >
                                                                <Chip
                                                                    value={`${numberOfTimesClubRunInTerm} instances`}
                                                                    color="green"
                                                                />
                                                            </Tooltip>
                                                            :
                                                            <Tooltip
                                                                content={`This club will not run during this term`}

                                                            >
                                                                <Chip
                                                                    value={`${numberOfTimesClubRunInTerm} instances`}
                                                                    color="red"

                                                                />
                                                            </Tooltip>
                                                    }

                                                    <div className="flex gap-1">
                                                        {
                                                            data.instances.filter(instance =>
                                                                instance.half_term == term
                                                            ).map(instance => (
                                                                instance.year_groups.length ?
                                                                    <Tooltip
                                                                        content={"Years " + JSON.stringify(instance.year_groups)}
                                                                    >
                                                                        <Chip
                                                                            value={instance.day_of_week.substring(0, 3)}
                                                                            variant="ghost"
                                                                            color="green"
                                                                        // icon={
                                                                        //     <Checkbox
                                                                        //         color="green"
                                                                        //         ripple={false}
                                                                        //         checked={true}
                                                                        //         disabled
                                                                        //         containerProps={{ className: "p-0" }}
                                                                        //         className="-ml-px border-2 border-green-900 before:hidden checked:border-green-900 checked:bg-green-900"
                                                                        //     />
                                                                        // }
                                                                        />
                                                                    </Tooltip>
                                                                    : <Tooltip
                                                                        content="No year groups selected"
                                                                    >
                                                                        <Chip
                                                                            value={instance.day_of_week.substring(0, 3)}
                                                                            variant="ghost"
                                                                            color="red"
                                                                        // icon={
                                                                        //     <Checkbox
                                                                        //         color="red"
                                                                        //         ripple={false}
                                                                        //         checked={false}
                                                                        //         disabled
                                                                        //         containerProps={{ className: "p-0" }}
                                                                        //         className="-ml-px border-2 border-red-900 before:hidden checked:border-green-900 checked:bg-green-900"
                                                                        //     />
                                                                        // }
                                                                        />
                                                                    </Tooltip>
                                                            ))
                                                        }
                                                    </div>
                                                    <Button
                                                        variant="text"
                                                        size="sm"
                                                        color="red"
                                                        onClick={() => {
                                                            const updatedInstances = data.instances.map((instance) => {


                                                                if (instance.half_term === term) {
                                                                    return {
                                                                        ...instance,
                                                                        year_groups: [],
                                                                    };
                                                                }
                                                                return instance;
                                                            });
                                                            setData({ ...data, instances: updatedInstances });

                                                        }}
                                                    >
                                                        Remove all
                                                    </Button>
                                                    <Button
                                                        variant="text"
                                                        size="sm"
                                                        onClick={() => {
                                                            const updatedInstances = data.instances.map((instance) => {

                                                                if (instance.half_term === term) {

                                                                    const eligibleYears = [7, 8, 9, 10, 11].filter(yearGroup => {
                                                                        const aDs = availableDays.filter(aV => aV.year == yearGroup)[0]
                                                                        return aDs.days_array.includes(instance.day_of_week);
                                                                    });

                                                                    return {
                                                                        ...instance,
                                                                        year_groups: eligibleYears,
                                                                    };
                                                                }
                                                                return instance;
                                                            });
                                                            setData({ ...data, instances: updatedInstances });
                                                        }}
                                                    >
                                                        Add all
                                                    </Button>
                                                </div>
                                                <Button
                                                    color=""
                                                    variant="outlined"
                                                    onClick={() => toggleCard(index)}
                                                >
                                                    {isOpen ? (
                                                        <div className="flex gap-2 items-center">
                                                            Close
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={2.3}
                                                                stroke="currentColor"
                                                                className="w-6 h-6"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M4.5 15.75l7.5-7.5 7.5 7.5"
                                                                />
                                                            </svg>
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-2 items-center">
                                                            Open
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={2.3}
                                                                stroke="currentColor"
                                                                className="w-6 h-6"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </Button>

                                            </div>
                                            <div className="flex gap-1 mt-4">
                                                {
                                                    [7, 8, 9, 10, 11].map(yearGroup =>
                                                        [...new Set(data.instances.filter(instance => instance.half_term == term).flatMap(i => i.year_groups))]
                                                            .includes(yearGroup) ?
                                                            <Tooltip
                                                                content={`Available to this year group on days ${JSON.stringify(
                                                                    data.instances.filter(instance => instance.half_term == term)
                                                                        .filter(instance => instance.year_groups.includes(yearGroup)).flatMap(i => i.day_of_week)
                                                                )}`}
                                                            >
                                                                <Chip
                                                                    value={`Year ${yearGroup}`}
                                                                    variant="ghost"
                                                                    color="green"
                                                                // className= text-center"
                                                                // icon={
                                                                //     <Checkbox
                                                                //         color="green"
                                                                //         ripple={false}
                                                                //         checked={true}
                                                                //         disabled
                                                                //         containerProps={{ className: "p-0" }}
                                                                //         className="-ml-px border-2 border-green-900 before:hidden checked:border-green-900 checked:bg-green-900"
                                                                //     />
                                                                // }
                                                                />
                                                            </Tooltip>
                                                            :
                                                            <Chip
                                                                value={`Year ${yearGroup}`}
                                                                variant="ghost"
                                                                color="red"
                                                            // className= text-center"
                                                            // icon={
                                                            //     <Checkbox
                                                            //         color="green"
                                                            //         ripple={false}
                                                            //         checked={true}
                                                            //         disabled
                                                            //         containerProps={{ className: "p-0" }}
                                                            //         className="-ml-px border-2 border-green-900 before:hidden checked:border-green-900 checked:bg-green-900"
                                                            //     />
                                                            // }
                                                            />
                                                    )
                                                }
                                            </div>
                                        </div>

                                        <Collapse open={isOpen} className="mt-3 mb-3" key={index} >
                                            <div className="bg-white p-4 rounded-lg shadow-md mb-1 ">
                                                <Typography variant="h4">Instances</Typography>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    Modify more closely and in more detail exactly when and for whom <strong>{data.name ? data.name : "Unnamed Club"} </strong> is run.
                                                </p>
                                                {
                                                    availableDaysForBooking.map(day => {

                                                        const instanceData = data.instances.filter(instance =>
                                                            instance.half_term == term && instance.day_of_week == day
                                                        )[0];




                                                        return (
                                                            <div className="mb-3 mt-3 border-t" key={`${index}-${day}`}>

                                                                <div className="flex gap-4 items-baseline">
                                                                    <Typography variant="h6" className="mt-2">
                                                                        Term {term} - {day}
                                                                    </Typography>
                                                                    {
                                                                        !instanceData.year_groups.length &&
                                                                        <p className="mt-1 text-sm text-red-600 font-bold">
                                                                            This club will not run on this day
                                                                        </p>
                                                                    }
                                                                </div>

                                                                <p className="mt-1 text-sm text-gray-600">
                                                                    For which year groups is this club eligible?
                                                                </p>

                                                                <div className="flex gap-3 ">
                                                                    {
                                                                        [7, 8, 9, 10, 11].map(yearGroup => {

                                                                            const isDayYearGroupEligible = availableDays.filter(aV => aV.year == yearGroup)[0]
                                                                                .days_array.includes(day);

                                                                            return (
                                                                                isDayYearGroupEligible ?
                                                                                    <ListItem key={`${index}-${day}-${yearGroup}`} className="p-0 w-20">
                                                                                        <label className="flex w-full cursor-pointer items-center px-3 py-2">
                                                                                            <ListItemPrefix className="mr-1">
                                                                                                <Checkbox
                                                                                                    checked={instanceData.year_groups.includes(yearGroup)}
                                                                                                    onChange={() => {
                                                                                                        const updatedInstances = data.instances.map((instance) => {
                                                                                                            if (instance.half_term === term && instance.day_of_week === day) {
                                                                                                                if (instance.year_groups.includes(yearGroup)) {
                                                                                                                    return {
                                                                                                                        ...instance,
                                                                                                                        year_groups: instance.year_groups.filter(yg => yg !== yearGroup),
                                                                                                                    };
                                                                                                                } else {
                                                                                                                    return {
                                                                                                                        ...instance,
                                                                                                                        year_groups: [...instance.year_groups, yearGroup],
                                                                                                                    };
                                                                                                                }
                                                                                                            }
                                                                                                            return instance;
                                                                                                        });
                                                                                                        setData({ ...data, instances: updatedInstances });
                                                                                                    }}
                                                                                                />
                                                                                            </ListItemPrefix>
                                                                                            <Typography
                                                                                                color="blue-gray"
                                                                                                className="font-medium"
                                                                                            >
                                                                                                {yearGroup}
                                                                                            </Typography>
                                                                                        </label>
                                                                                    </ListItem>
                                                                                    :
                                                                                    <></>
                                                                            )

                                                                        })
                                                                    }

                                                                    <Button
                                                                        variant="text" color="blue" size="sm"
                                                                        onClick={() => {
                                                                            const updatedInstances = data.instances.map((instance) => {

                                                                                const eligibleYears = [7, 8, 9, 10, 11].filter(yearGroup => {
                                                                                    const aDs = availableDays.filter(aV => aV.year == yearGroup)[0]
                                                                                    return aDs.days_array.includes(day);
                                                                                });

                                                                                if (instance.half_term === term && instance.day_of_week === day) {
                                                                                    return {
                                                                                        ...instance,
                                                                                        year_groups: instance.year_groups.length < eligibleYears.length ? eligibleYears : [],
                                                                                    };
                                                                                }
                                                                                return instance;
                                                                            });
                                                                            setData({ ...data, instances: updatedInstances });
                                                                        }}
                                                                    >Toggle all</Button>
                                                                </div>
                                                                <p className="mt-1 text-sm text-gray-600 mb-3">
                                                                    Enter capacity. Leave blank for unlimited.
                                                                </p>
                                                                <TextInput
                                                                    type="number"
                                                                    placeholder="Unlimited"
                                                                    value={instanceData.capacity == null ? "" : instanceData.capacity}
                                                                    onChange={(e) => {
                                                                        const updatedInstances = data.instances.map((instance) => {
                                                                            if (instance.half_term === term && instance.day_of_week === day) {

                                                                                const valueToPut = e.target.value == "" ? null : e.target.value

                                                                                return {
                                                                                    ...instance,
                                                                                    capacity: valueToPut
                                                                                };
                                                                            }
                                                                            return instance;
                                                                        });
                                                                        setData({ ...data, instances: updatedInstances });
                                                                    }}
                                                                />
                                                                <div className="flex flex-col items-end bg-gray-50 mt-2 p-4 rounded-lg">
                                                                    <p className="mt-4 text-sm text-gray-600  font-bold">
                                                                        Copy across to all other terms?
                                                                    </p>
                                                                    <p className="mt-1 text-sm text-gray-600 mb-3 ">
                                                                        Save time and apply this configuration for a {day} across all terms
                                                                    </p>
                                                                    <Button variant="outlined" color="blue"
                                                                        onClick={(e) => {
                                                                            const thisDayYearGroups = instanceData.year_groups;
                                                                            const thisDayCapacity = instanceData.capacity;

                                                                            const updatedInstances = data.instances.map((instance) => {

                                                                                if (instance.day_of_week == instanceData.day_of_week) {
                                                                                    return {
                                                                                        ...instance,
                                                                                        capacity: thisDayCapacity,
                                                                                        year_groups: thisDayYearGroups
                                                                                    }
                                                                                }
                                                                                return instance;
                                                                            })

                                                                            setData({ ...data, instances: updatedInstances });

                                                                        }}
                                                                    >
                                                                        Copy Now
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>

                                        </Collapse>
                                    </div>
                                );
                            })}

                        </div>

                    </div>
                    <div className=" rounded-lg shadow-sm mt-2 p-1 ">
                        <Typography
                            variant="h4"
                        >
                            Submit?
                        </Typography>
                        <p className="mt-1 text-sm text-gray-600 mb-4">
                            Review choices carefully, and when ready, press submit.
                        </p>
                        <p className="mt-1 text-sm text-red-600 mb-4">
                            Remember, all clubs start out with an unlimited default capacity,
                            so make sure to change it if this is not the case,
                        </p>
                        <Button className=" mb-4" color="blue" onClick={() => {
                            club ? put(route("admin.clubs.update", { id: club.id }), {
                                onSuccess: () => reset(),
                                onError: (error) => {
                                }
                            }) : post(route("admin.clubs.create"), {
                                onSuccess: () => reset(),
                                onError: (error) => {
                                }
                            })
                        }}> {club ? "Update" : "Add Club"} </Button>
                    </div>
                </div>

            </form>

        </AuthenticatedLayout>
    );
}
